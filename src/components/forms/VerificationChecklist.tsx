// src/components/forms/VerificationChecklist.tsx
// Interactive verification checklist component for agents

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Phone, Camera, FileText, Edit, Plus, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ChecklistItem {
  id: string;
  checklist_item: string;
  category: string;
  is_confirmed: boolean;
  confirmation_method?: string;
  notes: string;
  confirmed_at: string;
}

interface Props {
  propertyId: string;
  agentId: string;
  onComplete?: () => void;
}

export const VerificationChecklist: React.FC<Props> = ({ propertyId, agentId, onComplete }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item: '',
    category: 'amenities' as const,
    method: 'phone_call' as const,
    notes: ''
  });

  useEffect(() => {
    fetchChecklist();
  }, [propertyId]);

  const fetchChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from('property_verification_checklists')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChecklist(data || []);
    } catch (error) {
      console.error('Error fetching checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (itemId: string, currentState: boolean) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('property_verification_checklists')
        .update({
          is_confirmed: !currentState,
          confirmed_at: !currentState ? now : null,
          updated_at: now
        })
        .eq('id', itemId);

      if (error) throw error;

      await supabase.from('property_verification_timeline').insert({
        property_id: propertyId,
        agent_id: agentId,
        action_type: !currentState ? 'checklist_item_completed' : 'checklist_item_reopened',
        action_description: `Item: ${checklist.find(i => i.id === itemId)?.checklist_item}`
      });

      setChecklist(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, is_confirmed: !currentState, confirmed_at: !currentState ? now : null }
          : item
      ));

      onComplete?.();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const addChecklistItem = async () => {
    if (!newItem.item.trim()) return;

    try {
      const { data, error } = await supabase
        .from('property_verification_checklists')
        .insert({
          property_id: propertyId,
          agent_id: agentId,
          checklist_item: newItem.item,
          category: newItem.category,
          confirmation_method: newItem.method,
          notes: newItem.notes,
          is_confirmed: false
        })
        .select()
        .single();

      if (error) throw error;

      setChecklist(prev => [...prev, data]);
      setNewItem({ item: '', category: 'amenities', method: 'phone_call', notes: '' });
      setShowAddModal(false);

      await supabase.from('property_verification_timeline').insert({
        property_id: propertyId,
        agent_id: agentId,
        action_type: 'checklist_item_completed',
        action_description: `Added: ${newItem.item}`
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateChecklistItem = async (itemId: string, updates: Partial<ChecklistItem>) => {
    try {
      const { error } = await supabase
        .from('property_verification_checklists')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) throw error;

      setChecklist(prev => prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteChecklistItem = async (itemId: string) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      const { error } = await supabase
        .from('property_verification_checklists')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      setChecklist(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      amenities: 'bg-blue-100 text-blue-800',
      documents: 'bg-green-100 text-green-800',
      legal: 'bg-purple-100 text-purple-800',
      safety: 'bg-red-100 text-red-800',
      contact_verification: 'bg-orange-100 text-orange-800',
      property_condition: 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading checklist...</p>
      </div>
    );
  }

  const completedCount = checklist.filter(item => item.is_confirmed).length;
  const totalCount = checklist.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Verification Checklist</h3>
          <div className="flex items-center mt-1">
            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }}></div>
            </div>
            <span className="text-sm text-gray-600">{completionRate}% complete</span>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {totalCount === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No checklist items yet</p>
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Create First Item</button>
        </div>
      ) : (
        <div className="grid gap-3">
          {checklist.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border-2 ${item.is_confirmed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <button onClick={() => toggleItem(item.id, item.is_confirmed)} className={`w-6 h-6 rounded-full flex items-center justify-center ${item.is_confirmed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {item.is_confirmed && <Check className="h-3 w-3" />}
                    </button>
                    <span className={`text-sm font-medium ${item.is_confirmed ? 'text-green-800 line-through' : 'text-gray-900'}`}>{item.checklist_item}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(item.category)}`}>{item.category.replace(/_/g, ' ')}</span>
                  </div>
                  {(item.notes || item.confirmation_method) && (
                    <div className="ml-8 text-xs text-gray-500 space-y-1">
                      {item.confirmation_method && (
                        <div className="flex items-center gap-1">
                          {item.confirmation_method === 'phone_call' && <Phone className="h-4 w-4" />}
                          {item.confirmation_method === 'photo_verification' && <Camera className="h-4 w-4" />}
                          {item.confirmation_method === 'document_upload' && <FileText className="h-4 w-4" />}
                          <span>{item.confirmation_method.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                      {item.notes && <p className="italic">{item.notes}</p>}
                      {item.confirmed_at && <p className="text-green-600">Confirmed: {new Date(item.confirmed_at).toLocaleString()}</p>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => editingItem === item.id ? setEditingItem(null) : setEditingItem(item.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteChecklistItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {editingItem === item.id && (
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={item.checklist_item} onChange={(e) => updateChecklistItem(item.id, { checklist_item: e.target.value })} className="px-3 py-2 border rounded text-sm" />
                    <select value={item.category} onChange={(e) => updateChecklistItem(item.id, { category: e.target.value })} className="px-3 py-2 border rounded text-sm">
                      <option value="amenities">Amenities</option>
                      <option value="documents">Documents</option>
                      <option value="legal">Legal</option>
                      <option value="safety">Safety</option>
                      <option value="contact_verification">Contact</option>
                      <option value="property_condition">Condition</option>
                    </select>
                    <select value={item.confirmation_method} onChange={(e) => updateChecklistItem(item.id, { confirmation_method: e.target.value })} className="px-3 py-2 border rounded text-sm">
                      <option value="phone_call">Phone Call</option>
                      <option value="photo_verification">Photo</option>
                      <option value="document_upload">Document</option>
                      <option value="physical_inspection">Inspection</option>
                      <option value="walkthrough">Walkthrough</option>
                    </select>
                    <textarea value={item.notes} onChange={(e) => updateChecklistItem(item.id, { notes: e.target.value })} className="px-3 py-2 border rounded text-sm col-span-2" rows={2} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Checklist Item</h3>
            <div className="space-y-3">
              <input placeholder="Item description" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
              <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })} className="w-full px-3 py-2 border rounded text-sm">
                <option value="amenities">Amenities</option>
                <option value="documents">Documents</option>
                <option value="legal">Legal</option>
                <option value="safety">Safety</option>
                <option value="contact_verification">Contact Verification</option>
                <option value="property_condition">Property Condition</option>
              </select>
              <select value={newItem.method} onChange={(e) => setNewItem({ ...newItem, method: e.target.value as any })} className="w-full px-3 py-2 border rounded text-sm">
                <option value="phone_call">Phone Call</option>
                <option value="photo_verification">Photo Verification</option>
                <option value="document_upload">Document Upload</option>
                <option value="physical_inspection">Physical Inspection</option>
                <option value="walkthrough">Walkthrough</option>
              </select>
              <textarea placeholder="Notes" value={newItem.notes} onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" rows={3} />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded text-sm">Cancel</button>
                <button onClick={addChecklistItem} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationChecklist;