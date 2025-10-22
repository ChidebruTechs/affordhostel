from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Booking, BookingStatusHistory
from .serializers import BookingSerializer, BookingCreateSerializer, BookingStatusHistorySerializer

class BookingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'hostel']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Booking.objects.filter(student=user)
        elif user.role == 'landlord':
            return Booking.objects.filter(hostel__landlord=user)
        elif user.role in ['agent', 'admin']:
            return Booking.objects.all()
        return Booking.objects.none()

class BookingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Booking.objects.filter(student=user)
        elif user.role == 'landlord':
            return Booking.objects.filter(hostel__landlord=user)
        elif user.role in ['agent', 'admin']:
            return Booking.objects.all()
        return Booking.objects.none()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_booking_status(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        
        # Check permissions
        if request.user.role == 'student' and booking.student != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'landlord' and booking.hostel.landlord != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        reason = request.data.get('reason', '')
        
        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create status history
        BookingStatusHistory.objects.create(
            booking=booking,
            status=new_status,
            changed_by=request.user,
            reason=reason
        )
        
        booking.status = new_status
        booking.save()
        
        return Response({'message': 'Status updated successfully'})
        
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

class BookingStatusHistoryView(generics.ListAPIView):
    serializer_class = BookingStatusHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        booking_id = self.kwargs['booking_id']
        return BookingStatusHistory.objects.filter(booking_id=booking_id)