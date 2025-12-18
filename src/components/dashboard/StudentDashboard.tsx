import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Bell, Star, MapPin, Clock, CreditCard, Download, Search, Eye, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../../lib/supabase';

interface StudentStats {
  activeBookings: number;
  wishlisted: number;
  unreadNotifications: number;
  reviewsWritten: number;
}

interface Payment {
  id: string;
  hostel_id: string;
  hostel_name: string;
  amount: number;
  due_date: string;
  status: 'due' | 'upcoming' | 'paid';
}

interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'wishlist' | 'notification';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

const StudentDashboard: React.FC = () => {
  const { user, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for fetched data
  const [stats, setStats] = useState<StudentStats>({
    activeBookings: 0,
    wishlisted: 0,
    unreadNotifications: 0,
    reviewsWritten: 0
  });
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [hostels, setHostels] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch student profile to get student_id
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, student_id')
        .eq('user_id', user.id)
        .single();

      if (studentError) throw studentError;

      const studentId = studentData.id;
      const studentUserId = studentData.student_id;

      // Fetch stats
      await Promise.all([
        fetchBookings(studentId),
        fetchWishlist(user.id),
        fetchNotifications(user.id),
        fetchReviewsCount(user.id),
        fetchUpcomingPayments(studentUserId),
        fetchRecentActivity(studentId),
        fetchAllHostels()
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async (studentId: string) => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          hostels (
            id,
            name,
            location,
            images,
            price
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      const formattedBookings = bookingsData?.map(booking => ({
        id: booking.id,
        hostelId: booking.hostel_id,
        studentId: booking.student_id,
        roomType: booking.room_type,
        checkIn: new Date(booking.check_in),
        checkOut: new Date(booking.check_out),
        amount: booking.amount,
        status: booking.status,
        createdAt: new Date(booking.created_at),
        hostel: booking.hostels
      })) || [];

      setBookings(formattedBookings);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeBookings: formattedBookings.filter(b => b.status === 'confirmed').length
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchWishlist = async (userId: string) => {
    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select(`
          *,
          hostels (
            id,
            name,
            location,
            images,
            price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (wishlistError) throw wishlistError;

      const formattedWishlist = wishlistData?.map(item => ({
        id: item.id,
        userId: item.user_id,
        hostelId: item.hostel_id,
        createdAt: new Date(item.created_at),
        hostel: item.hostels
      })) || [];

      setWishlist(formattedWishlist);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        wishlisted: formattedWishlist.length
      }));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;

      // Update stats
      setStats(prev => ({
        ...prev,
        unreadNotifications: notificationsData?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchReviewsCount = async (userId: string) => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId);

      if (reviewsError) throw reviewsError;

      // Update stats
      setStats(prev => ({
        ...prev,
        reviewsWritten: reviewsData?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching reviews count:', error);
    }
  };

  const fetchUpcomingPayments = async (studentUserId: string) => {
    try {
      // In a real app, this would come from a payments table
      // For now, we'll get upcoming payments from bookings
      const { data: upcomingPaymentsData, error: paymentsError } = await supabase
        .from('bookings')
        .select(`
          id,
          amount,
          check_in,
          hostels (
            name
          )
        `)
        .eq('student_id', studentUserId)
        .gte('check_in', new Date().toISOString())
        .order('check_in', { ascending: true })
        .limit(3);

      if (paymentsError) throw paymentsError;

      const formattedPayments: Payment[] = (upcomingPaymentsData || []).map(payment => ({
        id: payment.id,
        hostel_id: payment.hostel_id,
        hostel_name: payment.hostels?.name || 'Unknown Hostel',
        amount: payment.amount || 0,
        due_date: payment.check_in,
        status: 'upcoming' as const
      }));

      setUpcomingPayments(formattedPayments);
    } catch (error) {
      console.error('Error fetching upcoming payments:', error);
    }
  };

  const fetchRecentActivity = async (studentId: string) => {
    try {
      // Fetch recent bookings
      const { data: recentBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('created_at, status, hostels(name)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) throw bookingsError;

      // Format recent activity from bookings
      const activityFromBookings: Activity[] = (recentBookings || []).map(booking => ({
        id: `booking_${booking.id}`,
        type: 'booking' as const,
        title: `Booking ${booking.status}`,
        description: booking.status === 'confirmed' 
          ? `Your booking at ${booking.hostels?.name || 'a hostel'} has been confirmed`
          : `Your booking at ${booking.hostels?.name || 'a hostel'} is ${booking.status}`,
        time: formatTimeAgo(booking.created_at),
        status: booking.status === 'confirmed' ? 'success' : 
                booking.status === 'pending' ? 'warning' : 'error'
      }));

      // In a real app, you would fetch from an activities table
      // For now, use bookings as recent activity
      setRecentActivity(activityFromBookings);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchAllHostels = async () => {
    try {
      const { data: hostelsData, error: hostelsError } = await supabase
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (hostelsError) throw hostelsError;

      setHostels(hostelsData || []);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    }
  };

  // Helper function to format time ago
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

  // Fetch data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = !searchTerm || 
      (booking.hostel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.hostel?.location?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'review': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'wishlist': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

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
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Bookings</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stats.activeBookings > 0 ? '+0 this month' : 'No active bookings'}</p>
            </div>
            <div className={`p-2 md:p-3 rounded-full bg-purple-100 flex-shrink-0`}>
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Wishlisted</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.wishlisted}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stats.wishlisted > 0 ? '+0 this week' : 'No items in wishlist'}</p>
            </div>
            <div className={`p-2 md:p-3 rounded-full bg-red-100 flex-shrink-0`}>
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Unread Notifications</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.unreadNotifications}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stats.unreadNotifications > 0 ? 'Check notifications' : 'All caught up'}</p>
            </div>
            <div className={`p-2 md:p-3 rounded-full bg-orange-100 flex-shrink-0`}>
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Reviews Written</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.reviewsWritten}</p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stats.reviewsWritten > 0 ? 'Thank you for your reviews!' : 'Write your first review'}</p>
            </div>
            <div className={`p-2 md:p-3 rounded-full bg-yellow-100 flex-shrink-0`}>
              <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </Card>
      ) : (
        <>
          {/* Quick Actions */}
          <Card className="p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button onClick={() => setCurrentPage('hostels')} className="flex flex-col items-center p-3 md:p-4 h-auto">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">Browse Hostels</span>
              </Button>
              <Button onClick={() => setActiveTab('bookings')} variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">My Bookings</span>
              </Button>
              <Button onClick={() => setActiveTab('wishlist')} variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">Wishlist</span>
              </Button>
              <Button onClick={() => setCurrentPage('profile')} variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                <span className="text-xs sm:text-sm">Profile</span>
              </Button>
            </div>
          </Card>

          {/* Upcoming Payments */}
          <Card className="p-4 md:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Upcoming Payments</h2>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>
                View All
              </Button>
            </div>
            
            {upcomingPayments.length > 0 ? (
              <div className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{payment.hostel_name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <div className="text-right flex-1 sm:flex-none">
                        <div className="text-sm sm:text-base font-semibold text-gray-900">Ksh {payment.amount.toLocaleString()}</div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          payment.status === 'due' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status === 'due' ? 'Due Now' : 'Upcoming'}
                        </span>
                      </div>
                      <Button size="sm" className="text-xs sm:text-sm whitespace-nowrap">Pay Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming payments</p>
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
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{activity.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
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
      {/* Filters */}
      <Card className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Bookings List */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </Card>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const hostel = booking.hostel;
            return (
              <Card key={booking.id} className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                    <div 
                      className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: hostel?.images?.[0] ? `url(${hostel.images[0]})` : 'none' }}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{hostel?.name || 'Unknown Hostel'}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-xs sm:text-sm mt-1 gap-1 sm:gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                        </div>
                        {hostel?.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {hostel.location}
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Room: {booking.roomType}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-lg font-semibold text-gray-900">
                        Ksh {booking.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 text-xs sm:text-sm capitalize">{booking.status}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs sm:text-sm"
                        onClick={() => setCurrentPage('booking-detail')}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="text-xs sm:text-sm">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
          <Button onClick={() => setCurrentPage('hostels')}>
            Browse Hostels
          </Button>
        </Card>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </Card>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wishlist.map((item) => {
            const hostel = item.hostel;
            if (!hostel) return null;
            
            return (
              <Card key={item.id} hover className="overflow-hidden">
                <div 
                  className="h-32 sm:h-40 md:h-48 bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: hostel?.images?.[0] ? `url(${hostel.images[0]})` : 'none' }}
                ></div>
                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{hostel.name}</h3>
                  <div className="text-purple-600 font-semibold mb-2">Ksh {hostel.price.toLocaleString()}/month</div>
                  <p className="text-gray-600 mb-4 text-sm">{hostel.location}</p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button 
                      className="flex-1 text-sm" 
                      onClick={() => setCurrentPage('hostel-detail')}
                    >
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-sm"
                      onClick={async () => {
                        try {
                          await supabase
                            .from('wishlist')
                            .delete()
                            .eq('id', item.id);
                          fetchDashboardData(); // Refresh data
                        } catch (error) {
                          console.error('Error removing from wishlist:', error);
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6 md:p-8 text-center">
          <Heart className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Start adding hostels you're interested in to keep track of them.</p>
          <Button onClick={() => setCurrentPage('hostels')}>
            Browse Hostels
          </Button>
        </Card>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">My Reviews</h2>
          <Button onClick={() => setCurrentPage('write-review')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reviews would be fetched from Supabase here */}
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Share your experience by writing a review.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  // Helper function to handle tab change and fetch data if needed
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'bookings' && bookings.length === 0) {
      if (user?.id) {
        // Fetch student ID first, then bookings
        supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single()
          .then(({ data: studentData }) => {
            if (studentData) {
              fetchBookings(studentData.id);
            }
          });
      }
    } else if (tab === 'wishlist' && wishlist.length === 0) {
      if (user?.id) {
        fetchWishlist(user.id);
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `Welcome back, ${user?.name?.split(' ')[0] || 'Student'}! Here's your accommodation overview.`}
          </p>
        </div>
        <Button onClick={() => setCurrentPage('hostels')}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Hostel
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'reviews', label: 'Reviews', icon: Star }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
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
      {activeTab === 'wishlist' && renderWishlist()}
      {activeTab === 'reviews' && renderReviews()}
    </div>
  );
};

export default StudentDashboard;