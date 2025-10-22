from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pyotp
import qrcode
import io
import base64
from .models import User, Profile
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    ProfileSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer
)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['POST'])
def upload_avatar(request):
    user = request.user
    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']
        user.save()
        return Response({
            'avatar_url': request.build_absolute_uri(user.avatar.url)
        })
    return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset(request):
    serializer = PasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            
            # Send email with reset link
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{user.pk}/{token}/"
            send_mail(
                'Password Reset - AffordHostel',
                f'Click the link to reset your password: {reset_link}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            
            return Response({'message': 'Password reset email sent'})
        except User.DoesNotExist:
            return Response({'message': 'Password reset email sent'})  # Don't reveal if email exists
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request, user_id, token):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = User.objects.get(pk=user_id)
            if default_token_generator.check_token(user, token):
                user.set_password(serializer.validated_data['password'])
                user.save()
                return Response({'message': 'Password reset successful'})
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({'error': 'New password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'})

@api_view(['POST'])
def setup_two_factor(request):
    user = request.user
    
    # Generate secret key
    secret = pyotp.random_base32()
    
    # Create TOTP object
    totp = pyotp.TOTP(secret)
    
    # Generate QR code
    provisioning_uri = totp.provisioning_uri(
        name=user.email,
        issuer_name="AffordHostel"
    )
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_code_data = base64.b64encode(buffer.getvalue()).decode()
    
    # Generate backup codes
    backup_codes = [pyotp.random_base32()[:8] for _ in range(5)]
    
    # Store secret temporarily (in production, use secure storage)
    request.session['temp_2fa_secret'] = secret
    request.session['backup_codes'] = backup_codes
    
    return Response({
        'secret': secret,
        'qr_code': f"data:image/png;base64,{qr_code_data}",
        'backup_codes': backup_codes
    })

@api_view(['POST'])
def verify_two_factor(request):
    user = request.user
    code = request.data.get('code')
    secret = request.session.get('temp_2fa_secret')
    
    if not secret:
        return Response({'error': 'No setup session found'}, status=status.HTTP_400_BAD_REQUEST)
    
    totp = pyotp.TOTP(secret)
    
    if totp.verify(code):
        # Save 2FA settings to user profile
        profile, created = Profile.objects.get_or_create(user=user)
        profile.two_factor_secret = secret
        profile.two_factor_enabled = True
        profile.backup_codes = request.session.get('backup_codes', [])
        profile.save()
        
        # Clear session
        del request.session['temp_2fa_secret']
        if 'backup_codes' in request.session:
            del request.session['backup_codes']
        
        return Response({'message': '2FA enabled successfully'})
    else:
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def disable_two_factor(request):
    user = request.user
    profile = getattr(user, 'profile', None)
    
    if profile:
        profile.two_factor_enabled = False
        profile.two_factor_secret = ''
        profile.backup_codes = []
        profile.save()
    
    return Response({'message': '2FA disabled successfully'})

@api_view(['GET'])
def active_sessions(request):
    # In a real implementation, you would track user sessions
    # For now, return mock data
    sessions = [
        {
            'id': '1',
            'device': 'Chrome, Windows',
            'location': 'Nairobi, Kenya',
            'last_active': 'Just now',
            'current': True
        },
        {
            'id': '2',
            'device': 'Safari, iOS',
            'location': 'Nairobi, Kenya',
            'last_active': '2 days ago',
            'current': False
        }
    ]
    return Response({'sessions': sessions})

@api_view(['POST'])
def logout_session(request, session_id):
    # In a real implementation, you would invalidate the specific session
    return Response({'message': 'Session logged out successfully'})

@api_view(['POST'])
def logout_all_sessions(request):
    # In a real implementation, you would invalidate all user sessions except current
    return Response({'message': 'All other sessions logged out successfully'})

@api_view(['GET'])
def export_user_data(request):
    user = request.user
    
    # Collect user data
    user_data = {
        'profile': {
            'name': user.get_full_name(),
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'university': user.university,
            'student_id': user.student_id,
            'created_at': user.created_at.isoformat() if user.created_at else None
        },
        'bookings': [],  # Would fetch from bookings app
        'reviews': [],   # Would fetch from reviews app
        'export_date': user.updated_at.isoformat() if user.updated_at else None
    }
    
    return Response(user_data)

@api_view(['POST'])
def delete_account(request):
    user = request.user
    confirmation = request.data.get('confirmation')
    
    if confirmation != 'DELETE':
        return Response({'error': 'Invalid confirmation'}, status=status.HTTP_400_BAD_REQUEST)
    
    # In a real implementation, you might want to:
    # 1. Anonymize data instead of deleting
    # 2. Send confirmation email
    # 3. Add a grace period before actual deletion
    
    user.delete()
    
    return Response({'message': 'Account deleted successfully'})

@api_view(['POST'])
def update_notification_preferences(request):
    user = request.user
    preferences = request.data
    
    profile, created = Profile.objects.get_or_create(user=user)
    
    # Update notification preferences
    if hasattr(profile, 'notification_preferences'):
        profile.notification_preferences.update(preferences)
    else:
        profile.notification_preferences = preferences
    
    profile.save()
    
    return Response({'message': 'Notification preferences updated'})