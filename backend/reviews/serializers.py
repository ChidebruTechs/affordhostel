from rest_framework import serializers
from .models import Review, ReviewHelpful
from accounts.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    is_helpful = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'rating', 'comment',
            'helpful_count', 'is_helpful', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'helpful_count', 'created_at', 'updated_at']
    
    def get_is_helpful(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ReviewHelpful.objects.filter(review=obj, user=request.user).exists()
        return False

class ReviewCreateSerializer(serializers.ModelSerializer):
    hostel_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Review
        fields = ['hostel_id', 'rating', 'comment']
    
    def create(self, validated_data):
        hostel_id = validated_data.pop('hostel_id')
        from hostels.models import Hostel
        hostel = Hostel.objects.get(id=hostel_id)
        
        review = Review.objects.create(
            user=self.context['request'].user,
            hostel=hostel,
            **validated_data
        )
        
        return review