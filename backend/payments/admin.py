from django.contrib import admin
from .models import Payment, MPesaTransaction

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['user', 'booking', 'amount', 'method', 'status', 'created_at']
    list_filter = ['method', 'status', 'created_at']
    search_fields = ['user__username', 'transaction_id', 'external_transaction_id']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']

@admin.register(MPesaTransaction)
class MPesaTransactionAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'amount', 'result_code', 'mpesa_receipt_number', 'created_at']
    list_filter = ['result_code', 'created_at']
    search_fields = ['phone_number', 'mpesa_receipt_number', 'account_reference']
    readonly_fields = ['created_at']