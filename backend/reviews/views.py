from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Review, ReviewHelpful
from .serializers import ReviewSerializer, ReviewCreateSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['hostel', 'rating']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        return Review.objects.all()

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.user != self.request.user and not self.request.user.is_staff:
                raise permissions.PermissionDenied("You can only modify your own reviews")
        return obj

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_helpful(request, review_id):
    try:
        review = Review.objects.get(id=review_id)
        helpful, created = ReviewHelpful.objects.get_or_create(
            review=review,
            user=request.user
        )
        
        if created:
            review.helpful_count += 1
            review.save()
            return Response({'message': 'Marked as helpful'}, status=status.HTTP_201_CREATED)
        else:
            helpful.delete()
            review.helpful_count -= 1
            review.save()
            return Response({'message': 'Removed helpful mark'}, status=status.HTTP_200_OK)
            
    except Review.DoesNotExist:
        return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

class HostelReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        hostel_id = self.kwargs['hostel_id']
        return Review.objects.filter(hostel_id=hostel_id)