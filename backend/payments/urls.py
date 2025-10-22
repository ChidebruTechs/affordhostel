from django.urls import path
from . import views

urlpatterns = [
    path('', views.PaymentListView.as_view(), name='payment-list'),
    path('mpesa/initiate/', views.initiate_mpesa_payment, name='initiate-mpesa-payment'),
    path('paypal/initiate/', views.initiate_paypal_payment, name='initiate-paypal-payment'),
    path('mpesa/callback/', views.mpesa_callback, name='mpesa-callback'),
    path('status/<str:transaction_id>/', views.payment_status, name='payment-status'),
]