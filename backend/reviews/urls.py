from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReviewListCreateView.as_view(), name='review-list-create'),
    path('<int:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),
    path('<int:review_id>/helpful/', views.mark_helpful, name='mark-helpful'),
    path('hostel/<int:hostel_id>/', views.HostelReviewsView.as_view(), name='hostel-reviews'),
]