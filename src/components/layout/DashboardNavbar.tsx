import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface DashboardNavbarProps {
  onToggleMobileSidebar: () => void;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, currentRole, currentPage, setCurrentPage, logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const navigate = useNavigate();

  // Fetch user profile and notifications
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profileData);

        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(20);

        if (notificationsError) throw notificationsError;
        setNotifications(notificationsData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchUserData();

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === payload.new.id ? payload.new as Notification : notification
          )
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard`;
      case 'analytics':
        return 'Analytics & Reports';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Account Settings';
      case 'notifications':
        return 'Notifications';
      case 'bookings':
        return 'My Bookings';
      case 'wishlist':
        return 'My Wishlist';
      case 'hostels':
        return 'Browse Hostels';
      case 'hostel-detail':
        return 'Hostel Details';
      case 'checkout':
        return 'Checkout';
      case 'login':
        return 'Login';
      case 'register':
        return 'Register';
      case 'forgot-password':
        return 'Reset Password';
      default:
        return currentPage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const quickActions = {
    student: [
      { label: 'Browse Hostels', action: () => navigate('/hostels') },
      { label: 'My Bookings', action: () => setCurrentPage('bookings') },
      { label: 'Wishlist', action: () => setCurrentPage('wishlist') }
    ],
    landlord: [
      { label: 'Add Property', action: () => navigate('/hostels/add') },
      { label: 'My Properties', action: () => alert('My Properties feature coming soon') },
      { label: 'View Bookings', action: () => setCurrentPage('bookings') }
    ],
    agent: [
      { label: 'Verification Queue', action: () => alert('Verification queue') },
      { label: 'Assigned Properties', action: () => alert('Assigned properties') },
      { label: 'Manage Landlords', action: () => alert('Landlord management') }
    ],
    admin: [
      { label: 'User Management', action: () => navigate('/admin/users') },
      { label: 'Analytics', action: () => setCurrentPage('analytics') },
      { label: 'System Settings', action: () => navigate('/admin/settings') }
    ]
  };

  const currentQuickActions = quickActions[currentRole as keyof typeof quickActions] || [];

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality based on user role
      switch (currentRole) {
        case 'student':
          navigate(`/hostels?search=${encodeURIComponent(searchQuery)}`);
          break;
        case 'landlord':
          alert(`Searching properties for: ${searchQuery}`);
          break;
        case 'agent':
          alert(`Searching verifications for: ${searchQuery}`);
          break;
        case 'admin':
          alert(`Searching system for: ${searchQuery}`);
          break;
      }
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await handleMarkAsRead(notification.id);

    // Handle action based on notification type
    if (notification.action_url) {
      navigate(notification.action_url);
    } else {
      // Default actions based on notification type
      switch (notification.type) {
        case 'booking_confirmed':
          navigate('/bookings');
          break;
        case 'verification_completed':
          navigate('/hostels');
          break;
        case 'new_message':
          setCurrentPage('messages');
          break;
        default:
          setCurrentPage('notifications');
      }
    }
  };

  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 md:py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Page Title and Search */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentRole === 'student' ? 'hostels' : currentRole}...`}
              className="pl-10 pr-4 py-2 w-48 xl:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </form>
        </div>

        {/* Right Section - Actions and User Menu */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Quick Actions Dropdown */}
          <div className="hidden lg:flex relative group">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>Quick Actions</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {currentQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative group">
            <button
              onClick={() => setCurrentPage('notifications')}
              className="relative p-1.5 md:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div>
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 ${getNotificationIconColor(notification.type)}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                    {notifications.length > 5 && (
                      <div className="p-4 text-center border-t border-gray-100">
                        <button
                          onClick={() => setCurrentPage('notifications')}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View all notifications ({notifications.length})
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications</p>
                    <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate('/settings')}
            className="hidden sm:block p-1.5 md:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* User Avatar */}
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.name}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold">
                  {getInitials(userProfile?.name || user?.name || 'User')}
                </div>
              )}
              
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
              </div>
              
              <ChevronDown className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm md:text-base font-semibold">
                        {getInitials(userProfile?.name || user?.name || 'User')}
                      </div>
                    )}
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-900">
                        {userProfile?.name || user?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-purple-600 capitalize font-medium">{currentRole}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>

                  {currentRole === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  {currentRole === 'agent' && (
                    <button
                      onClick={() => {
                        navigate('/agent');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Agent Dashboard</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
          }}
        />
      )}
    </nav>
  );
};

export default DashboardNavbar;