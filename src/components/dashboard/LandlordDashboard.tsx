import React, { useState, useEffect } from 'react';
import { 
  Building, Calendar, DollarSign, TrendingUp, Eye, Check, X, Plus, Edit, 
  Users, Star, BarChart3, AlertCircle, Clock, MapPin, CheckCircle, 
  AlertTriangle, Home, UserPlus, MessageSquare 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../../lib/supabase';

interface LandlordDashboardProps {
  initialActiveTab?: string;
}

interface LandlordStats {
  propertiesListed: number;
  activeBookings: number;
  pendingRequests: number;
  monthlyRevenue: number;
}

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  university: string;
  price: number;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: number;
  landlord_id: string;
  verified: boolean;
  available: boolean;
  verification_status: string;
  assigned_agent_id?: string;
  room_types: any[];
  created_at: string;
  updated_at: string;
}

interface BookingRequest {
  id: string;
  hostel_id: string;
  hostel_name: string;
  student_id: string;
  student_name: string;
  student_email: string;
  room_type: string;
  check_in: string;
  check_out: string;
  amount: number;
  status: string;
  created_at: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'maintenance' | 'verification';
  title: string;
  description: string;
  time: string;
  status: 'pending' | 'success' | 'info' | 'warning';
}

const LandlordDashboard: React.FC<LandlordDashboardProps> = ({ initialActiveTab }) => {
  const { user, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for fetched data
  const [stats, setStats] = useState<LandlordStats>({
    propertiesListed: 0,
    activeBookings: 0,
    pendingRequests: 0,
    monthlyRevenue: 0
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch landlord profile
      const { data: landlordData, error: landlordError } = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (landlordError) throw landlordError;

      const landlordId = landlordData.id;

      // Fetch data in parallel
      await Promise.all([
        fetchStats(landlordId),
        fetchProperties(landlordId),
        fetchBookingRequests(landlordId),
        fetchRevenueData(landlordId),
        fetchRecentActivity(landlordId)
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async (landlordId: string) => {
    try {
      // Fetch properties count
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('hostels')
        .select('id')
        .eq('landlord_id', landlordId);

      if (propertiesError) throw propertiesError;

      // Fetch bookings count
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status')
        .in('hostel_id', propertiesData?.map(p => p.id) || []);

      if (bookingsError) throw bookingsError;

      const activeBookings = bookingsData?.filter(b => b.status === 'confirmed').length || 0;
      const pendingRequests = bookingsData?.filter(b => b.status === 'pending').length || 0;

      // Calculate monthly revenue (sum of confirmed bookings this month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const { data: revenueData, error: revenueError } = await supabase
        .from('bookings')
        .select('amount, created_at')
        .in('hostel_id', propertiesData?.map(p => p.id) || [])
        .eq('status', 'confirmed')
        .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('created_at', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

      if (revenueError) throw revenueError;

      const monthlyRevenue = revenueData?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0;

      setStats({
        propertiesListed: propertiesData?.length || 0,
        activeBookings,
        pendingRequests,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProperties = async (landlordId: string) => {
    try {
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('hostels')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchBookingRequests = async (landlordId: string) => {
    try {
      // First get landlord's properties
      const { data: propertiesData } = await supabase
        .from('hostels')
        .select('id, name')
        .eq('landlord_id', landlordId);

      if (!propertiesData?.length) {
        setBookingRequests([]);
        return;
      }

      const propertyIds = propertiesData.map(p => p.id);
      
      // Get pending bookings for these properties
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          students (
            user_id,
            profiles (
              first_name,
              last_name,
              email
            )
          )
        `)
        .in('hostel_id', propertyIds)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      const formattedRequests: BookingRequest[] = (bookingsData || []).map(booking => {
        const property = propertiesData.find(p => p.id === booking.hostel_id);
        return {
          id: booking.id,
          hostel_id: booking.hostel_id,
          hostel_name: property?.name || 'Unknown Hostel',
          student_id: booking.student_id,
          student_name: `${booking.students?.profiles?.first_name || ''} ${booking.students?.profiles?.last_name || ''}`.trim() || 'Unknown Student',
          student_email: booking.students?.profiles?.email || '',
          room_type: booking.room_type,
          check_in: booking.check_in,
          check_out: booking.check_out,
          amount: booking.amount || 0,
          status: booking.status,
          created_at: booking.created_at
        };
      });

      setBookingRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    }
  };

  const fetchRevenueData = async (landlordId: string) => {
    try {
      // Get landlord's properties
      const { data: propertiesData } = await supabase
        .from('hostels')
        .select('id')
        .eq('landlord_id', landlordId);

      if (!propertiesData?.length) {
        setRevenueData([]);
        return;
      }

      const propertyIds = propertiesData.map(p => p.id);
      
      // Generate last 6 months data
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          month: date.toLocaleString('default', { month: 'short' }),
          monthIndex: date.getMonth(),
          year: date.getFullYear()
        });
      }

      // Fetch revenue data for each month
      const revenuePromises = months.map(async ({ month, monthIndex, year }) => {
        const startDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(monthIndex + 2).padStart(2, '0')}-01`;

        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('amount')
          .in('hostel_id', propertyIds)
          .eq('status', 'confirmed')
          .gte('created_at', startDate)
          .lt('created_at', endDate);

        const revenue = bookingsData?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0;
        
        // Count bookings for this month
        const { data: bookingsCountData } = await supabase
          .from('bookings')
          .select('id')
          .in('hostel_id', propertyIds)
          .eq('status', 'confirmed')
          .gte('created_at', startDate)
          .lt('created_at', endDate);

        return {
          month,
          revenue,
          bookings: bookingsCountData?.length || 0
        };
      });

      const revenueResults = await Promise.all(revenuePromises);
      setRevenueData(revenueResults);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchRecentActivity = async (landlordId: string) => {
    try {
      // Get recent bookings for activity
      const { data: recentBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status, created_at, hostels(name)')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (bookingsError) throw bookingsError;

      // Format activity from bookings
      const activityFromBookings: Activity[] = (recentBookings || []).map(booking => ({
        id: `booking_${booking.id}`,
        type: 'booking' as const,
        title: `Booking ${booking.status}`,
        description: `New booking for ${booking.hostels?.name || 'your property'}`,
        time: formatTimeAgo(booking.created_at),
        status: booking.status === 'confirmed' ? 'success' : 
                booking.status === 'pending' ? 'pending' : 'warning'
      }));

      setRecentActivity(activityFromBookings);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh booking requests
      const landlordData = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (landlordData.data) {
        fetchBookingRequests(landlordData.data.id);
        fetchStats(landlordData.data.id); // Update stats
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      setError('Failed to approve booking');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh booking requests
      const landlordData = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (landlordData.data) {
        fetchBookingRequests(landlordData.data.id);
        fetchStats(landlordData.data.id); // Update stats
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setError('Failed to reject booking');
    }
  };

  const getVerificationStatusDisplay = (verificationStatus: string, assignedAgentId?: string) => {
    switch (verificationStatus) {
      case 'pending_submission':
        return {
          text: 'Awaiting agent assignment',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'pending_review':
        return {
          text: 'Under review by agent',
          color: 'bg-blue-100 text-blue-800',
          icon: Users
        };
      case 'verified':
        return {
          text: 'Verified',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'rejected':
        return {
          text: 'Verification rejected',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      case 'needs_more_info':
        return {
          text: 'Additional info required',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertTriangle
        };
      default:
        return {
          text: verificationStatus.replace('_', ' '),
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `Ksh ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Ksh ${(amount / 1000).toFixed(0)}K`;
    }
    return `Ksh ${amount.toLocaleString()}`;
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  // Update activeTab when initialActiveTab prop changes
  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Properties Listed</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.propertiesListed}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {stats.propertiesListed > 0 ? '+0 this month' : 'No properties yet'}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-teal-100 flex-shrink-0">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-teal-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Bookings</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {stats.activeBookings > 0 ? 'Confirmed bookings' : 'No active bookings'}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-blue-100 flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {stats.pendingRequests > 0 ? 'Awaiting approval' : 'No pending requests'}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-orange-100 flex-shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                This month's revenue
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-green-100 flex-shrink-0">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </Card>
      ) : (
        <>
          {/* Quick Actions */}
          <Card className="p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                className="flex flex-col items-center p-3 md:p-4 h-auto"
                onClick={() => setCurrentPage('add-edit-hostel')}
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">Add Property</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-3 md:p-4 h-auto"
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">View Bookings</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-3 md:p-4 h-auto"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-3 md:p-4 h-auto"
                onClick={() => setCurrentPage('tenants')}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">Tenants</span>
              </Button>
            </div>
          </Card>

          {/* Revenue Chart */}
          <Card className="p-4 md:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            
            {revenueData.length > 0 ? (
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24 sm:w-32 lg:w-48">
                        <div 
                          className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(data.revenue)}</p>
                      <p className="text-xs text-gray-500">{data.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No revenue data available</p>
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' :
                      activity.status === 'pending' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Calendar className={`h-4 w-4 ${
                        activity.status === 'success' ? 'text-green-600' :
                        activity.status === 'warning' ? 'text-yellow-600' :
                        activity.status === 'pending' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{activity.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      {/* Booking Requests */}
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Booking Requests</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{bookingRequests.length} pending</span>
            <Button variant="outline" size="sm" onClick={() => fetchBookingRequests(user?.id || '')}>
              Refresh
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking requests...</p>
          </div>
        ) : bookingRequests.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {bookingRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{request.student_name}</h4>
                        <p className="text-xs text-gray-600">{request.student_email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Hostel:</span>
                        <p className="font-medium text-gray-900 truncate">{request.hostel_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Room:</span>
                        <p className="font-medium text-gray-900">{request.room_type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(request.check_in).toLocaleDateString()} - {new Date(request.check_out).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Check-in:</span>
                        <p className="font-medium text-gray-900">{new Date(request.check_in).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500">Amount:</span>
                        <p className="text-sm font-semibold text-gray-900">Ksh {request.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="px-3 py-1 text-xs"
                          onClick={() => handleApproveBooking(request.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="px-3 py-1 text-xs"
                          onClick={() => handleRejectBooking(request.id)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[120px]">Student</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[100px]">Hostel</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[80px]">Room</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[80px]">Duration</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[80px]">Amount</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.student_name}</div>
                          <div className="text-xs text-gray-500">{request.student_email}</div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{request.hostel_name}</td>
                      <td className="py-4 text-sm text-gray-600">{request.room_type}</td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(request.check_in).toLocaleDateString()} - {new Date(request.check_out).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        Ksh {request.amount.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="px-3 py-1 text-xs"
                            onClick={() => handleApproveBooking(request.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="px-3 py-1 text-xs"
                            onClick={() => handleRejectBooking(request.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Booking Requests</h3>
            <p className="text-gray-600 mb-4">You don't have any pending booking requests at the moment.</p>
            <Button variant="outline" onClick={() => setCurrentPage('hostels')}>
              View Your Properties
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      {/* Properties Grid */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </Card>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {properties.map((property) => {
            const verificationDisplay = getVerificationStatusDisplay(
              property.verification_status, 
              property.assigned_agent_id
            );
            const IconComponent = verificationDisplay.icon;

            return (
              <Card key={property.id} className="overflow-hidden">
                <div 
                  className="h-32 sm:h-40 md:h-48 bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: property.images?.[0] ? `url(${property.images[0]})` : 'none' }}
                ></div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{property.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{property.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${property.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {property.available ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {/* Verification Status */}
                  <div className="mb-3">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${verificationDisplay.color}`}>
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs font-medium">{verificationDisplay.text}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">Ksh {property.price.toLocaleString()}/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{property.rating.toFixed(1)} ({property.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => setCurrentPage(`hostel-detail-${property.id}`)}
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => {
                        setCurrentPage('add-edit-hostel', { hostelId: property.id });
                      }}
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Listed</h3>
          <p className="text-gray-600 mb-6">Add your first property to start receiving bookings.</p>
          <Button onClick={() => setCurrentPage('add-edit-hostel')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      )}

      {/* Add Property Card */}
      <Card 
        className="p-6 md:p-8 text-center border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors cursor-pointer"
        onClick={() => setCurrentPage('add-edit-hostel')}
      >
        <Plus className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Add New Property</h3>
        <p className="text-gray-600 mb-6">List a new hostel to start receiving bookings.</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-teal-600 mb-1 sm:mb-2">
            {properties.length > 0 ? '85%' : '0%'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Average Occupancy</div>
        </Card>
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
            {properties.length > 0 ? '4.7' : '0.0'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
        </Card>
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
            {properties.length > 0 ? '12%' : '0%'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Revenue Growth</div>
        </Card>
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
            {bookingRequests.length > 0 ? '2.3' : '0.0'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Days Avg Response</div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="p-4 md:p-5">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Property Performance</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : properties.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {properties.map((property) => (
                <Card key={property.id} className="p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{property.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{property.location}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs font-medium">{property.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-teal-600">{property.reviews}</div>
                        <div className="text-xs text-gray-600">Reviews</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(property.price * 10)} {/* Estimated monthly revenue */}
                        </div>
                        <div className="text-xs text-gray-600">Est. Revenue</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{property.verification_status}</span> status
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs px-3 py-1"
                        onClick={() => setCurrentPage(`hostel-detail-${property.id}`)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[120px]">Property</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[80px]">Price</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[100px]">Rating</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[100px]">Reviews</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[100px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100">
                      <td className="py-4 text-sm font-medium text-gray-900">{property.name}</td>
                      <td className="py-4 text-sm text-gray-600">Ksh {property.price.toLocaleString()}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{property.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{property.reviews}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          property.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                          property.verification_status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                          property.verification_status === 'pending_submission' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.verification_status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600 mb-4">Add properties to see performance analytics.</p>
            <Button onClick={() => setCurrentPage('add-edit-hostel')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `Welcome back, ${user?.name?.split(' ')[0] || 'Landlord'}! Manage your properties efficiently.`}
          </p>
        </div>
        <Button onClick={() => setCurrentPage('add-edit-hostel')}>
          <Building className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'properties', label: 'Properties', icon: Building },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'bookings' && renderBookings()}
      {activeTab === 'properties' && renderProperties()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default LandlordDashboard;