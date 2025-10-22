from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Hostel, Wishlist
from .serializers import HostelSerializer, HostelCreateSerializer, WishlistSerializer
from .filters import HostelFilter

class HostelListCreateView(generics.ListCreateAPIView):
    queryset = Hostel.objects.filter(available=True)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = HostelFilter
    search_fields = ['name', 'location', 'university', 'description']
    ordering_fields = ['price', 'created_at', 'average_rating']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HostelCreateSerializer
        return HostelSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class HostelDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.landlord != self.request.user and not self.request.user.is_staff:
                raise permissions.PermissionDenied("You can only modify your own hostels")
        return obj

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_wishlist(request, hostel_id):
    try:
        hostel = Hostel.objects.get(id=hostel_id)
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            hostel=hostel
        )
        if created:
            return Response({'message': 'Added to wishlist'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Already in wishlist'}, status=status.HTTP_200_OK)
    except Hostel.DoesNotExist:
        return Response({'error': 'Hostel not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_wishlist(request, hostel_id):
    try:
        wishlist_item = Wishlist.objects.get(user=request.user, hostel_id=hostel_id)
        wishlist_item.delete()
        return Response({'message': 'Removed from wishlist'}, status=status.HTTP_200_OK)
    except Wishlist.DoesNotExist:
        return Response({'error': 'Not in wishlist'}, status=status.HTTP_404_NOT_FOUND)

class WishlistView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class LandlordHostelsView(generics.ListAPIView):
    serializer_class = HostelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Hostel.objects.filter(landlord=self.request.user)