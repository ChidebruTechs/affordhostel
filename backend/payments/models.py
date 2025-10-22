from django.db import models
from django.contrib.auth import get_user_model
from bookings.models import Booking

User = get_user_model()

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('paypal', 'PayPal'),
        ('card', 'Credit/Debit Card'),
        ('bank', 'Bank Transfer'),
    ]
    
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, unique=True)
    external_transaction_id = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    receipt_url = models.URLField(blank=True)
    failure_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.amount} ({self.status})"

class MPesaTransaction(models.Model):
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='mpesa_transaction')
    merchant_request_id = models.CharField(max_length=100)
    checkout_request_id = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=100)
    transaction_desc = models.CharField(max_length=200)
    result_code = models.CharField(max_length=10, blank=True)
    result_desc = models.TextField(blank=True)
    mpesa_receipt_number = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"M-Pesa: {self.phone_number} - {self.amount}"