import React, { useState } from 'react';
import { Users, Building, DollarSign, BarChart3, Edit, Trash2, Ban, Check, Plus, Save, X, Target, Award, Eye, TrendingUp, AlertTriangle, Clock, Shield, Activity, Upload, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  active: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user, companyInfo, updateCompanyInfo, addTeamMember, updateTeamMember, removeTeamMember } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingMission, setEditingMission] = useState(false);
  const [editingVision, setEditingVision] = useState(false);
  const [missionText, setMissionText] = useState(companyInfo.mission);
  const [visionText, setVisionText] = useState(companyInfo.vision);
  
  // Team member management state
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    order: companyInfo.team.length + 1
  });
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);

  // Mock data
  const stats = {
    totalUsers: 15420,
    totalHostels: 1250,
    totalRevenue: 2850000,
    activeBookings: 3420
  };

  const alerts = [
    { id: 1, type: 'critical', message: 'Server response time above threshold', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'High booking volume detected', time: '15 min ago' },
    { id: 3, type: 'info', message: 'New landlord verification pending', time: '1 hour ago' }
  ];

  const recentActivity = [
    { id: 1, action: 'New user registration', user: 'John Doe', time: '5 min ago', type: 'user' },
    { id: 2, action: 'Hostel verification completed', user: 'Jane Smith', time: '12 min ago', type: 'verification' },
    { id: 3, action: 'Payment processed', user: 'Mike Johnson', time: '25 min ago', type: 'payment' },
    { id: 4, action: 'Review submitted', user: 'Sarah Wilson', time: '1 hour ago', type: 'review' }
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Landlord', status: 'Active', joinDate: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Agent', status: 'Pending', joinDate: '2024-01-20' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Student', status: 'Suspended', joinDate: '2024-01-05' }
  ];

  const handleMissionSave = () => {
    updateCompanyInfo({ mission: missionText });
    setEditingMission(false);
  };

  const handleVisionSave = () => {
    updateCompanyInfo({ vision: visionText });
    setEditingVision(false);
  };

  const handleMemberFormChange = (field: string, value: string | number) => {
    setMemberFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert image to Base64 for persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setMemberFormData(prev => ({
        ...prev,
        image: base64String
      }));
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const resetMemberForm = () => {
    setMemberFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      order: companyInfo.team.length + 1
    });
    setEditingMember(null);
    setShowAddMemberForm(false);
  };

  const handleAddMember = async () => {
    if (!memberFormData.name.trim() || !memberFormData.role.trim() || !memberFormData.bio.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmittingMember(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use default image if none provided
      const imageUrl = memberFormData.image || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`;

      addTeamMember({
        name: memberFormData.name,
        role: memberFormData.role,
        bio: memberFormData.bio,
        image: imageUrl
      });

      resetMemberForm();
      alert('Team member added successfully!');
    } catch (error) {
      alert('Failed to add team member. Please try again.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      order: member.order
    });
    setShowAddMemberForm(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    if (!memberFormData.name.trim() || !memberFormData.role.trim() || !memberFormData.bio.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmittingMember(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateTeamMember(editingMember.id, {
        name: memberFormData.name,
        role: memberFormData.role,
        bio: memberFormData.bio,
        image: memberFormData.image,
        order: memberFormData.order
      });

      resetMemberForm();
      alert('Team member updated successfully!');
    } catch (error) {
      alert('Failed to update team member. Please try again.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team? This action cannot be undone.`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      removeTeamMember(memberId);
      alert('Team member removed successfully!');
    } catch (error) {
      alert('Failed to remove team member. Please try again.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hostels</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalHostels.toLocaleString()}</p>
            </div>
            <Building className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">KSh {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15% from last month</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.activeBookings.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+5% from last month</span>
          </div>
        </Card>
      </div>

      {/* Alerts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Alerts */}
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-2 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'verification' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-yellow-500' :
                  'bg-purple-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Search users..."
            className="w-full sm:w-64"
          />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Student' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'Landlord' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mission */}
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mission Statement</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingMission(!editingMission)}
            >
              {editingMission ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
          {editingMission ? (
            <div className="space-y-3">
              <textarea
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  onClick={handleMissionSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setMissionText(companyInfo.mission);
                    setEditingMission(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{missionText}</p>
          )}
        </Card>

        {/* Vision */}
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vision Statement</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingVision(!editingVision)}
            >
              {editingVision ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
          {editingVision ? (
            <div className="space-y-3">
              <textarea
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  onClick={handleVisionSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setVisionText(companyInfo.vision);
                    setEditingVision(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{visionText}</p>
          )}
        </Card>
      </div>

      {/* Team Management */}
      <Card className="p-3 lg:p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            onClick={() => setShowAddMemberForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Add/Edit Member Form */}
        {showAddMemberForm && (
          <Card className="p-4 mb-6 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={resetMemberForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Input
                  label="Full Name *"
                  value={memberFormData.name}
                  onChange={(e) => handleMemberFormChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />

                <Input
                  label="Role/Position *"
                  value={memberFormData.role}
                  onChange={(e) => handleMemberFormChange('role', e.target.value)}
                  placeholder="e.g., CEO, CTO, Head of Operations"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={memberFormData.order}
                    onChange={(e) => handleMemberFormChange('order', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    {memberFormData.image ? (
                      <img
                        src={memberFormData.image}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                      </label>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate pr-2">{alert.message}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/Description *
                  </label>
                  <textarea
                    value={memberFormData.bio}
                    onChange={(e) => handleMemberFormChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Brief description about the team member..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={resetMemberForm}
                disabled={isSubmittingMember}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={editingMember ? handleUpdateMember : handleAddMember}
                disabled={isSubmittingMember}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                {isSubmittingMember ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingMember ? 'Updating...' : 'Adding...'}
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {companyInfo.team.map((member) => (
            <div key={member.id} className="bg-gray-50 rounded-lg p-3 text-center relative group">
              <img
                src={member.image}
                alt={member.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-gray-300"
              />
              <h4 className="font-semibold text-gray-900 text-sm truncate">{member.name}</h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 truncate">{member.role}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{member.bio}</p>
              
              <div className="flex justify-center space-x-1 sm:space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditMember(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                  onClick={() => handleDeleteMember(member.id, member.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {companyInfo.team.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h4>
            <p className="text-gray-600 mb-4">Add your first team member to get started.</p>
            <Button 
              onClick={() => setShowAddMemberForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Member
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-600 font-medium">System Healthy</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'content', label: 'Content', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'content' && renderContent()}
    </div>
  );
};

export default AdminDashboard;