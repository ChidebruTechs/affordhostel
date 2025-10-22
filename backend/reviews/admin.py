from django.contrib import admin
from .models import Review, ReviewHelpful

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'hostel', 'rating', 'helpful_count', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'hostel__name', 'comment']

@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ['user', 'review', 'created_at']
    list_filter = ['created_at']