from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingListCreateView.as_view(), name='booking-list-create'),
    path('<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('<int:booking_id>/status/', views.update_booking_status, name='update-booking-status'),
    path('<int:booking_id>/history/', views.BookingStatusHistoryView.as_view(), name='booking-history'),
]