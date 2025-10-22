from rest_framework import serializers
from .models import CompanyInfo, TeamMember

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = ['id', 'mission', 'vision', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'image', 'order', 'active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']