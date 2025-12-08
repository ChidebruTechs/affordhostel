import React, { useState } from 'react';
import { CheckCircle, Clock, Users, TrendingUp, FileText, Eye, AlertTriangle, MapPin, Calendar, Star, Building, Search, Filter, ClipboardCheck, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import VerificationForm from '../forms/VerificationForm';

const AgentDashboard: React.FC = () => {
  const { user, hostels } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);

  // Mock current agent ID - in a real app, this would come from user context
  const currentAgentId = 'agent_001';

  // Get assigned properties for this agent
  const assignedProperties = hostels.filter(hostel => 
    hostel.verificationStatus === 'pending_review' && 
    hostel.assignedAgentId === currentAgentId
  );

  // Get completed verifications for this agent
  const completedVerifications = hostels.filter(hostel => 
    hostel.verificationStatus === 'verified' && 
    hostel.assignedAgentId === currentAgentId
  );

  const stats = [
    { label: 'Assigned Verifications', value: assignedProperties.length, icon: Clock, color: 'orange', trend: `${assignedProperties.length} pending`, change: '+2' },
    { label: 'Completed Verifications', value: completedVerifications.length, icon: CheckCircle, color: 'green', trend: '4 this week', change: '+20%' },
    { label: 'Landlords Managed', value: 18, icon: Users, color: 'blue', trend: '2 new this month', change: '+12%' },
    { label: 'Verification Rate', value: '92%', icon: TrendingUp, color: 'purple', trend: '+3% this month', change: '+3%' }
  ];

  const verificationQueue = [
    { 
      id: 1, 
      hostel: 'Kilele Hostels', 
      landlord: 'James Omondi', 
      email: 'james@example.com',
      submitted: '12 Jul 2023', 
      documents: 3, 
      status: 'pending',
      priority: 'high',
      location: 'Kenyatta University',
      price: 12000,
      rooms: 25
    },
    { 
      id: 2, 
      hostel: 'Sunset View', 
      landlord: 'Mary Wanjiku', 
      email: 'mary@example.com',
      submitted: '10 Jul 2023', 
      documents: 4, 
      status: 'pending',
      priority: 'medium',
      location: 'University of Nairobi',
      price: 16000,
      rooms: 20
    },
    { 
      id: 3, 
      hostel: 'Haven Residences', 
      landlord: 'Robert Mutua', 
      email: 'robert@example.com',
      submitted: '8 Jul 2023', 
      documents: 2, 
      status: 'pending',
      priority: 'low',
      location: 'JKUAT',
      price: 14000,
      rooms: 15
    }
  ];

  const recentlyVerified = [
    { id: '1', name: 'Campus Lodge', landlord: 'Alice Wanjiru', verifiedDate: '5 Jul 2023', rating: 4.6, location: 'Strathmore University', status: 'approved' },
    { id: '2', name: 'Student Haven', landlord: 'Peter Kimani', verifiedDate: '3 Jul 2023', rating: 4.4, location: 'Mount Kenya University', status: 'approved' },
    { id: '3', name: 'Unity Hostels', landlord: 'Grace Muthoni', verifiedDate: '1 Jul 2023', rating: 4.7, location: 'Daystar University', status: 'approved' }
  ];

  const managedLandlords = [
    { id: '1', name: 'James Omondi', email: 'james@example.com', properties: 3, totalRooms: 65, joinDate: '2023-01-15', status: 'active', revenue: 195000 },
    { id: '2', name: 'Mary Wanjiku', email: 'mary@example.com', properties: 2, totalRooms: 40, joinDate: '2023-02-20', status: 'active', revenue: 160000 },
    { id: '3', name: 'Robert Mutua', email: 'robert@example.com', properties: 1, totalRooms: 15, joinDate: '2023-03-10', status: 'pending', revenue: 84000 }
  ];

  const verificationTasks = [
    { id: '1', type: 'document_review', title: 'Review Business License', property: 'Kilele Hostels', priority: 'high', dueDate: '2024-01-20' },
    { id: '2', type: 'site_visit', title: 'Site Inspection Required', property: 'Sunset View', priority: 'medium', dueDate: '2024-01-22' },
    { id: '3', type: 'compliance_check', title: 'Safety Compliance Check', property: 'Haven Residences', priority: 'low', dueDate: '2024-01-25' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartVerification = (hostelId: string) => {
    setSelectedHostelId(hostelId);
    setShowVerificationForm(true);
  };

  const handleCloseVerificationForm = () => {
    setShowVerificationForm(false);
    setSelectedHostelId(null);
  };

  const renderOverview = () => (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-2 sm:p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 leading-tight">{stat.label}</p>
                <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 hidden md:block leading-tight">{stat.trend}</p>
              </div>
              <div className={`p-1.5 sm:p-2 md:p-3 rounded-full bg-${stat.color}-100 flex-shrink-0`}>
                <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <Button className="flex flex-col items-center p-2 sm:p-3 md:p-4 h-auto min-h-[60px] sm:min-h-[70px]">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2" />
            <span className="text-xs text-center leading-tight">New Verification</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-2 sm:p-3 md:p-4 h-auto min-h-[60px] sm:min-h-[70px]"
            onClick={() => setActiveTab('assigned')}
          >
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2" />
            <span className="text-xs text-center leading-tight">Assigned Properties</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-2 sm:p-3 md:p-4 h-auto min-h-[60px] sm:min-h-[70px]">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2" />
            <span className="text-xs text-center leading-tight">Manage Landlords</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-2 sm:p-3 md:p-4 h-auto min-h-[60px] sm:min-h-[70px]">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2" />
            <span className="text-xs text-center leading-tight">Reports</span>
          </Button>
        </div>
      </Card>

      {/* Urgent Tasks */}
      <Card className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Urgent Tasks</h2>
        <div className="space-y-2 sm:space-y-3">
          {verificationTasks.filter(task => task.priority === 'high').map((task) => (
            <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg gap-2 sm:gap-3">
              <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight">{task.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{task.property} • Due: {task.dueDate}</p>
                </div>
              </div>
              <Button size="sm" className="text-xs whitespace-nowrap w-full sm:w-auto">Review</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Verification Stats</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-semibold">12 Properties</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Average Time</span>
              <span className="text-sm font-semibold">2.5 Days</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-semibold text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Pending Reviews</span>
              <span className="text-sm font-semibold text-orange-600">8</span>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Upcoming Tasks</h2>
          <div className="space-y-2 sm:space-y-3">
            {verificationTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-2 sm:space-x-3 py-1">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                } mt-1.5`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 leading-tight">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{task.property} • {task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAssignedProperties = () => (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Assigned Properties</h2>
          <p className="text-sm text-gray-600 mt-1">{assignedProperties.length} properties awaiting verification</p>
        </div>
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 md:w-64 text-sm"
          />
        </div>
      </div>

      {/* Assigned Properties Grid */}
      {assignedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {assignedProperties
            .filter(hostel => 
              !searchTerm || 
              hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              hostel.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((hostel) => (
              <Card key={hostel.id} className="overflow-hidden">
                <div 
                  className="h-28 sm:h-32 md:h-40 lg:h-48 bg-gray-200 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${hostel.images[0]})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative h-full flex items-end p-2 sm:p-3">
                    <div className="bg-white bg-opacity-95 rounded px-2 py-1">
                      <span className="text-xs font-medium text-gray-900 leading-tight">Pending Review</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight">{hostel.name}</h3>
                      <div className="flex items-center text-gray-600 text-xs mt-1">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{hostel.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-purple-600">
                        Ksh {hostel.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">University:</span>
                      <span className="font-medium text-right truncate ml-1 max-w-[60%]">{hostel.university}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Room Types:</span>
                      <span className="font-medium">{hostel.roomTypes.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Amenities:</span>
                      <span className="font-medium">{hostel.amenities.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hostel.amenities.slice(0, 2).map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full leading-tight"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hostel.amenities.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full leading-tight">
                        +{hostel.amenities.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full text-xs"
                    onClick={() => handleStartVerification(hostel.id)}
                  >
                    <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Start Verification
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <Card className="p-4 sm:p-6 md:p-8 text-center">
          <ClipboardCheck className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">No Assigned Properties</h3>
          <p className="text-sm text-gray-600 mb-4 sm:mb-6">
            You don't have any properties assigned for verification at the moment.
          </p>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View All Properties
          </Button>
        </Card>
      )}
    </div>
  );

  const renderVerifications = () => (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Verification Queue */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Verification Queue</h2>
          <Button className="w-full sm:w-auto text-sm">
            <FileText className="h-4 w-4 mr-2" />
            New Verification
          </Button>
        </div>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-2 sm:space-y-3">
          {verificationQueue.map((item) => (
            <Card key={item.id} className="p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">{item.hostel}</h4>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{item.location}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Landlord:</span>
                    <p className="font-medium leading-tight truncate">{item.landlord}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Price:</span>
                    <p className="font-medium leading-tight">Ksh {item.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Rooms:</span>
                    <p className="font-medium leading-tight">{item.rooms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Documents:</span>
                    <p className="font-medium leading-tight">{item.documents} Files</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-gray-100 gap-2">
                  <span className="text-xs text-gray-500 leading-tight">Submitted: {item.submitted}</span>
                  <Button size="sm" className="text-xs w-full sm:w-auto">
                    <Eye className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Property</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Landlord</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Priority</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Documents</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Submitted</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verificationQueue.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.hostel}</div>
                      <div className="text-xs text-gray-500">Ksh {item.price.toLocaleString()}/month • {item.rooms} rooms</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-sm text-gray-900">{item.landlord}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{item.location}</td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{item.documents} Files</td>
                  <td className="py-4 text-sm text-gray-600">{item.submitted}</td>
                  <td className="py-4">
                    <Button size="sm" className="px-3 py-1 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recently Verified */}
      <Card className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Recently Verified</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {recentlyVerified.map((property) => (
            <div key={property.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-20 sm:h-24 md:h-32 bg-gray-200"></div>
              <div className="p-3">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate flex-1">{property.name}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${getStatusColor(property.status)}`}>
                    Verified
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 truncate">{property.location}</p>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2 sm:mb-3">
                  <span className="truncate flex-1 pr-2">By: {property.landlord}</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span>{property.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2 sm:mb-3">
                  Verified: {property.verifiedDate}
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs py-1.5">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderLandlords = () => (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Landlords List */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Managed Landlords</h2>
            <p className="text-sm text-gray-600 mt-1">{managedLandlords.length} landlords</p>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Export</Button>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-2 sm:space-y-3">
          {managedLandlords.map((landlord) => (
            <Card key={landlord.id} className="p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">{landlord.name}</h4>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{landlord.email}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${getStatusColor(landlord.status)}`}>
                    {landlord.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Properties:</span>
                    <p className="font-medium leading-tight">{landlord.properties}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total Rooms:</span>
                    <p className="font-medium leading-tight">{landlord.totalRooms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Revenue:</span>
                    <p className="font-medium text-green-600 leading-tight">Ksh {landlord.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Joined:</span>
                    <p className="font-medium leading-tight">{landlord.joinDate}</p>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="flex-1 text-xs py-1.5">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1 text-xs py-1.5">
                    Contact
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
                <th className="text-left py-3 text-sm font-medium text-gray-600">Landlord</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Properties</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Total Rooms</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Monthly Revenue</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Join Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managedLandlords.map((landlord) => (
                <tr key={landlord.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{landlord.name}</div>
                      <div className="text-xs text-gray-500">{landlord.email}</div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-900">{landlord.properties}</td>
                  <td className="py-4 text-sm text-gray-600">{landlord.totalRooms}</td>
                  <td className="py-4 text-sm font-medium text-green-600">
                    Ksh {landlord.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 text-sm text-gray-600">{landlord.joinDate}</td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(landlord.status)}`}>
                      {landlord.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="px-3 py-1 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="px-3 py-1 text-xs">
                        Contact
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

  return (
    <>
      {/* Verification Form Modal */}
      {showVerificationForm && selectedHostelId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <VerificationForm 
              hostelId={selectedHostelId}
              onClose={handleCloseVerificationForm}
            />
          </div>
        </div>
      )}

      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">Welcome back, {user?.name?.split(' ')[0]}! Verify properties and manage landlord relationships.</p>
          </div>
          <Button onClick={() => setActiveTab('assigned')} className="w-full lg:w-auto text-sm">
            <FileText className="h-4 w-4 mr-2" />
            View Assigned Properties
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-4 lg:space-x-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'assigned', label: 'Assigned Properties', icon: ClipboardCheck },
              { id: 'verifications', label: 'All Verifications', icon: CheckCircle },
              { id: 'landlords', label: 'Landlords', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'assigned' && renderAssignedProperties()}
        {activeTab === 'verifications' && renderVerifications()}
        {activeTab === 'landlords' && renderLandlords()}
      </div>
    </>
  );
};

export default AgentDashboard;