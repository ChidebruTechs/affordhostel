import React from 'react';
import { Building, Calendar, DollarSign, TrendingUp, Eye, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const LandlordDashboard: React.FC = () => {
  const { hostels } = useApp();

  const stats = [
    { label: 'Properties Listed', value: 4, icon: Building, color: 'teal' },
    { label: 'Active Bookings', value: 12, icon: Calendar, color: 'blue' },
    { label: 'Pending Requests', value: 5, icon: TrendingUp, color: 'orange' },
    { label: 'Total Revenue', value: 'Ksh 480K', icon: DollarSign, color: 'green' }
  ];

  const bookingRequests = [
    { id: 1, hostel: 'Umoja Hostels', student: 'John Mwangi', date: '10 Jul 2023', duration: '4 months', amount: 60000, status: 'pending' },
    { id: 2, hostel: 'Prestige Hostels', student: 'Sarah Kamau', date: '8 Jul 2023', duration: '6 months', amount: 108000, status: 'pending' },
    { id: 3, hostel: 'Greenview Apartments', student: 'Mike Omondi', date: '5 Jul 2023', duration: '5 months', amount: 90000, status: 'pending' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your properties and bookings efficiently.</p>
        </div>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Requests */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Booking Requests</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Hostel</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Student</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Duration</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-900">{request.hostel}</td>
                  <td className="py-4 text-sm text-gray-900">{request.student}</td>
                  <td className="py-4 text-sm text-gray-600">{request.date}</td>
                  <td className="py-4 text-sm text-gray-600">{request.duration}</td>
                  <td className="py-4 text-sm font-medium text-gray-900">
                    Ksh {request.amount.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <Button size="sm" className="px-3 py-1">
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="px-3 py-1">
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
      </Card>

      {/* My Properties */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
          <Button variant="outline">Manage All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.slice(0, 3).map((hostel) => (
            <div key={hostel.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <div 
                className="h-32 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${hostel.images[0]})` }}
              ></div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{hostel.name}</h3>
                <div className="text-teal-600 font-semibold mb-2">
                  Ksh {hostel.price.toLocaleString()}/month
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>8 Rooms</span>
                  <span>85% Occupied</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {hostel.amenities.slice(0, 2).map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue Chart Placeholder */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Revenue chart will be displayed here</p>
        </div>
      </Card>
    </div>
  );
};

export default LandlordDashboard;