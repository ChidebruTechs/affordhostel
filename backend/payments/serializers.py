from rest_framework import serializers
from .models import Payment, MPesaTransaction

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'amount', 'method', 'status',
            'transaction_id', 'phone_number', 'receipt_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']

class MPesaPaymentSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    phone_number = serializers.CharField(max_length=15)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

class PayPalPaymentSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

class MPesaTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MPesaTransaction
        fields = '__all__'