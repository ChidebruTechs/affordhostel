from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('landlord', 'Landlord'),
        ('agent', 'Agent'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    university = models.CharField(max_length=100, blank=True)
    student_id = models.CharField(max_length=50, blank=True)
    course = models.CharField(max_length=100, blank=True)
    year_of_study = models.CharField(max_length=20, blank=True)
    business_name = models.CharField(max_length=100, blank=True)
    business_registration = models.CharField(max_length=50, blank=True)
    tax_pin = models.CharField(max_length=20, blank=True)
    bank_account = models.CharField(max_length=50, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    experience = models.CharField(max_length=20, blank=True)
    specialization = models.CharField(max_length=100, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    interests = models.JSONField(default=list, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True)
    backup_codes = models.JSONField(default=list, blank=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"