import React from 'react';
import { Users, Building, DollarSign, BarChart3, Edit, Trash2, Ban, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'blue' },
    { label: 'Listed Hostels', value: '324', icon: Building, color: 'green' },
    { label: 'Total Revenue', value: 'Ksh 4.8M', icon: DollarSign, color: 'purple' },
    { label: 'Occupancy Rate', value: '78%', icon: BarChart3, color: 'orange' }
  ];

  const recentActivity = [
    { user: 'Sarah Kamau', action: 'New Booking', details: 'Umoja Hostels - Ksh 60,000', time: '10 minutes ago' },
    { user: 'James Omondi', action: 'Hostel Added', details: 'Sunset View Hostels', time: '2 hours ago' },
    { user: 'Agent Brian', action: 'Hostel Verified', details: 'Kilele Hostels', time: '5 hours ago' },
    { user: 'John Mwangi', action: 'Account Created', details: 'Student', time: 'Yesterday' }
  ];

  const users = [
    { name: 'Sarah Kamau', email: 'sarah@example.com', role: 'Student', status: 'Active', joined: '15 Jun 2023' },
    { name: 'James Omondi', email: 'james@example.com', role: 'Landlord', status: 'Pending', joined: '10 Jul 2023' },
    { name: 'Agent Brian', email: 'brian@example.com', role: 'Agent', status: 'Active', joined: '5 May 2023' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Oversee platform operations and user management.</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add User
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

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Action</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Details</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-900">{activity.user}</td>
                  <td className="py-4 text-sm text-gray-900">{activity.action}</td>
                  <td className="py-4 text-sm text-gray-600">{activity.details}</td>
                  <td className="py-4 text-sm text-gray-600">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Management */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <Button variant="outline">View All Users</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Joined</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 text-sm text-gray-900">{user.role}</td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{user.joined}</td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <Ban className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Users (This Month)</span>
              <span className="font-semibold text-green-600">+127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Hostels Listed</span>
              <span className="font-semibold text-blue-600">+23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold text-purple-600">+189</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Time</span>
              <span className="font-semibold">245ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-semibold text-green-600">0.02%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;