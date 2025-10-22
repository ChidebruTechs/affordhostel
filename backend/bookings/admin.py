from django.contrib import admin
from .models import Booking, BookingStatusHistory

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['student', 'hostel', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['student__username', 'hostel__name']
    list_editable = ['status']

@admin.register(BookingStatusHistory)
class BookingStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['booking', 'status', 'changed_by', 'created_at']
    list_filter = ['status', 'created_at']