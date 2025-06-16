import React from 'react';
import { Calendar, Heart, Bell, Star, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const StudentDashboard: React.FC = () => {
  const { bookings, hostels, notifications } = useApp();

  const stats = [
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'purple' },
    { label: 'Wishlisted', value: 5, icon: Heart, color: 'red' },
    { label: 'Notifications', value: notifications.filter(n => !n.read).length, icon: Bell, color: 'orange' },
    { label: 'Average Rating', value: '4.7', icon: Star, color: 'yellow' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your bookings.</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Book Hostel
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

      {/* Upcoming Bookings */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="space-y-4">
          {bookings.slice(0, 2).map((booking) => {
            const hostel = hostels.find(h => h.id === booking.hostelId);
            return (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{hostel?.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hostel?.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    Ksh {booking.amount.toLocaleString()}
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recently Viewed */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recently Viewed Hostels</h2>
          <Button variant="outline">View All</Button>
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
                <div className="text-purple-600 font-semibold mb-2">
                  Ksh {hostel.price.toLocaleString()}/month
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {hostel.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                    {hostel.rating}
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3 text-sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              Booking confirmed for Umoja Hostels - 2 hours ago
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              Added Prestige Hostels to wishlist - 1 day ago
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              Payment reminder sent - 2 days ago
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;