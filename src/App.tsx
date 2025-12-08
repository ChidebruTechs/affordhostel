import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import HostelsPage from './components/pages/HostelsPage';
import HostelDetailPage from './components/pages/HostelDetailPage';
import ContactPage from './components/pages/ContactPage';
import AboutPage from './components/pages/AboutPage';
import SettingsPage from './components/pages/SettingsPage';
import ProfilePage from './components/pages/ProfilePage';
import StudentDashboard from './components/dashboard/StudentDashboard';
import LandlordDashboard from './components/dashboard/LandlordDashboard';
import AgentDashboard from './components/dashboard/AgentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AnalyticsPage from './components/pages/AnalyticsPage';
import DashboardNavbar from './components/layout/DashboardNavbar';
import AddEditHostelPage from './components/pages/AddEditHostelPage';
import HowToBookPage from './components/pages/HowToBookPage';
import StudentGuidePage from './components/pages/StudentGuidePage';
import PaymentOptionsPage from './components/pages/PaymentOptionsPage';
import SafetyTipsPage from './components/pages/SafetyTipsPage';
import ListPropertyPage from './components/pages/ListPropertyPage';
import LandlordGuidePage from './components/pages/LandlordGuidePage';
import VerificationProcessPage from './components/pages/VerificationProcessPage';
import PricingPlansPage from './components/pages/PricingPlansPage';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

const AppContent: React.FC = () => {
  const { currentPage, isAuthenticated, currentRole, logout, setCurrentPage, hostels, wishlist, user, notifications, markAllAsRead, markAsRead } = useApp();
  const [editingHostelId, setEditingHostelId] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const renderDashboard = (initialTab?: string) => {
    switch (currentRole) {
      case 'student':
        return <StudentDashboard />;
      case 'landlord':
        return <LandlordDashboard initialActiveTab={initialTab} />;
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
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'hostels':
        return <HostelsPage />;
      case 'hostel-detail':
        return <HostelDetailPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'dashboard':
        return renderDashboard();
      case 'properties':
        if (currentRole === 'landlord') {
          return renderDashboard('properties');
        }
        // For other roles, redirect to dashboard
        setCurrentPage('dashboard');
        return null;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'add-edit-hostel':
        return (
          <AddEditHostelPage 
            hostelId={editingHostelId}
            onBack={() => {
              setEditingHostelId(undefined);
              setCurrentPage('dashboard');
            }}
          />
        );
      case 'how-to-book':
        return <HowToBookPage />;
      case 'student-guide':
        return <StudentGuidePage />;
      case 'payment-options':
        return <PaymentOptionsPage />;
      case 'safety-tips':
        return <SafetyTipsPage />;
      case 'list-property':
        return <ListPropertyPage />;
      case 'landlord-guide':
        return <LandlordGuidePage />;
      case 'verification':
        return <VerificationProcessPage />;
      case 'pricing':
        return <PricingPlansPage />;
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <Button variant="outline" onClick={markAllAsRead}>Mark All Read</Button>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const getNotificationColor = (type: string) => {
                    switch (type) {
                      case 'success': return 'bg-green-50 border-green-400';
                      case 'warning': return 'bg-yellow-50 border-yellow-400';
                      case 'error': return 'bg-red-50 border-red-400';
                      default: return 'bg-blue-50 border-blue-400';
                    }
                  };

                  const getDotColor = (type: string) => {
                    switch (type) {
                      case 'success': return 'bg-green-500';
                      case 'warning': return 'bg-yellow-500';
                      case 'error': return 'bg-red-500';
                      default: return 'bg-blue-500';
                    }
                  };

                  const getActionLabel = (notification: any) => {
                    if (notification.title.includes('Payment')) return 'Pay Now';
                    if (notification.title.includes('Booking')) return 'View Booking';
                    if (notification.title.includes('Hostel')) return 'View Hostels';
                    return 'View';
                  };

                  const formatTimeAgo = (date: Date) => {
                    const now = new Date();
                    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
                    
                    if (diffInHours < 1) return 'Just now';
                    if (diffInHours < 24) return `${diffInHours} hours ago`;
                    const diffInDays = Math.floor(diffInHours / 24);
                    return `${diffInDays} days ago`;
                  };

                  return (
                    <div 
                      key={notification.id} 
                      className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                        notification.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${getDotColor(notification.type)} ${
                        notification.read ? 'opacity-50' : ''
                      }`}></div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-gray-900 ${notification.read ? 'opacity-70' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-gray-600 ${notification.read ? 'opacity-70' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          markAsRead(notification.id);
                          setCurrentPage(notification.action_url || 'dashboard');
                        }}
                      >
                        {getActionLabel(notification)}
                      </Button>
                    </div>
                  );
                })}
                
                {notifications.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No notifications yet</p>
                    <p className="text-gray-400 text-sm mt-2">You'll see important updates here</p>
                  </div>
                )}
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
              {wishlist.map((item) => {
                const hostel = hostels.find(h => h.id === item.hostelId);
                if (!hostel) return null;
                
                return (
                  <Card key={item.id} hover className="overflow-hidden">
                    <div 
                      className="h-48 bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url(${hostel.images[0]})` }}
                    ></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{hostel.name}</h3>
                      <div className="text-purple-600 font-semibold mb-2">Ksh {hostel.price.toLocaleString()}/month</div>
                      <p className="text-gray-600 mb-4">{hostel.location}</p>
                      <div className="flex space-x-2">
                        <Button className="flex-1" onClick={() => setCurrentPage('hostel-detail')}>Book Now</Button>
                        <Button variant="outline" onClick={() => {
                          removeFromWishlist(hostel.id);
                        }}>Remove</Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {wishlist.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                  <Button className="mt-4" onClick={() => setCurrentPage('hostels')}>
                    Browse Hostels
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  // Protected routes - redirect to dashboard if authenticated and accessing auth pages
  if (isAuthenticated && ['login', 'signup', 'forgot-password'].includes(currentPage)) {
    setCurrentPage('dashboard');
    return null;
  }

  if (isAuthenticated && ['dashboard', 'profile', 'settings', 'notifications', 'bookings', 'wishlist', 'analytics', 'properties'].includes(currentPage)) {
    return (
      <div className="flex min-h-screen bg-gray-50 pt-16 md:pt-0">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar 
            isOpen={isMobileSidebarOpen} 
            onClose={closeMobileSidebar}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <DashboardNavbar onToggleMobileSidebar={toggleMobileSidebar} />
          <div className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
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