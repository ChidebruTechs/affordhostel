// src/components/forms/AmenityVerificationPanel.tsx
// Panel for verifying individual amenities

import React, { useState, useEffect } from 'react';
import { Check, Camera, FileText, MapPin, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AmenityItem {
  id: string;
  amenity_name: string;
  is_verified: boolean;
  verification_method?: string;
  verified_by?: string;
  verified_at?: string;
  evidence_url?: string;
  notes?: string;
}

interface Props {
  propertyId: string;
  agentId: string;
  amenities: string[];
  onComplete?: () => void;
}

export const AmenityVerificationPanel: React.FC<Props> = ({ propertyId, agentId, amenities, onComplete }) => {
  const [amenityList, setAmenityList] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<'photo' | 'physical_check' | 'document' | 'phone_call' | 'walkthrough'>('physical_check');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAmenities();
  }, [propertyId]);

  const fetchAmenities = async () => {
    try {
      const { data, error } = await supabase
        .from('property_amenities_verification')
        .select('*')
        .eq('property_id', propertyId);

      if (error) throw error;

      // Create entries for amenities that don't exist yet
      const existingAmenityNames = (data || []).map((a: any) => a.amenity_name);
      const newAmenities = amenities.filter(a => !existingAmenityNames.includes(a));

      if (newAmenities.length > 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('property_amenities_verification')
          .insert(
            newAmenities.map(amenity => ({
              property_id: propertyId,
              amenity_name: amenity,
              is_verified: false
            }))
          )
          .select();

        if (insertError) throw insertError;
        setAmenityList([...(data || []), ...(insertedData || [])]);
      } else {
        setAmenityList(data || []);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      // Initialize with provided amenities if database fails
      setAmenityList(amenities.map(a => ({
        id: Math.random().toString(),
        amenity_name: a,
        is_verified: false,
        verification_method: undefined,
        evidence_url: undefined,
        notes: undefined
      } as AmenityItem)));
    } finally {
      setLoading(false);
    }
  };

  const verifyAmenity = async (amenityId: string, amenityName: string) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('property_amenities_verification')
        .update({
          is_verified: true,
          verification_method: verificationMethod,
          verified_by: agentId,
          verified_at: now,
          evidence_url: evidenceUrl || null,
          notes: notes || null,
          updated_at: now
        })
        .eq('id', amenityId);

      if (error) throw error;

      await supabase.from('property_verification_timeline').insert({
        property_id: propertyId,
        agent_id: agentId,
        action_type: 'amenity_verified',
        action_description: `Verified: ${amenityName}`,
        metadata: { method: verificationMethod }
      });

      setAmenityList(prev => prev.map(a =>
        a.id === amenityId
          ? { ...a, is_verified: true, verification_method: verificationMethod, verified_by: agentId, verified_at: now, evidence_url: evidenceUrl, notes }
          : a
      ));

      setSelectedAmenity(null);
      setEvidenceUrl('');
      setNotes('');
      onComplete?.();
    } catch (error) {
      console.error('Error verifying amenity:', error);
    }
  };

  const unverifyAmenity = async (amenityId: string, amenityName: string) => {
    try {
      const { error } = await supabase
        .from('property_amenities_verification')
        .update({
          is_verified: false,
          verification_method: null,
          verified_by: null,
          verified_at: null,
          evidence_url: null,
          notes: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', amenityId);

      if (error) throw error;

      await supabase.from('property_verification_timeline').insert({
        property_id: propertyId,
        agent_id: agentId,
        action_type: 'amenity_verified',
        action_description: `Unverified: ${amenityName}`
      });

      setAmenityList(prev => prev.map(a =>
        a.id === amenityId
          ? { ...a, is_verified: false, verification_method: undefined, verified_by: undefined, verified_at: undefined, evidence_url: undefined, notes: undefined }
          : a
      ));
    } catch (error) {
      console.error('Error unverifying amenity:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading amenities...</p>
      </div>
    );
  }

  const verifiedCount = amenityList.filter(a => a.is_verified).length;
  const totalCount = amenityList.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Amenities Verification</h4>
          <p className="text-xs text-gray-500">{verifiedCount} of {totalCount} verified</p>
        </div>
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: totalCount > 0 ? `${(verifiedCount / totalCount) * 100}%` : '0%' }}></div>
        </div>
      </div>

      <div className="space-y-2">
        {amenityList.map((amenity) => (
          <div key={amenity.id} className={`p-3 rounded-lg border-2 ${amenity.is_verified ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => amenity.is_verified ? unverifyAmenity(amenity.id, amenity.amenity_name) : setSelectedAmenity(amenity.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center ${amenity.is_verified ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}
                >
                  {amenity.is_verified && <Check className="h-3 w-3" />}
                </button>
                <span className={`text-sm ${amenity.is_verified ? 'text-green-800 line-through' : 'text-gray-900'}`}>{amenity.amenity_name}</span>
              </div>
              {amenity.is_verified && (
                <div className="flex items-center gap-2">
                  {amenity.evidence_url && (
                    <a href={amenity.evidence_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                      <FileText className="h-4 w-4" />
                    </a>
                  )}
                  <span className="text-xs text-gray-500">{amenity.verification_method?.replace(/_/g, ' ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedAmenity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Verify Amenity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Method</label>
                <select
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="physical_check">Physical Check</option>
                  <option value="photo">Photo Verification</option>
                  <option value="document">Document Proof</option>
                  <option value="phone_call">Phone Call</option>
                  <option value="walkthrough">Walkthrough</option>
                </select>
              </div>
              {verificationMethod === 'photo' || verificationMethod === 'document' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evidence URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 border rounded text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAmenity(null)}
                  className="flex-1 px-4 py-2 border rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const amenity = amenityList.find(a => a.id === selectedAmenity);
                    if (amenity) verifyAmenity(amenity.id, amenity.amenity_name);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenityVerificationPanel;