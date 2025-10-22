from django.contrib import admin
from .models import Hostel, HostelImage, RoomType, Wishlist

@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = ['name', 'landlord', 'price', 'university', 'verified', 'available']
    list_filter = ['verified', 'available', 'university', 'created_at']
    search_fields = ['name', 'location', 'university']
    list_editable = ['verified', 'available']

@admin.register(HostelImage)
class HostelImageAdmin(admin.ModelAdmin):
    list_display = ['hostel', 'caption', 'is_primary']
    list_filter = ['is_primary', 'created_at']

@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ['hostel', 'type', 'price', 'available', 'total']
    list_filter = ['type']

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'hostel', 'created_at']
    list_filter = ['created_at']