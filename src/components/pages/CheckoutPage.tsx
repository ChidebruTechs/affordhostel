import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Shield, Download, CheckCircle, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { generatePDFReceipt } from '../../utils/pdfGenerator';
import { ReceiptData } from '../../types';

interface CheckoutPageProps {
  bookingData: {
    hostelId: string;
    hostelName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    amount: number;
    duration: number;
  };
  onBack: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ bookingData, onBack }) => {
  const { user, createBooking } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const serviceFee = Math.round(bookingData.amount * 0.025); // 2.5% service fee
  const totalAmount = bookingData.amount + serviceFee;

  const handleMpesaPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate M-Pesa STK Push
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment processing
      const mockTransactionId = `MP${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setTransactionId(mockTransactionId);
      
      // Create booking
      const booking = await createBooking({
        ...bookingData,
        paymentId: mockTransactionId
      });

      // Generate receipt data
      const receipt: ReceiptData = {
        bookingId: booking.id,
        transactionId: mockTransactionId,
        hostelName: bookingData.hostelName,
        roomType: bookingData.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        duration: bookingData.duration,
        amount: bookingData.amount,
        serviceFee,
        totalAmount,
        paymentMethod: 'M-Pesa',
        phoneNumber,
        timestamp: new Date(),
        customerName: user?.name || '',
        customerEmail: user?.email || ''
      };

      setReceiptData(receipt);
      setPaymentStatus('success');
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTransactionId = `PP${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setTransactionId(mockTransactionId);
      
      // Create booking
      const booking = await createBooking({
        ...bookingData,
        paymentId: mockTransactionId
      });

      // Generate receipt data
      const receipt: ReceiptData = {
        bookingId: booking.id,
        transactionId: mockTransactionId,
        hostelName: bookingData.hostelName,
        roomType: bookingData.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        duration: bookingData.duration,
        amount: bookingData.amount,
        serviceFee,
        totalAmount,
        paymentMethod: 'PayPal',
        phoneNumber: user?.email || '',
        timestamp: new Date(),
        customerName: user?.name || '',
        customerEmail: user?.email || ''
      };

      setReceiptData(receipt);
      setPaymentStatus('success');
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDFReceipt = () => {
    if (!receiptData) return;
    generatePDFReceipt(receiptData);
  };

  const downloadTextReceipt = () => {
    if (!receiptData) return;

    const receiptContent = `
AFFORDHOSTEL BOOKING RECEIPT
============================

Booking Details:
- Booking ID: ${receiptData.bookingId}
- Transaction ID: ${receiptData.transactionId}
- Date: ${receiptData.timestamp.toLocaleDateString()}

Customer Information:
- Name: ${receiptData.customerName}
- Email: ${receiptData.customerEmail}
- Phone: ${receiptData.phoneNumber}

Accommodation Details:
- Hostel: ${receiptData.hostelName}
- Room Type: ${receiptData.roomType}
- Check-in: ${receiptData.checkIn}
- Check-out: ${receiptData.checkOut}
- Duration: ${receiptData.duration} months

Payment Summary:
- Accommodation Fee: Ksh ${receiptData.amount.toLocaleString()}
- Service Fee: Ksh ${receiptData.serviceFee.toLocaleString()}
- Total Amount: Ksh ${receiptData.totalAmount.toLocaleString()}
- Payment Method: ${receiptData.paymentMethod}

Thank you for choosing AffordHostel!
For support, contact: support@affordhostel.com
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AffordHostel_Receipt_${receiptData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Transaction ID:</span>
                <p className="font-semibold">{transactionId}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount Paid:</span>
                <p className="font-semibold">Ksh {totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Hostel:</span>
                <p className="font-semibold">{bookingData.hostelName}</p>
              </div>
              <div>
                <span className="text-gray-600">Room Type:</span>
                <p className="font-semibold">{bookingData.roomType}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={downloadPDFReceipt} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Receipt
            </Button>
            <Button variant="outline" onClick={downloadTextReceipt} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Text Receipt
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Hostels
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600 mb-8">
            There was an issue processing your payment. Please try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setPaymentStatus('idle')}>
              Try Again
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Hostel
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {paymentMethod === 'mpesa' ? (
              <Smartphone className="h-10 w-10 text-blue-600 animate-pulse" />
            ) : (
              <DollarSign className="h-10 w-10 text-blue-600 animate-pulse" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Payment</h1>
          {paymentMethod === 'mpesa' ? (
            <p className="text-xl text-gray-600 mb-8">
              Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
            </p>
          ) : (
            <p className="text-xl text-gray-600 mb-8">
              Processing your PayPal payment. Please wait while we confirm your transaction.
            </p>
          )}

          {paymentMethod === 'mpesa' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Smartphone className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-lg font-semibold text-blue-800">M-Pesa STK Push Sent</span>
              </div>
              <p className="text-blue-700">
                A payment request has been sent to <strong>{phoneNumber}</strong>
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Enter your M-Pesa PIN on your phone to complete the transaction
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-lg font-semibold text-blue-800">PayPal Payment Processing</span>
              </div>
              <p className="text-blue-700">
                Your PayPal payment is being processed securely
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Please do not close this window while we confirm your payment
              </p>
            </div>
          )}

          <div className="animate-pulse">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-3 md:mb-4 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Booking</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Booking Summary */}
        <Card className="p-3 md:p-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Booking Summary</h2>
          
          <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Hostel:</span>
              <span className="text-sm md:text-base font-semibold text-right">{bookingData.hostelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Room Type:</span>
              <span className="text-sm md:text-base font-semibold">{bookingData.roomType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Check-in:</span>
              <span className="text-sm md:text-base font-semibold">{new Date(bookingData.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Check-out:</span>
              <span className="text-sm md:text-base font-semibold">{new Date(bookingData.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Duration:</span>
              <span className="text-sm md:text-base font-semibold">{bookingData.duration} months</span>
            </div>
          </div>

          <div className="border-t pt-2 md:pt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Accommodation Fee:</span>
              <span className="text-sm md:text-base">Ksh {bookingData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm md:text-base text-gray-600">Service Fee (2.5%):</span>
              <span className="text-sm md:text-base">Ksh {serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base md:text-lg font-semibold border-t pt-2 md:pt-3">
              <span>Total Amount:</span>
              <span className="text-purple-600">Ksh {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-3 md:p-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Payment Method</h2>
          
          <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
            <div
              className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'mpesa' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('mpesa')}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">M-Pesa</h3>
                  <p className="text-sm text-gray-600">Pay with your M-Pesa mobile money</p>
                </div>
              </div>
            </div>

            <div
              className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'paypal' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">PayPal</h3>
                  <p className="text-sm text-gray-600">Pay securely with PayPal</p>
                </div>
              </div>
            </div>

            <div
              className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all opacity-50 ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">Credit/Debit Card</h3>
                  <p className="text-sm text-gray-600">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="space-y-2 md:space-y-3">
              <Input
                label="M-Pesa Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                required
              />
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm md:text-base font-medium text-green-800">Secure Payment</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your payment is processed securely through Safaricom M-Pesa. 
                      You will receive an STK push notification on your phone.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleMpesaPayment}
                disabled={!phoneNumber || isProcessing}
                className="w-full text-sm md:text-base"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Pay Ksh {totalAmount.toLocaleString()} with M-Pesa
                  </>
                )}
              </Button>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="space-y-2 md:space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm md:text-base font-medium text-blue-800">Secure PayPal Payment</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment will be processed securely through PayPal. 
                      You can pay with your PayPal balance, bank account, or credit card.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayPalPayment}
                disabled={isProcessing}
                className="w-full text-sm md:text-base"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Ksh {totalAmount.toLocaleString()} with PayPal
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="mt-3 md:mt-4 text-center">
            <p className="text-sm text-gray-600">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;