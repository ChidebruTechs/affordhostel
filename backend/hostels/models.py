from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Hostel(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=200)
    university = models.CharField(max_length=100)
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hostels')
    amenities = models.JSONField(default=list)
    verified = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0
    
    @property
    def review_count(self):
        return self.reviews.count()

class HostelImage(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hostel_images/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.hostel.name} - Image"

class RoomType(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='room_types')
    type = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    features = models.JSONField(default=list)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.hostel.name} - {self.type}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'hostel']
    
    def __str__(self):
        return f"{self.user.username} - {self.hostel.name}"