import React, { useState, useEffect } from 'react';
import { Building, Calendar, DollarSign, TrendingUp, Eye, Check, X, Plus, Edit, Users, Star, BarChart3, AlertCircle, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import AddEditHostelPage from '../pages/AddEditHostelPage';

interface LandlordDashboardProps {
  initialActiveTab?: string;
}

const LandlordDashboard: React.FC<LandlordDashboardProps> = ({ initialActiveTab }) => {
  const { hostels, user, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | undefined>(undefined);

  // Update activeTab when initialActiveTab prop changes
  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  const stats = [
    { label: 'Properties Listed', value: 4, icon: Building, color: 'teal', trend: '+1 this month', change: '+25%' },
    { label: 'Active Bookings', value: 12, icon: Calendar, color: 'blue', trend: '3 new this week', change: '+15%' },
    { label: 'Pending Requests', value: 5, icon: Clock, color: 'orange', trend: '2 urgent', change: '+5%' },
    { label: 'Monthly Revenue', value: 'Ksh 480K', icon: DollarSign, color: 'green', trend: '+Ksh 50K vs last month', change: '+12%' }
  ];

  const bookingRequests = [
    { id: 1, hostel: 'Umoja Hostels', student: 'John Mwangi', email: 'john@example.com', date: '10 Jul 2023', duration: '4 months', amount: 60000, status: 'pending', roomType: 'Single Room', checkIn: '2024-02-01' },
    { id: 2, hostel: 'Prestige Hostels', student: 'Sarah Kamau', email: 'sarah@example.com', date: '8 Jul 2023', duration: '6 months', amount: 108000, status: 'pending', roomType: 'Deluxe Room', checkIn: '2024-02-15' },
    { id: 3, hostel: 'Greenview Apartments', student: 'Mike Omondi', email: 'mike@example.com', date: '5 Jul 2023', duration: '5 months', amount: 90000, status: 'pending', roomType: 'Studio', checkIn: '2024-03-01' }
  ];

  const myProperties = [
    { id: '1', name: 'Umoja Hostels', location: 'Near University of Nairobi', price: 15000, rooms: 20, occupied: 17, rating: 4.7, revenue: 255000, status: 'active', verificationStatus: 'verified', assignedAgentId: 'agent_001' },
    { id: '2', name: 'Prestige Hostels', location: 'Near Mount Kenya University', price: 18000, rooms: 15, occupied: 12, rating: 4.8, revenue: 216000, status: 'active', verificationStatus: 'verified', assignedAgentId: 'agent_002' },
    { id: '3', name: 'Kilele Hostels', location: 'Near Kenyatta University', price: 12000, rooms: 25, occupied: 20, rating: 4.5, revenue: 240000, status: 'active', verificationStatus: 'pending_review', assignedAgentId: 'agent_001' },
    { id: '4', name: 'Greenview Apartments', location: 'Near JKUAT', price: 20000, rooms: 10, occupied: 8, rating: 4.6, revenue: 160000, status: 'pending', verificationStatus: 'pending_submission', assignedAgentId: undefined }
  ];

  // Mock agent names for display purposes
  const mockAgents: Record<string, string> = {
    'agent_001': 'Brian Kiprotich',
    'agent_002': 'Grace Akinyi',
    'agent_003': 'Michael Omondi',
    'agent_004': 'Sarah Wanjiku'
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
        const agentName = assignedAgentId ? mockAgents[assignedAgentId] || 'Unknown Agent' : 'Unassigned';
        return {
          text: `Assigned to Agent: ${agentName}`,
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

  const revenueData = [
    { month: 'Jan', revenue: 420000, bookings: 18 },
    { month: 'Feb', revenue: 380000, bookings: 16 },
    { month: 'Mar', revenue: 450000, bookings: 20 },
    { month: 'Apr', revenue: 480000, bookings: 22 },
    { month: 'May', revenue: 520000, bookings: 24 },
    { month: 'Jun', revenue: 480000, bookings: 21 }
  ];

  const recentActivity = [
    { id: '1', type: 'booking', title: 'New Booking Request', description: 'John Mwangi requested Umoja Hostels', time: '10 minutes ago', status: 'pending' },
    { id: '2', type: 'payment', title: 'Payment Received', description: 'Ksh 15,000 from Sarah Kamau', time: '2 hours ago', status: 'success' },
    { id: '3', type: 'review', title: 'New Review', description: '5-star review for Prestige Hostels', time: '1 day ago', status: 'info' },
    { id: '4', type: 'maintenance', title: 'Maintenance Request', description: 'Room 205 - Plumbing issue reported', time: '2 days ago', status: 'warning' }
  ];

  const handleApproveBooking = (bookingId: number) => {
    console.log('Approving booking:', bookingId);
    // Implementation for approving booking
  };

  const handleRejectBooking = (bookingId: number) => {
    console.log('Rejecting booking:', bookingId);
    // Implementation for rejecting booking
  };

  const handleAddProperty = () => {
    setEditingPropertyId(undefined);
    setShowAddEditForm(true);
  };

  const handleEditProperty = (propertyId: string) => {
    setEditingPropertyId(propertyId);
    setShowAddEditForm(true);
  };

  const handleCloseForm = () => {
    setShowAddEditForm(false);
    setEditingPropertyId(undefined);
  };

  const getOccupancyRate = (occupied: number, total: number) => {
    return Math.round((occupied / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
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
          <Button 
            className="flex flex-col items-center p-3 md:p-4 h-auto"
            onClick={() => setCurrentPage('add-edit-hostel')}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
            <span className="text-xs sm:text-sm">Add Property</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
            <span className="text-xs sm:text-sm">View Bookings</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
            <span className="text-xs sm:text-sm">Analytics</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-3 md:p-4 h-auto">
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
        
        <div className="space-y-4">
          {revenueData.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24 sm:w-32 lg:w-48">
                  <div 
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
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

      {/* Recent Activity */}
      <Card className="p-4 md:p-5">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
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
      </Card>
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
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {bookingRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{request.student}</h4>
                    <p className="text-xs text-gray-600">{request.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">{request.date}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Hostel:</span>
                    <p className="font-medium text-gray-900 truncate">{request.hostel}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Room:</span>
                    <p className="font-medium text-gray-900">{request.roomType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium text-gray-900">{request.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Check-in:</span>
                    <p className="font-medium text-gray-900">{request.checkIn}</p>
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
                      <div className="text-sm font-medium text-gray-900">{request.student}</div>
                      <div className="text-xs text-gray-500">{request.email}</div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-900">{request.hostel}</td>
                  <td className="py-4 text-sm text-gray-600">{request.roomType}</td>
                  <td className="py-4 text-sm text-gray-600">{request.duration}</td>
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

        {/* Empty State */}
        {bookingRequests.length === 0 && (
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {myProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="h-32 sm:h-40 md:h-48 bg-gray-200 bg-cover bg-center"></div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{property.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{property.location}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              
              {/* Verification Status */}
              <div className="mb-3">
                {(() => {
                  const verificationDisplay = getVerificationStatusDisplay(property.verificationStatus, property.assignedAgentId);
                  const IconComponent = verificationDisplay.icon;
                  return (
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${verificationDisplay.color}`}>
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs font-medium">{verificationDisplay.text}</span>
                    </div>
                  );
                })()}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">Ksh {property.price.toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Occupancy:</span>
                  <span className="font-medium">{property.occupied}/{property.rooms} ({getOccupancyRate(property.occupied, property.rooms)}%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Revenue:</span>
                  <span className="font-medium text-green-600">Ksh {property.revenue.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => {
                    setCurrentPage('add-edit-hostel');
                  }}
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Property Card */}
      <Card className="p-6 md:p-8 text-center border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors cursor-pointer">
        <Plus className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Add New Property</h3>
        <p className="text-gray-600 mb-6">List a new hostel to start receiving bookings.</p>
        <Button onClick={() => setCurrentPage('add-edit-hostel')}>
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
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-teal-600 mb-1 sm:mb-2">85%</div>
          <div className="text-xs sm:text-sm text-gray-600">Average Occupancy</div>
        </Card>
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">4.7</div>
          <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
        </Card>
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600 mb-1 sm:mb-2">12%</div>
          <div className="text-xs sm:text-sm text-gray-600">Revenue Growth</div>
        </Card>
        <Card className="p-4 md:p-5 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">2.3</div>
          <div className="text-xs sm:text-sm text-gray-600">Days Avg Response</div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="p-4 md:p-5">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Property Performance</h2>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {myProperties.map((property) => (
            <Card key={property.id} className="p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{property.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{property.location}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-medium">{property.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-teal-600">{getOccupancyRate(property.occupied, property.rooms)}%</div>
                    <div className="text-xs text-gray-600">Occupancy</div>
                    <div className="text-xs text-gray-500 mt-1">{property.occupied}/{property.rooms} rooms</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      {property.revenue >= 1000000 
                        ? `${(property.revenue / 1000000).toFixed(1)}M`
                        : `${(property.revenue / 1000).toFixed(0)}K`
                      }
                    </div>
                    <div className="text-xs text-gray-600">Revenue</div>
                    <div className="text-xs text-gray-500 mt-1">Ksh {property.revenue.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">{property.occupied}</span> active bookings
                  </div>
                  <Button variant="outline" size="sm" className="text-xs px-3 py-1">
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
                <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[80px]">Occupancy</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[100px]">Revenue</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[70px]">Rating</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 min-w-[70px]">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {myProperties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100">
                  <td className="py-4 text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="py-4 text-sm text-gray-600">{getOccupancyRate(property.occupied, property.rooms)}%</td>
                  <td className="py-4 text-sm text-gray-900">Ksh {property.revenue.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">{property.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{property.occupied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {myProperties.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600 mb-4">Add properties to see performance analytics.</p>
            <Button onClick={handleAddProperty}>
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
      {/* Show Add/Edit Form */}
      {showAddEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <AddEditHostelPage 
                hostelId={editingPropertyId}
                onBack={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name?.split(' ')[0]}! Manage your properties efficiently.</p>
        </div>
        <Button onClick={handleAddProperty}>
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