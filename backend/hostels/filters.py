import django_filters
from .models import Hostel

class HostelFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    university = django_filters.CharFilter(field_name="university", lookup_expr='icontains')
    location = django_filters.CharFilter(field_name="location", lookup_expr='icontains')
    verified = django_filters.BooleanFilter(field_name="verified")
    amenities = django_filters.CharFilter(method='filter_amenities')
    
    class Meta:
        model = Hostel
        fields = ['min_price', 'max_price', 'university', 'location', 'verified', 'amenities']
    
    def filter_amenities(self, queryset, name, value):
        if value:
            amenities_list = [amenity.strip() for amenity in value.split(',')]
            for amenity in amenities_list:
                queryset = queryset.filter(amenities__icontains=amenity)
        return queryset