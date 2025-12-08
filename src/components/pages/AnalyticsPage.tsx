import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw,
  Eye,
  MapPin,
  Star,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalHostels: number;
    totalBookings: number;
    totalRevenue: number;
    userGrowth: number;
    hostelGrowth: number;
    bookingGrowth: number;
    revenueGrowth: number;
  };
  userStats: {
    students: number;
    landlords: number;
    agents: number;
    activeUsers: number;
  };
  bookingStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenueData: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  topHostels: {
    id: string;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
    location: string;
  }[];
  recentActivity: {
    id: string;
    type: 'booking' | 'user' | 'payment' | 'review';
    description: string;
    timestamp: Date;
    amount?: number;
  }[];
}

const AnalyticsPage: React.FC = () => {
  const { currentRole } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    overview: {
      totalUsers: 1248,
      totalHostels: 324,
      totalBookings: 892,
      totalRevenue: 4800000,
      userGrowth: 12.5,
      hostelGrowth: 8.3,
      bookingGrowth: 15.7,
      revenueGrowth: 23.4
    },
    userStats: {
      students: 1050,
      landlords: 156,
      agents: 32,
      activeUsers: 847
    },
    bookingStats: {
      pending: 45,
      confirmed: 234,
      completed: 567,
      cancelled: 46
    },
    revenueData: [
      { month: 'Jan', revenue: 320000, bookings: 67 },
      { month: 'Feb', revenue: 380000, bookings: 78 },
      { month: 'Mar', revenue: 420000, bookings: 89 },
      { month: 'Apr', revenue: 480000, bookings: 95 },
      { month: 'May', revenue: 520000, bookings: 102 },
      { month: 'Jun', revenue: 580000, bookings: 118 }
    ],
    topHostels: [
      { id: '1', name: 'Umoja Hostels', bookings: 89, revenue: 1340000, rating: 4.8, location: 'University of Nairobi' },
      { id: '2', name: 'Prestige Hostels', bookings: 76, revenue: 1368000, rating: 4.7, location: 'Mount Kenya University' },
      { id: '3', name: 'Kilele Hostels', bookings: 65, revenue: 780000, rating: 4.6, location: 'Kenyatta University' },
      { id: '4', name: 'Greenview Apartments', bookings: 54, revenue: 1080000, rating: 4.5, location: 'JKUAT' },
      { id: '5', name: 'Campus Lodge', bookings: 43, revenue: 645000, rating: 4.4, location: 'Strathmore University' }
    ],
    recentActivity: [
      { id: '1', type: 'booking', description: 'New booking at Umoja Hostels', timestamp: new Date(Date.now() - 300000), amount: 15000 },
      { id: '2', type: 'user', description: 'New student registered from University of Nairobi', timestamp: new Date(Date.now() - 600000) },
      { id: '3', type: 'payment', description: 'Payment received for Prestige Hostels', timestamp: new Date(Date.now() - 900000), amount: 18000 },
      { id: '4', type: 'review', description: 'New 5-star review for Kilele Hostels', timestamp: new Date(Date.now() - 1200000) },
      { id: '5', type: 'booking', description: 'Booking confirmed at Greenview Apartments', timestamp: new Date(Date.now() - 1800000), amount: 20000 }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value', 'Growth'],
      ['Total Users', analyticsData.overview.totalUsers, `${analyticsData.overview.userGrowth}%`],
      ['Total Hostels', analyticsData.overview.totalHostels, `${analyticsData.overview.hostelGrowth}%`],
      ['Total Bookings', analyticsData.overview.totalBookings, `${analyticsData.overview.bookingGrowth}%`],
      ['Total Revenue', `Ksh ${analyticsData.overview.totalRevenue.toLocaleString()}`, `${analyticsData.overview.revenueGrowth}%`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'user': return Users;
      case 'payment': return DollarSign;
      case 'review': return Star;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-green-600 bg-green-100';
      case 'payment': return 'text-purple-600 bg-purple-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into platform performance</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{analyticsData.overview.userGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Hostels</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalHostels}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{analyticsData.overview.hostelGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <Building className="h-8 w-8 text-teal-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalBookings}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{analyticsData.overview.bookingGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">Ksh {(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{analyticsData.overview.revenueGrowth}%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Monthly</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.revenueData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / 600000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Ksh {(data.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">{data.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User Distribution */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Distribution</h2>
            <PieChart className="h-5 w-5 text-teal-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Students</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">{analyticsData.userStats.students}</span>
                <p className="text-xs text-gray-500">{((analyticsData.userStats.students / analyticsData.overview.totalUsers) * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Landlords</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-teal-600">{analyticsData.userStats.landlords}</span>
                <p className="text-xs text-gray-500">{((analyticsData.userStats.landlords / analyticsData.overview.totalUsers) * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Agents</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-orange-600">{analyticsData.userStats.agents}</span>
                <p className="text-xs text-gray-500">{((analyticsData.userStats.agents / analyticsData.overview.totalUsers) * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users (30d)</span>
                <span className="text-sm font-semibold text-green-600">{analyticsData.userStats.activeUsers}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Booking Status and Top Hostels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Status</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analyticsData.bookingStats.pending}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.bookingStats.confirmed}</div>
              <div className="text-sm text-blue-700">Confirmed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analyticsData.bookingStats.completed}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analyticsData.bookingStats.cancelled}</div>
              <div className="text-sm text-red-700">Cancelled</div>
            </div>
          </div>
        </Card>

        {/* Top Performing Hostels */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Hostels</h2>
          
          <div className="space-y-3">
            {analyticsData.topHostels.map((hostel, index) => (
              <div key={hostel.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{hostel.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{hostel.location}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{hostel.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Ksh {(hostel.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500">{hostel.bookings} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <span className="text-sm font-semibold text-green-600">
                      +Ksh {activity.amount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;