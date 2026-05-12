import React, { useState, useEffect } from 'react';
import { Users, Building, DollarSign, BarChart3, Edit, Trash2, Ban, Check, Plus, Save, X, Target, Award, Eye, TrendingUp, AlertTriangle, Clock, Shield, Activity, Upload, Camera, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../../lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  active: boolean;
  created_at: string;
}

interface DashboardStats {
  total_users: number;
  total_hostels: number;
  total_revenue: number;
  active_bookings: number;
  user_growth: number;
  hostel_growth: number;
  revenue_growth: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  avatar_url?: string;
  last_login?: string;
}

interface RecentActivity {
  id: string;
  action: string;
  user_name: string;
  user_id: string;
  created_at: string;
  type: string;
  details?: any;
}

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  created_at: string;
  resolved: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingMission, setEditingMission] = useState(false);
  const [editingVision, setEditingVision] = useState(false);
  const [missionText, setMissionText] = useState('');
  const [visionText, setVisionText] = useState('');
  
  // Team member management state
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    order: 0
  });
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);

  // State for fetched data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_users: 0,
    total_hostels: 0,
    total_revenue: 0,
    active_bookings: 0,
    user_growth: 0,
    hostel_growth: 0,
    revenue_growth: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      await Promise.all([
        fetchDashboardStats(),
        fetchUsers(),
        fetchRecentActivity(),
        fetchSystemAlerts(),
        fetchTeamMembers(),
        fetchCompanyInfo()
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total hostels
      const { count: hostelCount } = await supabase
        .from('hostels')
        .select('*', { count: 'exact', head: true });

      // Fetch total revenue (from bookings)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('amount, status')
        .in('status', ['confirmed', 'completed']);

      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0;

      // Fetch active bookings
      const { count: activeBookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed']);

      setDashboardStats(prev => ({
        ...prev,
        total_users: userCount || 0,
        total_hostels: hostelCount || 0,
        total_revenue: totalRevenue,
        active_bookings: activeBookingCount || 0,
        // Growth calculations would require historical data
        user_growth: 12, // Mock data for now
        hostel_growth: 8,
        revenue_growth: 15
      }));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const transformedUsers = (usersData || []).map(user => ({
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email || '',
        role: user.role || 'user',
        status: 'active', // This would need to be determined based on actual status
        created_at: user.created_at,
        avatar_url: user.avatar_url,
        last_login: user.last_sign_in_at
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // In a real app, this would come from an activity log table
      // For now, we'll mock some data
      const mockActivities: RecentActivity[] = [
        { id: '1', action: 'New user registration', user_name: 'John Doe', user_id: '1', created_at: new Date().toISOString(), type: 'user' },
        { id: '2', action: 'Hostel verification completed', user_name: 'Jane Smith', user_id: '2', created_at: new Date(Date.now() - 720000).toISOString(), type: 'verification' },
        { id: '3', action: 'Payment processed', user_name: 'Mike Johnson', user_id: '3', created_at: new Date(Date.now() - 1500000).toISOString(), type: 'payment' },
        { id: '4', action: 'Review submitted', user_name: 'Sarah Wilson', user_id: '4', created_at: new Date(Date.now() - 3600000).toISOString(), type: 'review' }
      ];

      setRecentActivity(mockActivities);
    } catch (err) {
      console.error('Error fetching activity:', err);
    }
  };

  const fetchSystemAlerts = async () => {
    try {
      // In a real app, this would come from a monitoring system
      const mockAlerts: SystemAlert[] = [
        { id: '1', type: 'critical', message: 'Server response time above threshold', created_at: new Date(Date.now() - 120000).toISOString(), resolved: false },
        { id: '2', type: 'warning', message: 'High booking volume detected', created_at: new Date(Date.now() - 900000).toISOString(), resolved: false },
        { id: '3', type: 'info', message: 'New landlord verification pending', created_at: new Date(Date.now() - 3600000).toISOString(), resolved: false }
      ];

      setSystemAlerts(mockAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // Create a team_members table in Supabase first
      // For now, we'll check if the table exists and create it if needed
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order', { ascending: true });

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Team members table does not exist yet');
        setTeamMembers([]);
      } else if (error) {
        throw error;
      } else {
        setTeamMembers(data || []);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      // Create a company_info table in Supabase
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .single();

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it with default values
        setMissionText('Our mission is to provide affordable, quality accommodation for students across Kenya.');
        setVisionText('To be the leading platform connecting students with safe, verified, and affordable housing.');
      } else if (error && error.code === 'PGRST116') {
        // No rows in table
        setMissionText('Our mission is to provide affordable, quality accommodation for students across Kenya.');
        setVisionText('To be the leading platform connecting students with safe, verified, and affordable housing.');
      } else if (error) {
        throw error;
      } else if (data) {
        setMissionText(data.mission || '');
        setVisionText(data.vision || '');
      }
    } catch (err) {
      console.error('Error fetching company info:', err);
    }
  };

  const handleMissionSave = async () => {
    try {
      const { error } = await supabase
        .from('company_info')
        .upsert({
          id: 'company_info',
          mission: missionText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      setEditingMission(false);
      alert('Mission statement updated successfully!');
    } catch (err: any) {
      console.error('Error saving mission:', err);
      alert(`Failed to save mission: ${err.message}`);
    }
  };

  const handleVisionSave = async () => {
    try {
      const { error } = await supabase
        .from('company_info')
        .upsert({
          id: 'company_info',
          vision: visionText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      setEditingVision(false);
      alert('Vision statement updated successfully!');
    } catch (err: any) {
      console.error('Error saving vision:', err);
      alert(`Failed to save vision: ${err.message}`);
    }
  };

  const handleMemberFormChange = (field: string, value: string | number) => {
    setMemberFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `team-members/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      setMemberFormData(prev => ({
        ...prev,
        image: publicUrl
      }));
    } catch (err: any) {
      console.error('Error uploading image:', err);
      alert(`Failed to upload image: ${err.message}`);
    }
  };

  const resetMemberForm = () => {
    setMemberFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      order: teamMembers.length + 1
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
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: memberFormData.name,
          role: memberFormData.role,
          bio: memberFormData.bio,
          image: memberFormData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
          order: memberFormData.order,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      setTeamMembers(prev => [...prev, data]);
      resetMemberForm();
      alert('Team member added successfully!');
    } catch (err: any) {
      console.error('Error adding team member:', err);
      alert(`Failed to add team member: ${err.message}`);
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
      const { error } = await supabase
        .from('team_members')
        .update({
          name: memberFormData.name,
          role: memberFormData.role,
          bio: memberFormData.bio,
          image: memberFormData.image,
          order: memberFormData.order,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      setTeamMembers(prev => prev.map(member => 
        member.id === editingMember.id 
          ? { ...member, ...memberFormData }
          : member
      ));

      resetMemberForm();
      alert('Team member updated successfully!');
    } catch (err: any) {
      console.error('Error updating team member:', err);
      alert(`Failed to update team member: ${err.message}`);
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      alert('Team member removed successfully!');
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      alert(`Failed to remove team member: ${err.message}`);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string, userName: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'suspended' ? 'suspend' : 'activate';
    
    if (!confirm(`Are you sure you want to ${action} ${userName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      alert(`User ${action}d successfully!`);
    } catch (err: any) {
      console.error('Error updating user status:', err);
      alert(`Failed to ${action} user: ${err.message}`);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      // System alerts are mock data - just remove from local state
      // In a real implementation with a system_alerts table, you would update it here:
      // const { error } = await supabase
      //   .from('system_alerts')
      //   .update({ resolved: true })
      //   .eq('id', alertId);
      //
      // if (error) throw error;

      setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err: any) {
      console.error('Error resolving alert:', err);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchDashboardData} className="mr-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{dashboardStats.total_users.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardStats.user_growth}% from last month</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hostels</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{dashboardStats.total_hostels.toLocaleString()}</p>
            </div>
            <Building className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardStats.hostel_growth}% from last month</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">KSh {dashboardStats.total_revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardStats.revenue_growth}% from last month</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{dashboardStats.active_bookings.toLocaleString()}</p>
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
            {systemAlerts.length > 0 ? (
              systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-2 rounded-lg border-l-4 ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{formatTimeAgo(alert.created_at)}</span>
                      {!alert.resolved && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Check className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-gray-600">No active alerts</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'verification' ? 'bg-green-500' :
                    activity.type === 'payment' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user_name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
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
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={fetchUsers}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'landlord' ? 'bg-green-100 text-green-800' :
                        user.role === 'agent' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1 sm:space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700"
                          onClick={() => handleToggleUserStatus(user.id, user.status, user.name)}>
                          {user.status === 'active' ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
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
          {teamMembers.length > 0 ? (
            teamMembers.sort((a, b) => a.order - b.order).map((member) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h4>
              <p className="text-gray-600 mb-4">Add your first team member to get started.</p>
              <Button 
                onClick={() => setShowAddMemberForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            </div>
          )}
        </div>
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