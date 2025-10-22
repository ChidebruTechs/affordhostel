from rest_framework import serializers
from .models import Booking, BookingStatusHistory
from hostels.serializers import HostelSerializer, RoomTypeSerializer
from accounts.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
    hostel = HostelSerializer(read_only=True)
    room_type = RoomTypeSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    duration_months = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'student', 'hostel', 'room_type', 'check_in', 'check_out',
            'guests', 'amount', 'service_fee', 'total_amount', 'status',
            'payment_id', 'receipt_url', 'special_requests', 'created_at',
            'updated_at', 'duration_months'
        ]
        read_only_fields = ['id', 'service_fee', 'total_amount', 'created_at', 'updated_at']
    
    def get_duration_months(self, obj):
        delta = obj.check_out - obj.check_in
        return round(delta.days / 30, 1)

class BookingCreateSerializer(serializers.ModelSerializer):
    hostel_id = serializers.IntegerField(write_only=True)
    room_type_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'hostel_id', 'room_type_id', 'check_in', 'check_out',
            'guests', 'amount', 'special_requests'
        ]
    
    def create(self, validated_data):
        hostel_id = validated_data.pop('hostel_id')
        room_type_id = validated_data.pop('room_type_id')
        
        from hostels.models import Hostel, RoomType
        hostel = Hostel.objects.get(id=hostel_id)
        room_type = RoomType.objects.get(id=room_type_id)
        
        booking = Booking.objects.create(
            student=self.context['request'].user,
            hostel=hostel,
            room_type=room_type,
            **validated_data
        )
        
        return booking

class BookingStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = UserSerializer(read_only=True)
    
    class Meta:
        model = BookingStatusHistory
        fields = ['id', 'status', 'changed_by', 'reason', 'created_at']