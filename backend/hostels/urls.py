from django.urls import path
from . import views

urlpatterns = [
    path('', views.HostelListCreateView.as_view(), name='hostel-list-create'),
    path('<int:pk>/', views.HostelDetailView.as_view(), name='hostel-detail'),
    path('<int:hostel_id>/wishlist/add/', views.add_to_wishlist, name='add-to-wishlist'),
    path('<int:hostel_id>/wishlist/remove/', views.remove_from_wishlist, name='remove-from-wishlist'),
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('my-hostels/', views.LandlordHostelsView.as_view(), name='landlord-hostels'),
]