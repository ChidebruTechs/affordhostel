import React, { useState } from 'react';
import { Camera, Edit, MapPin, Calendar, Phone, Mail, CaseSensitive as University, Award, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ProfilePage: React.FC = () => {
  const { user, currentRole, bookings, hostels } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    university: user?.university || '',
    studentId: user?.studentId || '',
    bio: 'Passionate student looking for quality accommodation near campus. Love studying in quiet environments and value cleanliness and security.',
    interests: ['Study Groups', 'Sports', 'Technology', 'Music']
  });

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProfileStats = () => {
    switch (currentRole) {
      case 'student':
        return [
          { label: 'Bookings Made', value: bookings.length, icon: Calendar },
          { label: 'Reviews Written', value: 8, icon: Star },
          { label: 'Wishlist Items', value: 5, icon: CheckCircle },
          { label: 'Member Since', value: '2023', icon: Award }
        ];
      case 'landlord':
        return [
          { label: 'Properties Listed', value: 4, icon: Calendar },
          { label: 'Total Bookings', value: 45, icon: Star },
          { label: 'Average Rating', value: '4.8', icon: CheckCircle },
          { label: 'Revenue (Monthly)', value: 'Ksh 480K', icon: Award }
        ];
      case 'agent':
        return [
          { label: 'Properties Verified', value: 24, icon: Calendar },
          { label: 'Landlords Managed', value: 18, icon: Star },
          { label: 'Verification Rate', value: '92%', icon: CheckCircle },
          { label: 'Experience', value: '3 Years', icon: Award }
        ];
      default:
        return [
          { label: 'Platform Users', value: '1.2K', icon: Calendar },
          { label: 'Total Properties', value: 324, icon: Star },
          { label: 'System Uptime', value: '99.9%', icon: CheckCircle },
          { label: 'Admin Since', value: '2023', icon: Award }
        ];
    }
  };

  const getRecentActivity = () => {
    switch (currentRole) {
      case 'student':
        return [
          { action: 'Booked', item: 'Umoja Hostels', date: '2 days ago', status: 'confirmed' },
          { action: 'Reviewed', item: 'Kilele Hostels', date: '1 week ago', status: 'completed' },
          { action: 'Added to wishlist', item: 'Prestige Hostels', date: '2 weeks ago', status: 'pending' }
        ];
      case 'landlord':
        return [
          { action: 'New booking request', item: 'Umoja Hostels', date: '1 hour ago', status: 'pending' },
          { action: 'Payment received', item: 'Greenview Apartments', date: '2 days ago', status: 'confirmed' },
          { action: 'Property updated', item: 'Kilele Hostels', date: '1 week ago', status: 'completed' }
        ];
      case 'agent':
        return [
          { action: 'Verified property', item: 'Sunset View Hostels', date: '3 hours ago', status: 'confirmed' },
          { action: 'Site inspection', item: 'Haven Residences', date: '1 day ago', status: 'completed' },
          { action: 'Document review', item: 'Campus Lodge', date: '3 days ago', status: 'pending' }
        ];
      default:
        return [
          { action: 'User approved', item: 'New landlord account', date: '30 minutes ago', status: 'confirmed' },
          { action: 'System update', item: 'Platform maintenance', date: '2 days ago', status: 'completed' },
          { action: 'Report generated', item: 'Monthly analytics', date: '1 week ago', status: 'completed' }
        ];
    }
  };

  const stats = getProfileStats();
  const activities = getRecentActivity();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(profileData.name)}
            </div>
            <button className="absolute bottom-2 right-2 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <Camera className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-lg text-purple-600 capitalize">{currentRole}</p>
              </div>
              <Button
                variant={isEditing ? "primary" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{profileData.phone}</span>
              </div>
              {currentRole === 'student' && (
                <>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <University className="h-4 w-4" />
                    <span>{profileData.university}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>ID: {profileData.studentId}</span>
                  </div>
                </>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <stat.icon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>

            {currentRole === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  {isEditing ? (
                    <select
                      value={profileData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option>University of Nairobi</option>
                      <option>Kenyatta University</option>
                      <option>JKUAT</option>
                      <option>Mount Kenya University</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profileData.university}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.studentId}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'confirmed' ? 'bg-green-500' :
                  activity.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.action}</span> {activity.item}
                  </p>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interests/Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentRole === 'student' ? 'Interests' : 'Skills & Expertise'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {profileData.interests.map((interest, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {interest}
            </span>
          ))}
          {isEditing && (
            <button className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-purple-300 hover:text-purple-600 transition-colors">
              + Add {currentRole === 'student' ? 'Interest' : 'Skill'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;