import React, { useState } from 'react';
import { X, Upload, Camera, MapPin, Star, Building, Users, CheckCircle, AlertTriangle, XCircle, Save, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface VerificationFormProps {
  hostelId: string;
  onClose: () => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ hostelId, onClose }) => {
  const { hostels, submitVerificationReport } = useApp();
  const [verificationData, setVerificationData] = useState({
    comments: '',
    photos: [] as string[],
    status: 'verified' as 'verified' | 'rejected' | 'needs_more_info'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const hostel = hostels.find(h => h.id === hostelId);

  if (!hostel) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Hostel Not Found</h3>
        <p className="text-gray-600 mb-4">The requested hostel could not be found.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

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
        setVerificationData(prev => ({
          ...prev,
          photos: [...prev.photos, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setVerificationData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationData.comments.trim()) {
      alert('Please provide verification comments');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const verificationReport = {
        id: Date.now().toString(),
        hostelId,
        agentId: 'agent_001', // Mock agent ID
        comments: verificationData.comments,
        photos: verificationData.photos,
        status: verificationData.status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      submitVerificationReport(hostelId, verificationReport);
      
      alert(`Verification report submitted successfully! Status: ${verificationData.status}`);
      onClose();
    } catch (error) {
      alert('Failed to submit verification report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'needs_more_info': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'rejected': return XCircle;
      case 'needs_more_info': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Verification</h2>
          <p className="text-gray-600 mt-1">Review and verify property details</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Property Overview */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Overview</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Images */}
            <div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                <img
                  src={hostel.images[activeImageIndex]}
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  {activeImageIndex + 1} / {hostel.images.length}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {hostel.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${hostel.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{hostel.name}</h4>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hostel.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">University:</span>
                  <p className="font-medium">{hostel.university}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Base Price:</span>
                  <p className="font-medium">Ksh {hostel.price.toLocaleString()}/month</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Room Types:</span>
                  <p className="font-medium">{hostel.roomTypes.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{hostel.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Description:</span>
                <p className="text-gray-700 mt-1 leading-relaxed">{hostel.description}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Amenities:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hostel.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Room Types */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostel.roomTypes.map((room, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{room.type}</h4>
                    <p className="text-sm text-gray-600">{room.available} of {room.total} available</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-purple-600">
                      Ksh {room.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {room.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Verification Report</h3>
            
            <div className="space-y-6">
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Verification Status *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'verified', label: 'Verified', description: 'Property meets all requirements' },
                    { value: 'rejected', label: 'Rejected', description: 'Property does not meet standards' },
                    { value: 'needs_more_info', label: 'Needs More Info', description: 'Additional information required' }
                  ].map((option) => {
                    const IconComponent = getStatusIcon(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setVerificationData(prev => ({ ...prev, status: option.value as any }))}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          verificationData.status === option.value
                            ? getStatusColor(option.value)
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <IconComponent className="h-5 w-5 mr-2" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-sm opacity-80">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Comments *
                </label>
                <textarea
                  value={verificationData.comments}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, comments: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Provide detailed comments about the property verification. Include observations about safety, cleanliness, amenities, and any issues found..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Provide detailed feedback about the property condition, safety measures, and compliance.
                </p>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Photos
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> verification photos
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

                  {verificationData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {verificationData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Verification photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload photos taken during your verification visit to document property condition.
                </p>
              </div>

              {/* Verification Checklist */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Fire safety equipment present and functional',
                    'Emergency exits clearly marked and accessible',
                    'Security measures adequate (guards, CCTV, locks)',
                    'Electrical systems safe and up to code',
                    'Plumbing and water systems functional',
                    'Property clean and well-maintained',
                    'Amenities as advertised are present',
                    'Room conditions match photos and descriptions',
                    'Common areas accessible and clean',
                    'Compliance with local regulations'
                  ].map((item, index) => (
                    <label key={index} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Report...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Verification Report
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;