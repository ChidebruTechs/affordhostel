import requests
import base64
import json
from datetime import datetime
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Payment, MPesaTransaction
from .serializers import PaymentSerializer, MPesaPaymentSerializer, PayPalPaymentSerializer
from bookings.models import Booking

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

def get_mpesa_access_token():
    """Get M-Pesa access token"""
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    r = requests.get(api_url, auth=(consumer_key, consumer_secret))
    json_response = r.json()
    
    return json_response.get('access_token')

def generate_password():
    """Generate M-Pesa password"""
    shortcode = settings.MPESA_SHORTCODE
    passkey = settings.MPESA_PASSKEY
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    
    data_to_encode = shortcode + passkey + timestamp
    encoded_string = base64.b64encode(data_to_encode.encode())
    
    return encoded_string.decode('utf-8'), timestamp

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def initiate_mpesa_payment(request):
    serializer = MPesaPaymentSerializer(data=request.data)
    if serializer.is_valid():
        booking_id = serializer.validated_data['booking_id']
        phone_number = serializer.validated_data['phone_number']
        amount = serializer.validated_data['amount']
        
        try:
            booking = Booking.objects.get(id=booking_id, student=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create payment record
        transaction_id = f"AH{datetime.now().strftime('%Y%m%d%H%M%S')}{booking.id}"
        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=amount,
            method='mpesa',
            transaction_id=transaction_id,
            phone_number=phone_number
        )
        
        # Get M-Pesa access token
        access_token = get_mpesa_access_token()
        password, timestamp = generate_password()
        
        # Prepare STK push request
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        request_data = {
            "BusinessShortCode": settings.MPESA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": settings.MPESA_SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": settings.MPESA_CALLBACK_URL,
            "AccountReference": transaction_id,
            "TransactionDesc": f"Payment for {booking.hostel.name}"
        }
        
        response = requests.post(api_url, json=request_data, headers=headers)
        response_data = response.json()
        
        if response_data.get('ResponseCode') == '0':
            # Create M-Pesa transaction record
            MPesaTransaction.objects.create(
                payment=payment,
                merchant_request_id=response_data.get('MerchantRequestID'),
                checkout_request_id=response_data.get('CheckoutRequestID'),
                phone_number=phone_number,
                amount=amount,
                account_reference=transaction_id,
                transaction_desc=request_data['TransactionDesc']
            )
            
            payment.status = 'processing'
            payment.save()
            
            return Response({
                'message': 'STK push sent successfully',
                'transaction_id': transaction_id,
                'checkout_request_id': response_data.get('CheckoutRequestID')
            })
        else:
            payment.status = 'failed'
            payment.failure_reason = response_data.get('errorMessage', 'Unknown error')
            payment.save()
            
            return Response({
                'error': 'Failed to initiate payment',
                'details': response_data
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def mpesa_callback(request):
    """Handle M-Pesa callback"""
    callback_data = request.data
    
    try:
        # Extract callback data
        stk_callback = callback_data.get('Body', {}).get('stkCallback', {})
        merchant_request_id = stk_callback.get('MerchantRequestID')
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        
        # Find the transaction
        mpesa_transaction = MPesaTransaction.objects.get(
            checkout_request_id=checkout_request_id
        )
        
        # Update transaction
        mpesa_transaction.result_code = str(result_code)
        mpesa_transaction.result_desc = result_desc
        
        payment = mpesa_transaction.payment
        
        if result_code == 0:  # Success
            # Extract callback metadata
            callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            for item in callback_metadata:
                if item.get('Name') == 'MpesaReceiptNumber':
                    mpesa_transaction.mpesa_receipt_number = item.get('Value')
                    payment.external_transaction_id = item.get('Value')
            
            payment.status = 'completed'
            payment.booking.status = 'confirmed'
            payment.booking.payment_id = payment.external_transaction_id
            payment.booking.save()
            
            # Create notification
            from notifications.models import Notification
            Notification.objects.create(
                user=payment.user,
                title='Payment Successful',
                message=f'Your payment for {payment.booking.hostel.name} has been confirmed.',
                type='success'
            )
            
        else:  # Failed
            payment.status = 'failed'
            payment.failure_reason = result_desc
            
            # Create notification
            from notifications.models import Notification
            Notification.objects.create(
                user=payment.user,
                title='Payment Failed',
                message=f'Your payment for {payment.booking.hostel.name} failed. Please try again.',
                type='error'
            )
        
        mpesa_transaction.save()
        payment.save()
        
        return Response({'message': 'Callback processed successfully'})
        
    except MPesaTransaction.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_status(request, transaction_id):
    """Check payment status"""
    try:
        payment = Payment.objects.get(transaction_id=transaction_id, user=request.user)
        return Response({
            'status': payment.status,
            'transaction_id': payment.transaction_id,
            'external_transaction_id': payment.external_transaction_id,
            'amount': payment.amount,
            'created_at': payment.created_at
        })
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def initiate_paypal_payment(request):
    serializer = PayPalPaymentSerializer(data=request.data)
    if serializer.is_valid():
        booking_id = serializer.validated_data['booking_id']
        amount = serializer.validated_data['amount']
        
        try:
            booking = Booking.objects.get(id=booking_id, student=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create payment record
        transaction_id = f"PP{datetime.now().strftime('%Y%m%d%H%M%S')}{booking.id}"
        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=amount,
            method='paypal',
            transaction_id=transaction_id,
            status='processing'
        )
        
        # In a real implementation, you would integrate with PayPal API here
        # For demo purposes, we'll simulate a successful payment
        
        # Simulate PayPal processing delay
        import time
        time.sleep(2)
        
        # Mark payment as completed
        payment.status = 'completed'
        payment.external_transaction_id = f"PAYPAL_{transaction_id}"
        payment.booking.status = 'confirmed'
        payment.booking.payment_id = payment.external_transaction_id
        payment.booking.save()
        payment.save()
        
        # Create notification
        from notifications.models import Notification
        Notification.objects.create(
            user=payment.user,
            title='Payment Successful',
            message=f'Your PayPal payment for {payment.booking.hostel.name} has been confirmed.',
            type='success'
        )
        
        return Response({
            'message': 'PayPal payment processed successfully',
            'transaction_id': transaction_id,
            'external_transaction_id': payment.external_transaction_id
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
