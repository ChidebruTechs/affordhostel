import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HostelsPage from './pages/HostelsPage';
import HostelDetailPage from './pages/HostelDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import StudentDashboard from './components/dashboard/StudentDashboard';
import LandlordDashboard from './components/dashboard/LandlordDashboard';
import AgentDashboard from './components/dashboard/AgentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardNavbar from './components/layout/DashboardNavbar';
import AddEditHostelPage from './pages/AddEditHostelPage';
import HowToBookPage from './pages/HowToBookPage';
import StudentGuidePage from './pages/StudentGuidePage';
import PaymentOptionsPage from './pages/PaymentOptionsPage';
import SafetyTipsPage from './pages/SafetyTipsPage';
import ListPropertyPage from './pages/ListPropertyPage';
import LandlordGuidePage from './pages/LandlordGuidePage';
import VerificationProcessPage from './pages/VerificationProcessPage';
import PricingPlansPage from './pages/PricingPlansPage';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import { supabase } from '@lib/supabase';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = ['student', 'landlord', 'agent', 'admin'] 
}) => {
  const { isAuthenticated, currentRole } = useApp();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (!allowedRoles.includes(currentRole)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard Layout Component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

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
          {children}
        </div>
      </div>
    </div>
  );
};

// Public Layout Component
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Notifications Page Component
const NotificationsPage: React.FC = () => {
  const { notifications, markAllAsRead, markAsRead, setCurrentPage } = useApp();
  const navigate = useNavigate();

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

  const getActionLabel = (title: string) => {
    if (title.includes('Payment')) return 'Pay Now';
    if (title.includes('Booking')) return 'View Booking';
    if (title.includes('Hostel')) return 'View Hostels';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <Button variant="outline" onClick={markAllAsRead}>Mark All Read</Button>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
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
                  if (notification.action_url) {
                    navigate(notification.action_url);
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                {getActionLabel(notification.title)}
              </Button>
            </div>
          ))}
          
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
};

// Bookings Page Component
const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Button onClick={() => navigate('/hostels')}>
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
};

// Wishlist Page Component
const WishlistPage: React.FC = () => {
  const { hostels, wishlist, removeFromWishlist } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <Button variant="outline" onClick={() => navigate('/hostels')}>
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
                  <Button 
                    className="flex-1" 
                    onClick={() => navigate(`/hostels/${hostel.id}`)}
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => removeFromWishlist(hostel.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        {wishlist.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
            <Button className="mt-4" onClick={() => navigate('/hostels')}>
              Browse Hostels
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Router
const AppRouter: React.FC = () => {
  const { currentRole } = useApp();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const getDashboardComponent = () => {
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

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicLayout>
          <HomePage />
        </PublicLayout>
      } />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/hostels" element={
        <PublicLayout>
          <HostelsPage />
        </PublicLayout>
      } />
      <Route path="/hostels/:id" element={
        <PublicLayout>
          <HostelDetailPage />
        </PublicLayout>
      } />
      <Route path="/about" element={
        <PublicLayout>
          <AboutPage />
        </PublicLayout>
      } />
      <Route path="/contact" element={
        <PublicLayout>
          <ContactPage />
        </PublicLayout>
      } />
      <Route path="/login" element={
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      } />
      <Route path="/signup" element={
        <PublicLayout>
          <SignupPage />
        </PublicLayout>
      } />
      <Route path="/forgot-password" element={
        <PublicLayout>
          <ForgotPasswordPage />
        </PublicLayout>
      } />
      <Route path="/reset-password" element={
        <PublicLayout>
          <ResetPasswordPage />
        </PublicLayout>
      } />
      <Route path="/how-to-book" element={
        <PublicLayout>
          <HowToBookPage />
        </PublicLayout>
      } />
      <Route path="/student-guide" element={
        <PublicLayout>
          <StudentGuidePage />
        </PublicLayout>
      } />
      <Route path="/payment-options" element={
        <PublicLayout>
          <PaymentOptionsPage />
        </PublicLayout>
      } />
      <Route path="/safety-tips" element={
        <PublicLayout>
          <SafetyTipsPage />
        </PublicLayout>
      } />
      <Route path="/list-property" element={
        <PublicLayout>
          <ListPropertyPage />
        </PublicLayout>
      } />
      <Route path="/landlord-guide" element={
        <PublicLayout>
          <LandlordGuidePage />
        </PublicLayout>
      } />
      <Route path="/verification" element={
        <PublicLayout>
          <VerificationProcessPage />
        </PublicLayout>
      } />
      <Route path="/pricing" element={
        <PublicLayout>
          <PricingPlansPage />
        </PublicLayout>
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            {getDashboardComponent()}
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <DashboardLayout>
            <NotificationsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <BookingsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <DashboardLayout>
            <WishlistPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/hostels/add" element={
        <ProtectedRoute allowedRoles={['landlord', 'admin']}>
          <DashboardLayout>
            <AddEditHostelPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/hostels/:id/edit" element={
        <ProtectedRoute allowedRoles={['landlord', 'admin']}>
          <DashboardLayout>
            <AddEditHostelPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Role-specific Routes */}
      <Route path="/landlord" element={
        <ProtectedRoute allowedRoles={['landlord', 'admin']}>
          <DashboardLayout>
            <LandlordDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/agent" element={
        <ProtectedRoute allowedRoles={['agent', 'admin']}>
          <DashboardLayout>
            <AgentDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Redirects and 404 */}
      <Route path="/unauthorized" element={
        <PublicLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
              <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </Card>
          </div>
        </PublicLayout>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </Router>
  );
};

export default App;