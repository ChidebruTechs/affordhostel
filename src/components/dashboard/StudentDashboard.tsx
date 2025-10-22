import React, { useState } from 'react';
import { Calendar, Heart, Bell, Star, MapPin, Clock, CreditCard, Download, Filter, Search, Eye, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const StudentDashboard: React.FC = () => {
  const { bookings, hostels, notifications, wishlist, user, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'purple', trend: '+2 this month' },
    { label: 'Wishlisted', value: wishlist.length, icon: Heart, color: 'red', trend: '+3 this week' },
    { label: 'Unread Notifications', value: notifications.filter(n => !n.read).length, icon: Bell, color: 'orange', trend: '5 new today' },
    { label: 'Reviews Written', value: 8, icon: Star, color: 'yellow', trend: '2 pending' }
  ];

  const upcomingPayments = [
    { id: '1', hostel: 'Umoja Hostels', amount: 15000, dueDate: '2024-02-15', status: 'due' },
    { id: '2', hostel: 'Prestige Hostels', amount: 18000, dueDate: '2024-02-20', status: 'upcoming' },
    { id: '3', hostel: 'Kilele Hostels', amount: 12000, dueDate: '2024-03-01', status: 'upcoming' }
  ];

  const recentActivity = [
    { id: '1', type: 'booking', title: 'Booking Confirmed', description: 'Your booking at Umoja Hostels has been confirmed', time: '2 hours ago', status: 'success' },
    { id: '2', type: 'payment', title: 'Payment Processed', description: 'Payment of Ksh 15,000 processed successfully', time: '1 day ago', status: 'success' },
    { id: '3', type: 'review', title: 'Review Submitted', description: 'Your review for Kilele Hostels has been published', time: '3 days ago', status: 'info' },
    { id: '4', type: 'wishlist', title: 'Added to Wishlist', description: 'Prestige Hostels added to your wishlist', time: '1 week ago', status: 'info' }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const hostel = hostels.find(h => h.id === booking.hostelId);
    const matchesSearch = !searchTerm || hostel?.name.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stat.trend}</p>
              </div>
              <div className={`p-2 md:p-3 rounded-full bg-${stat.color}-100 flex-shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-4 md:p-5">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={() => setCurrentPage('hostels')} className="flex flex-col items-center p-3 md:p-4 h-auto">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
            <span className="text-xs sm:text-sm">Browse Hostels</span>
          </Button>
          <Button onClick={() => setCurrentPage('bookings')} variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
            <span className="text-xs sm:text-sm">My Bookings</span>
          </Button>
          <Button onClick={() => setCurrentPage('wishlist')} variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
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
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="space-y-3">
          {upcomingPayments.map((payment) => (
            <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">{payment.hostel}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
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
      </Card>

      {/* Recent Activity */}
      <Card className="p-4 md:p-5">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
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
      </Card>
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
      <div className="space-y-3">
        {filteredBookings.map((booking) => {
          const hostel = hostels.find(h => h.id === booking.hostelId);
          return (
            <Card key={booking.id} className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{hostel?.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-xs sm:text-sm mt-1 gap-1 sm:gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {hostel?.location}
                      </div>
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
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm">
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
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {wishlist.map((item) => {
          const hostel = hostels.find(h => h.id === item.hostelId);
          if (!hostel) return null;
          
          return (
            <Card key={item.id} hover className="overflow-hidden">
              <div 
                className="h-32 sm:h-40 md:h-48 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${hostel.images[0]})` }}
              ></div>
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{hostel.name}</h3>
                <div className="text-purple-600 font-semibold mb-2">Ksh {hostel.price.toLocaleString()}/month</div>
                <p className="text-gray-600 mb-4 text-sm">{hostel.location}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button className="flex-1 text-sm" onClick={() => setCurrentPage('hostel-detail')}>Book Now</Button>
                  <Button variant="outline" className="flex-1 text-sm">Remove</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {wishlist.length === 0 && (
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
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div>
                  <h4 className="font-medium text-gray-900">Hostel Name {index}</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">4.0</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 weeks ago</span>
              </div>
              <p className="text-gray-700 text-sm">Great hostel with excellent facilities and friendly staff. Would definitely recommend to other students.</p>
              <div className="flex items-center mt-3 space-x-4">
                <button className="text-sm text-gray-500 hover:text-gray-700">12 helpful</button>
                <button className="text-sm text-purple-600 hover:text-purple-700">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name?.split(' ')[0]}! Here's your accommodation overview.</p>
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
              onClick={() => setActiveTab(tab.id)}
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