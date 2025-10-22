from django.contrib import admin
from .models import CompanyInfo, TeamMember

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['mission_preview', 'vision_preview', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def mission_preview(self, obj):
        return obj.mission[:100] + '...' if len(obj.mission) > 100 else obj.mission
    mission_preview.short_description = 'Mission'
    
    def vision_preview(self, obj):
        return obj.vision[:100] + '...' if len(obj.vision) > 100 else obj.vision
    vision_preview.short_description = 'Vision'

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'order', 'active', 'created_at']
    list_filter = ['active', 'created_at']
    search_fields = ['name', 'role']
    list_editable = ['order', 'active']
    ordering = ['order', 'created_at']