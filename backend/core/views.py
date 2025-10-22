from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import CompanyInfo, TeamMember
from .serializers import CompanyInfoSerializer, TeamMemberSerializer

class CompanyInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanyInfoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        # Get or create the single company info instance
        company_info, created = CompanyInfo.objects.get_or_create(
            id=1,
            defaults={
                'mission': 'To simplify and democratize student accommodation in Kenya by providing a transparent, secure, and user-friendly platform that connects students with quality, affordable hostels near their universities.',
                'vision': 'To become the leading student accommodation platform in East Africa, empowering students to focus on their education while we take care of their housing needs through innovation and excellence.'
            }
        )
        return company_info
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def update(self, request, *args, **kwargs):
        # Only allow admin users to update company info
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {'error': 'Only admin users can update company information'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

class TeamMemberListCreateView(generics.ListCreateAPIView):
    queryset = TeamMember.objects.filter(active=True)
    serializer_class = TeamMemberSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def create(self, request, *args, **kwargs):
        # Only allow admin users to create team members
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {'error': 'Only admin users can add team members'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

class TeamMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def update(self, request, *args, **kwargs):
        # Only allow admin users to update team members
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {'error': 'Only admin users can update team members'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Only allow admin users to delete team members
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {'error': 'Only admin users can delete team members'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        # Soft delete by setting active to False
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def company_data(request):
    """Get all company data including info and team members"""
    try:
        company_info = CompanyInfo.objects.get(id=1)
    except CompanyInfo.DoesNotExist:
        company_info = CompanyInfo.objects.create(
            id=1,
            mission='To simplify and democratize student accommodation in Kenya by providing a transparent, secure, and user-friendly platform that connects students with quality, affordable hostels near their universities.',
            vision='To become the leading student accommodation platform in East Africa, empowering students to focus on their education while we take care of their housing needs through innovation and excellence.'
        )
    
    team_members = TeamMember.objects.filter(active=True)
    
    return Response({
        'company_info': CompanyInfoSerializer(company_info).data,
        'team_members': TeamMemberSerializer(team_members, many=True).data
    })