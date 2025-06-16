import React, { useState } from 'react';
import { Camera, Shield, Download, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SettingsPage: React.FC = () => {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    university: user?.university || '',
    studentId: user?.studentId || ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save changes logic
    console.log('Saving changes:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Personal Information */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Personal Information
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">University</label>
              <select
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option>University of Nairobi</option>
                <option>Kenyatta University</option>
                <option>JKUAT</option>
                <option>Mount Kenya University</option>
              </select>
            </div>

            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>

      {/* Security Settings */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Security Settings
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="flex items-center space-x-4">
              <input
                type="password"
                value="••••••••"
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button variant="outline">Change Password</Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Active Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Chrome, Windows</p>
                  <p className="text-sm text-gray-600">Nairobi, Kenya • Just now</p>
                </div>
                <Button variant="outline" size="sm">Logout</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Safari, iOS</p>
                  <p className="text-sm text-gray-600">Nairobi, Kenya • 2 days ago</p>
                </div>
                <Button variant="outline" size="sm">Logout</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Notification Preferences
        </h2>
        
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', description: 'Receive booking confirmations and updates via email' },
            { label: 'SMS Notifications', description: 'Get important alerts via text message' },
            { label: 'Push Notifications', description: 'Receive browser notifications for real-time updates' },
            { label: 'Marketing Emails', description: 'Stay updated with new hostels and special offers' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-8 border-red-200 bg-red-50">
        <h2 className="text-2xl font-semibold text-red-900 mb-6">Danger Zone</h2>
        <p className="text-red-700 mb-6">
          Deleting your account is permanent and cannot be undone. All your data will be erased.
        </p>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="danger">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;