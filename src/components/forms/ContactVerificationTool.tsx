// src/components/forms/ContactVerificationTool.tsx
// Tool for making and logging verification phone calls

import React, { useState } from 'react';
import { Phone, Clock, Check, X, User, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Contact {
  type: 'landlord' | 'tenant' | 'neighbor' | 'university_office' | 'student' | 'other';
  name: string;
  phone: string;
}

interface Props {
  propertyId: string;
  agentId: string;
  contacts: Contact[];
  onComplete?: () => void;
}

export const ContactVerificationTool: React.FC<Props> = ({ propertyId, agentId, contacts, onComplete }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [callLog, setCallLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useState(() => {
    fetchCallLogs();
  });

  const fetchCallLogs = async () => {
    const { data } = await supabase
      .from('contact_verification_logs')
      .select('*')
      .eq('property_id', propertyId)
      .order('call_date', { ascending: false });
    if (data) setCallLog(data);
  };

  const startCall = (contact: Contact) => {
    setSelectedContact(contact);
    setCallActive(true);
    setCallDuration(0);
    setConfirmed(false);
    setNotes('');
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const endCall = async () => {
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    setCallActive(false);

    // Save call log
    setLoading(true);
    try {
      await supabase.from('contact_verification_logs').insert({
        property_id: propertyId,
        agent_id: agentId,
        contact_type: selectedContact?.type || 'other',
        contact_name: selectedContact?.name || '',
        phone_number: selectedContact?.phone || '',
        call_duration: callDuration,
        confirmed: confirmed,
        verification_details: notes
      });

      await supabase.from('property_verification_timeline').insert({
        property_id: propertyId,
        agent_id: agentId,
        action_type: 'phone_call_made',
        action_description: `Called ${selectedContact?.name} (${selectedContact?.type}) - ${confirmed ? 'Confirmed' : 'Not confirmed'}`,
        metadata: { duration: callDuration, contact: selectedContact?.name }
      });

      fetchCallLogs();
      onComplete?.();
    } catch (error) {
      console.error('Error saving call log:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Contact List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Verify Contacts</h4>
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.type.replace(/_/g, ' ')}</p>
              </div>
            </div>
            <button
              onClick={() => startCall(contact)}
              disabled={callActive}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>
          </div>
        ))}
      </div>

      {/* Active Call */}
      {callActive && selectedContact && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-4 w-4 text-green-600 animate-pulse" />
              </div>
              <div>
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-xs text-gray-500">{selectedContact.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-green-600">{formatDuration(callDuration)}</p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Call Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes from the call..."
                className="w-full px-3 py-2 border rounded text-sm mt-1"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirmed"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="rounded text-green-600"
              />
              <label htmlFor="confirmed" className="text-sm">
                Property details {confirmed ? <span className="text-green-600 font-medium">✓ Verified</span> : 'Not confirmed'}
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={endCall}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                {loading ? 'Saving...' : 'End Call'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call History */}
      {callLog.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Call History</h4>
          <div className="space-y-2">
            {callLog.map((log) => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{log.contact_name}</span>
                    <span className="text-xs text-gray-500">({log.contact_type})</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(log.call_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>Duration: {formatDuration(log.call_duration)}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded ${log.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {log.confirmed ? 'Verified' : 'Not confirmed'}
                  </span>
                </div>
                {log.verification_details && (
                  <p className="text-xs text-gray-600 mt-1">{log.verification_details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactVerificationTool;