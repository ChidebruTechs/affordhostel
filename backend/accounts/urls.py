from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('upload-avatar/', views.upload_avatar, name='upload_avatar'),
    path('password-reset/', views.password_reset, name='password_reset'),
    path('password-reset-confirm/<int:user_id>/<str:token>/', views.password_reset_confirm, name='password_reset_confirm'),
    path('change-password/', views.change_password, name='change_password'),
    path('setup-2fa/', views.setup_two_factor, name='setup_two_factor'),
    path('verify-2fa/', views.verify_two_factor, name='verify_two_factor'),
    path('disable-2fa/', views.disable_two_factor, name='disable_two_factor'),
    path('active-sessions/', views.active_sessions, name='active_sessions'),
    path('logout-session/<str:session_id>/', views.logout_session, name='logout_session'),
    path('logout-all-sessions/', views.logout_all_sessions, name='logout_all_sessions'),
    path('export-data/', views.export_user_data, name='export_user_data'),
    path('delete-account/', views.delete_account, name='delete_account'),
    path('notification-preferences/', views.update_notification_preferences, name='notification_preferences'),
]