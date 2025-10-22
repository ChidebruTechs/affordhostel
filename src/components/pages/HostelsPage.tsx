import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart, ChevronDown, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { universities, towns, getTownByUniversity, getUniversitiesByTown } from '../../data/universitiesAndTowns';

const HostelsPage: React.FC = () => {
  const { hostels, setCurrentPage, isAuthenticated, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Get all unique amenities from hostels for filtering
  const allAmenities = [...new Set(hostels.flatMap(hostel => hostel.amenities))].sort();

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUniversity = !selectedUniversity || hostel.university === selectedUniversity;
    
    // Enhanced town matching using the CSV data
    let matchesTown = true;
    if (selectedTown) {
      // Check if hostel's university is in the selected town
      const hostelUniversityTown = getTownByUniversity(hostel.university);
      // Also check if the hostel location mentions the town
      const locationMentionsTown = hostel.location.toLowerCase().includes(selectedTown.toLowerCase());
      matchesTown = hostelUniversityTown === selectedTown || locationMentionsTown;
    }
    
    const matchesPriceRange = (!priceRange.min || hostel.price >= parseInt(priceRange.min)) &&
                             (!priceRange.max || hostel.price <= parseInt(priceRange.max));
    
    const matchesAmenities = selectedAmenities.length === 0 || 
                            selectedAmenities.every(amenity => hostel.amenities.includes(amenity));
    
    return matchesSearch && matchesUniversity && matchesTown && matchesPriceRange && matchesAmenities;
  });

  // Sort filtered hostels
  const sortedHostels = [...filteredHostels].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.id).getTime() - new Date(a.id).getTime();
    }
  });

  const handleWishlistToggle = (hostelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (isInWishlist(hostelId)) {
      removeFromWishlist(hostelId);
    } else {
      addToWishlist(hostelId);
    }
  };

  const handleUniversityChange = (university: string) => {
    setSelectedUniversity(university);
    // Auto-select the town if a university is selected
    if (university) {
      const town = getTownByUniversity(university);
      if (town && !selectedTown) {
        setSelectedTown(town);
      }
    }
  };

  const handleTownChange = (town: string) => {
    setSelectedTown(town);
    // Clear university selection if it doesn't match the selected town
    if (selectedUniversity && town) {
      const universityTown = getTownByUniversity(selectedUniversity);
      if (universityTown !== town) {
        setSelectedUniversity('');
      }
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUniversity('');
    setSelectedTown('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setSelectedAmenities([]);
  };

  const activeFiltersCount = [
    selectedUniversity, 
    selectedTown, 
    priceRange.min, 
    priceRange.max,
    ...selectedAmenities
  ].filter(Boolean).length;

  // Get universities for the selected town (for better UX)
  const universitiesInSelectedTown = selectedTown ? getUniversitiesByTown(selectedTown) : universities;

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Available Hostels</h1>
            <p className="text-sm md:text-base text-gray-600">
              Find your perfect accommodation near campus • {sortedHostels.length} hostels found
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-3 md:p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search hostels by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm md:text-base"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTown}
                onChange={(e) => handleTownChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm md:text-base min-w-[150px]"
              >
                <option value="">All Towns</option>
                {towns.map(town => (
                  <option key={town} value={town}>
                    {town} ({getUniversitiesByTown(town).length} universities)
                  </option>
                ))}
              </select>

              <select
                value={selectedUniversity}
                onChange={(e) => handleUniversityChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm md:text-base min-w-[200px]"
              >
                <option value="">
                  {selectedTown ? `All Universities in ${selectedTown}` : 'All Universities'}
                </option>
                {universitiesInSelectedTown.map(uni => (
                  <option key={uni} value={uni}>
                    {uni}
                    {selectedTown ? '' : ` (${getTownByUniversity(uni)})`}
                  </option>
                ))}
              </select>

              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 relative"
              >
                <Filter className="h-4 w-4" />
                More Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (Ksh)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* Amenities Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {allAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              {selectedTown && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  Town: {selectedTown}
                  <button
                    onClick={() => handleTownChange('')}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedUniversity && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  University: {selectedUniversity.length > 30 ? selectedUniversity.substring(0, 30) + '...' : selectedUniversity}
                  <button
                    onClick={() => setSelectedUniversity('')}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Price: {priceRange.min || '0'} - {priceRange.max || '∞'}
                  <button
                    onClick={() => setPriceRange({ min: '', max: '' })}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedAmenities.map(amenity => (
                <span key={amenity} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {amenity}
                  <button
                    onClick={() => handleAmenityToggle(amenity)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {sortedHostels.length} of {hostels.length} hostels
            {selectedTown && ` in ${selectedTown}`}
            {selectedUniversity && ` near ${selectedUniversity}`}
          </p>
        </div>

        {/* Hostels Grid */}
        {sortedHostels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {sortedHostels.map((hostel) => (
              <Card key={hostel.id} hover className="overflow-hidden cursor-pointer" onClick={() => setCurrentPage('hostel-detail')}>
                <div 
                  className="h-40 sm:h-48 bg-gray-200 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${hostel.images[0]})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-2 md:top-4 right-2 md:right-4">
                    <button 
                      onClick={(e) => handleWishlistToggle(hostel.id, e)}
                      className="p-1.5 md:p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isInWishlist(hostel.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                      {getTownByUniversity(hostel.university) || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 md:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate pr-2">{hostel.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{hostel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2 md:mb-3">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{hostel.location}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2 truncate">
                    {hostel.university}
                  </div>
                  
                  <div className="text-lg md:text-2xl font-bold text-purple-600 mb-3 md:mb-4">
                    Ksh {hostel.price.toLocaleString()}/month
                  </div>
                  
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
                    {hostel.amenities.slice(0, 3).map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hostel.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{hostel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPage('hostel-detail');
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hostels found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms to find more hostels.
            </p>
            <Button onClick={clearFilters} className="mt-4">
              Clear All Filters
            </Button>
          </Card>
        )}

        {/* Pagination */}
        {sortedHostels.length > 0 && (
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="px-3 py-1 text-sm">Previous</Button>
              <Button size="sm" className="px-3 py-1 text-sm">1</Button>
              <Button variant="outline" size="sm" className="px-3 py-1 text-sm">2</Button>
              <Button variant="outline" size="sm" className="px-3 py-1 text-sm">3</Button>
              <Button variant="outline" size="sm" className="px-3 py-1 text-sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelsPage;