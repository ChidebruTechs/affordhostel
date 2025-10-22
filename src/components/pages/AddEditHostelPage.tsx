import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Upload, MapPin, DollarSign, Building, Users, Save, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { universities } from '../../data/universitiesAndTowns';

interface RoomType {
  id: string;
  type: string;
  price: number;
  total: number;
  features: string[];
  description: string;
}

interface AddEditHostelPageProps {
  hostelId?: string;
  onBack: () => void;
}

const AddEditHostelPage: React.FC<AddEditHostelPageProps> = ({ hostelId, onBack }) => {
  const { hostels, user } = useApp();
  const isEditing = !!hostelId;
  const existingHostel = isEditing ? hostels.find(h => h.id === hostelId) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    university: '',
    amenities: [] as string[],
    images: [] as string[]
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [activeRoomIndex, setActiveRoomIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form if editing
  useEffect(() => {
    if (isEditing && existingHostel) {
      setFormData({
        name: existingHostel.name,
        description: existingHostel.description,
        price: existingHostel.price.toString(),
        location: existingHostel.location,
        university: existingHostel.university,
        amenities: [...existingHostel.amenities],
        images: [...existingHostel.images]
      });
      setRoomTypes(existingHostel.roomTypes.map(rt => ({
        ...rt,
        features: [...rt.features]
      })));
    }
  }, [isEditing, existingHostel]);

  const commonAmenities = [
    'WiFi', 'Parking', 'Laundry', '24/7 Security', 'Study Area', 'Gym', 
    'Swimming Pool', 'Cafeteria', 'Kitchen', 'Garden', 'CCTV', 'Generator'
  ];

  const roomTypeOptions = [
    'Single Room', 'Shared Room', 'Double Room', 'Studio Apartment', 
    'Bedsitter', 'One Bedroom', 'Two Bedroom', 'Deluxe Room'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
    setNewAmenity('');
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleAddRoomType = () => {
    const newRoomType: RoomType = {
      id: Date.now().toString(),
      type: 'Single Room',
      price: 0,
      total: 1,
      features: [],
      description: ''
    };
    setRoomTypes(prev => [...prev, newRoomType]);
    setActiveRoomIndex(roomTypes.length);
  };

  const handleUpdateRoomType = (index: number, field: string, value: any) => {
    setRoomTypes(prev => prev.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    ));
  };

  const handleAddFeatureToRoom = (roomIndex: number, feature: string) => {
    if (feature && !roomTypes[roomIndex].features.includes(feature)) {
      handleUpdateRoomType(roomIndex, 'features', [...roomTypes[roomIndex].features, feature]);
    }
    setNewFeature('');
  };

  const handleRemoveFeatureFromRoom = (roomIndex: number, feature: string) => {
    handleUpdateRoomType(roomIndex, 'features', 
      roomTypes[roomIndex].features.filter(f => f !== feature)
    );
  };

  const handleRemoveRoomType = (index: number) => {
    setRoomTypes(prev => prev.filter((_, i) => i !== index));
    setActiveRoomIndex(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Hostel name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.university) newErrors.university = 'University is required';
    if (formData.amenities.length === 0) newErrors.amenities = 'At least one amenity is required';
    if (roomTypes.length === 0) newErrors.roomTypes = 'At least one room type is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    // Validate room types
    roomTypes.forEach((room, index) => {
      if (!room.type) newErrors[`room_${index}_type`] = 'Room type is required';
      if (room.price <= 0) newErrors[`room_${index}_price`] = 'Valid price is required';
      if (room.total <= 0) newErrors[`room_${index}_total`] = 'Total rooms must be greater than 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (isEditing) {
        // Update existing hostel
        console.log('Updating hostel data:', {
          ...formData,
          price: parseFloat(formData.price),
          roomTypes,
          landlordId: user?.id
        });
      } else {
        // Create new hostel with proper verification status
        const newHostelData = {
          ...formData,
          price: parseFloat(formData.price),
          roomTypes,
          landlordId: user?.id,
          verified: false,
          verificationStatus: 'pending_submission' as const,
          assignedAgentId: undefined
        };
        
        console.log('Creating new hostel data:', newHostelData);
        
        // In a real app, this would call addHostel from context
        // addHostel(newHostelData);
      }

      alert(isEditing ? 'Hostel updated successfully!' : 'Hostel created successfully!');
      onBack();
    } catch (error) {
      alert('Failed to save hostel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update your hostel information' : 'List your hostel on AffordHostel'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Hostel Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Umoja Hostels"
              error={errors.name}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University *
              </label>
              <select
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                  errors.university ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select university</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
            </div>

            <Input
              label="Location *"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Near University of Nairobi"
              error={errors.location}
              required
            />

            <Input
              label="Base Price (Ksh/month) *"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="15000"
              error={errors.price}
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your hostel, its features, and what makes it special..."
              required
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Images *</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Hostel image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
          </div>
        </Card>

        {/* Amenities */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities *</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonAmenities.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAddAmenity(amenity)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Add custom amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleAddAmenity(newAmenity)}
                disabled={!newAmenity.trim()}
              >
                Add
              </Button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map(amenity => (
                  <span
                    key={amenity}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="ml-2 text-teal-600 hover:text-teal-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.amenities && <p className="text-sm text-red-600">{errors.amenities}</p>}
          </div>
        </Card>

        {/* Room Types */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Room Types *</h2>
            <Button type="button" onClick={handleAddRoomType}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room Type
            </Button>
          </div>

          <div className="space-y-4">
            {roomTypes.map((room, index) => (
              <div
                key={room.id}
                className={`border rounded-lg p-4 ${
                  activeRoomIndex === index ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Room Type {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveRoomType(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      value={room.type}
                      onChange={(e) => handleUpdateRoomType(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      {roomTypeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Price (Ksh/month) *"
                    type="number"
                    value={room.price.toString()}
                    onChange={(e) => handleUpdateRoomType(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="15000"
                  />

                  <Input
                    label="Total Rooms *"
                    type="number"
                    value={room.total.toString()}
                    onChange={(e) => handleUpdateRoomType(index, 'total', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={room.description}
                    onChange={(e) => handleUpdateRoomType(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    placeholder="Describe this room type..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add room feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddFeatureToRoom(index, newFeature)}
                      disabled={!newFeature.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {room.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {room.features.map(feature => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-800"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureFromRoom(index, feature)}
                            className="ml-1 text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {roomTypes.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No room types added yet</p>
                <Button type="button" onClick={handleAddRoomType}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Room Type
                </Button>
              </div>
            )}
            {errors.roomTypes && <p className="text-sm text-red-600">{errors.roomTypes}</p>}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Property' : 'Create Property'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditHostelPage;