from django.urls import path
from . import views

urlpatterns = [
    path('company-info/', views.CompanyInfoView.as_view(), name='company_info'),
    path('team-members/', views.TeamMemberListCreateView.as_view(), name='team_members'),
    path('team-members/<int:pk>/', views.TeamMemberDetailView.as_view(), name='team_member_detail'),
    path('company-data/', views.company_data, name='company_data'),
]