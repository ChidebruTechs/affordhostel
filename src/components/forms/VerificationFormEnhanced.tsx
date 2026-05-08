// src/components/forms/VerificationFormEnhanced.tsx
// Enhanced verification form with integrated checklist system

import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, AlertTriangle, XCircle, Save, Phone, Camera, FileText, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../Input';
import { VerificationChecklist } from './VerificationChecklist';
import { ContactVerificationTool } from './ContactVerificationTool';
import { AmenityVerificationPanel } from './AmenityVerificationPanel';

interface VerificationFormProps {
  hostelId: string;
  onClose: () => void;
  agentId: string;
}

export const VerificationFormEnhanced: React.FC<VerificationFormProps> = ({ hostelId, onClose, agentId }) => {
  const { hostels, submitVerificationReport } = useApp();
  const [verificationData, setVerificationData] = useState({
    comments: '',
    photos: [] as string[],
    status: 'pending_review' as 'verified' | 'rejected' | 'pending_review' | 'needs_more_info'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contacts, setContacts] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'checklist' | 'contacts' | 'amenities' | 'photos' | 'summary'>('checklist');
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  useEffect(() => {
    if (hostelId) {
      fetchHostelData();
    }
  }, [hostelId]);

  const fetchHostelData = async () => {
    const hostel = hostels.find(h => h.id === hostelId);
    if (hostel) {
      setAmenities(hostel.amenities || []);
      
      // Mock contacts - in real app, fetch from database
      setContacts([
        { type: 'landlord', name: 'Landlord Name', phone: '+254700000000' },
        { type: 'tenant', name: 'Current Tenant', phone: '+254711111111' },
        { type: 'neighbor', name: 'Neighbor', phone: '+254722222222' }
      ]);
    }
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

  const markStageComplete = (stage: string) => {
    setCompletedStages(prev => [...prev, stage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationData.comments.trim()) {
      alert('Please provide verification comments');
      return;
    }

    setIsSubmitting(true);

    try {
      const verificationReport = {
        id: Date.now().toString(),
        hostelId,
        agentId,
        comments: verificationData.comments,
        photos: verificationData.photos,
        status: verificationData.status,
        completedStages,
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
      case 'pending_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'rejected': return XCircle;
      case 'needs_more_info': return AlertTriangle;
      case 'pending_review': return CheckCircle;
      default: return CheckCircle;
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Verification</h2>
          <p className="text-gray-600 mt-1">Complete verification checklist for {hostel.name}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {[
            { id: 'checklist', label: 'Checklist', Icon: CheckCircle },
            { id: 'contacts', label: 'Contacts', Icon: Phone },
            { id: 'amenities', label: 'Amenities', Icon: MapPin },
            { id: 'photos', label: 'Photos', Icon: Camera },
            { id: 'summary', label: 'Summary', Icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 space-y-6">
        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Verification Checklist</h3>
            <VerificationChecklist propertyId={hostelId} agentId={agentId} onComplete={() => markStageComplete('checklist')} />
          </Card>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Verification</h3>
            <p className="text-gray-600 mb-6">Verify property details by contacting landlord, tenants, and neighbors.</p>
            <ContactVerificationTool 
              propertyId={hostelId} 
              agentId={agentId} 
              contacts={contacts}
              onComplete={() => markStageComplete('contacts')}
            />
          </Card>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenity Verification</h3>
            <p className="text-gray-600 mb-6">Verify all amenities listed for this property are present and functional.</p>
            <AmenityVerificationPanel 
              propertyId={hostelId} 
              agentId={agentId} 
              amenities={amenities}
              onComplete={() => markStageComplete('amenities')}
            />
          </Card>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Photos</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Property Photos */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Listing Photos</h4>
                <div className="grid grid-cols-2 gap-4">
                  {hostel.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`${hostel.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Photos */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Photos</h4>
                <div className="space-y-4">
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> verification photos
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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
                    <div className="grid grid-cols-2 gap-4">
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
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {verificationData.photos.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                {verificationData.photos.length} verification photo{verificationData.photos.length !== 1 ? 's' : ''} uploaded
              </p>
            )}
          </Card>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Verification Summary</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Name:</span>
                    <span className="font-medium">{hostel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{hostel.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">University:</span>
                    <span className="font-medium">{hostel.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">Ksh {hostel.price.toLocaleString()}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-medium">{hostel.rating}</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Amenities</h4>
                <div className="flex flex-wrap gap-2">
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

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Final Status *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'verified', label: 'Verified', icon: CheckCircle, color: 'green' },
                        { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'red' },
                        { value: 'pending_review', label: 'Pending', icon: CheckCircle, color: 'blue' },
                        { value: 'needs_more_info', label: 'More Info', icon: AlertTriangle, color: 'orange' }
                      ].map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setVerificationData(prev => ({ ...prev, status: option.value as any }))}
                            className={`p-4 border-2 rounded-lg text-center transition-all ${
                              verificationData.status === option.value
                                ? `border-${option.color}-500 bg-${option.color}-50`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <IconComponent className={`h-5 w-5 mx-auto mb-2 text-${option.color}-600`} />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Comments *
                    </label>
                    <textarea
                      value={verificationData.comments}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, comments: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Provide detailed verification comments including observations about safety, cleanliness, amenities verification, and any issues found..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Submit Button - Fixed at bottom */}
        {activeTab === 'summary' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6">
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Verification Report
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationFormEnhanced;