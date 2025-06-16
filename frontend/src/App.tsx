import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import HostelsPage from './components/pages/HostelsPage';
import SettingsPage from './components/pages/SettingsPage';
import StudentDashboard from './components/dashboard/StudentDashboard';
import LandlordDashboard from './components/dashboard/LandlordDashboard';
import AgentDashboard from './components/dashboard/AgentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

const AppContent: React.FC = () => {
  const { currentPage, isAuthenticated, currentRole, logout, setCurrentPage } = useApp();

  const renderDashboard = () => {
    switch (currentRole) {
      case 'student':
        return <StudentDashboard />;
      case 'landlord':
        return <LandlordDashboard />;
      case 'agent':
        return <AgentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'hostels':
        return <HostelsPage />;
      case 'dashboard':
        return renderDashboard();
      case 'settings':
        return <SettingsPage />;
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <Button variant="outline">Mark All Read</Button>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Booking Confirmed</h3>
                    <p className="text-gray-600">Your booking at Umoja Hostels has been confirmed.</p>
                    <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Payment Reminder</h3>
                    <p className="text-gray-600">Your payment for Prestige Hostels is due in 3 days.</p>
                    <p className="text-sm text-gray-500 mt-1">1 day ago</p>
                  </div>
                  <Button variant="outline" size="sm">Pay Now</Button>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">New Hostel Available</h3>
                    <p className="text-gray-600">A new hostel near your university is now available.</p>
                    <p className="text-sm text-gray-500 mt-1">3 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <Button onClick={() => setCurrentPage('hostels')}>
                Book New Hostel
              </Button>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Umoja Hostels</h3>
                      <p className="text-gray-600">Single Room • 4 months</p>
                      <p className="text-sm text-gray-500">Aug 15 - Dec 15, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">Ksh 60,000</div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Prestige Hostels</h3>
                      <p className="text-gray-600">Deluxe Room • 4 months</p>
                      <p className="text-sm text-gray-500">Sep 1 - Dec 31, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">Ksh 72,000</div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'wishlist':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <Button variant="outline" onClick={() => setCurrentPage('hostels')}>
                Browse More Hostels
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <Card key={index} hover className="overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Wishlist Hostel {index}</h3>
                    <div className="text-purple-600 font-semibold mb-2">Ksh {15000 + index * 2000}/month</div>
                    <p className="text-gray-600 mb-4">Near University Campus</p>
                    <div className="flex space-x-2">
                      <Button className="flex-1">Book Now</Button>
                      <Button variant="outline">Remove</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  if (isAuthenticated && ['dashboard', 'settings', 'notifications', 'bookings', 'wishlist'].includes(currentPage)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {currentPage === 'dashboard' ? `${currentRole} Dashboard` : currentPage.replace('-', ' ')}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{currentRole}</span>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
          <div className="flex-1 p-8 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;