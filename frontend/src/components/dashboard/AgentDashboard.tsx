import React from 'react';
import { CheckCircle, Clock, Users, TrendingUp, FileText, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AgentDashboard: React.FC = () => {
  const stats = [
    { label: 'Pending Verifications', value: 8, icon: Clock, color: 'orange' },
    { label: 'Verified Properties', value: 24, icon: CheckCircle, color: 'green' },
    { label: 'Landlords Managed', value: 18, icon: Users, color: 'blue' },
    { label: 'Verification Rate', value: '92%', icon: TrendingUp, color: 'purple' }
  ];

  const verificationQueue = [
    { id: 1, hostel: 'Kilele Hostels', landlord: 'James Omondi', submitted: '12 Jul 2023', documents: 3, status: 'pending' },
    { id: 2, hostel: 'Sunset View', landlord: 'Mary Wanjiku', submitted: '10 Jul 2023', documents: 4, status: 'pending' },
    { id: 3, hostel: 'Haven Residences', landlord: 'Robert Mutua', submitted: '8 Jul 2023', documents: 2, status: 'pending' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">Verify properties and manage landlord relationships.</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Verification
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

      {/* Verification Queue */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Verification Queue</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Hostel</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Landlord</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Submitted</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Documents</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verificationQueue.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-900">{item.hostel}</td>
                  <td className="py-4 text-sm text-gray-900">{item.landlord}</td>
                  <td className="py-4 text-sm text-gray-600">{item.submitted}</td>
                  <td className="py-4 text-sm text-gray-600">{item.documents} Files</td>
                  <td className="py-4">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <Button size="sm" className="px-3 py-1">
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
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recently Verified</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Verified Hostel {index}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  Verified: {index + 2} Jul 2023
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Rating: 4.{index + 4}</span>
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold">12 Properties</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Time</span>
              <span className="font-semibold">2.5 Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">Review Sunset View documents</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Site visit to Haven Residences</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Update verification criteria</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;