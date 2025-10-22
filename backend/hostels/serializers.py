from rest_framework import serializers
from .models import Hostel, HostelImage, RoomType, Wishlist

class HostelImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HostelImage
        fields = ['id', 'image', 'image_url', 'caption', 'is_primary']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'type', 'price', 'available', 'total', 'features', 'description']

class HostelSerializer(serializers.ModelSerializer):
    images = HostelImageSerializer(many=True, read_only=True)
    room_types = RoomTypeSerializer(many=True, read_only=True)
    landlord_name = serializers.CharField(source='landlord.get_full_name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    is_wishlisted = serializers.SerializerMethodField()
    
    class Meta:
        model = Hostel
        fields = [
            'id', 'name', 'description', 'price', 'location', 'university',
            'landlord', 'landlord_name', 'amenities', 'verified', 'available',
            'latitude', 'longitude', 'created_at', 'updated_at', 'images',
            'room_types', 'average_rating', 'review_count', 'is_wishlisted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'verified']
    
    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, hostel=obj).exists()
        return False

class HostelCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    room_types_data = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Hostel
        fields = [
            'name', 'description', 'price', 'location', 'university',
            'amenities', 'latitude', 'longitude', 'images', 'room_types_data'
        ]
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        room_types_data = validated_data.pop('room_types_data', [])
        
        hostel = Hostel.objects.create(
            landlord=self.context['request'].user,
            **validated_data
        )
        
        # Create images
        for i, image in enumerate(images_data):
            HostelImage.objects.create(
                hostel=hostel,
                image=image,
                is_primary=(i == 0)
            )
        
        # Create room types
        for room_data in room_types_data:
            RoomType.objects.create(hostel=hostel, **room_data)
        
        return hostel

class WishlistSerializer(serializers.ModelSerializer):
    hostel = HostelSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'hostel', 'created_at']