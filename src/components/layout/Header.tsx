import React, { useState, useEffect } from 'react';
import { Home, Bell, User, LayoutDashboard, LogOut, Menu, X, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { 
    isAuthenticated, 
    user, 
    currentRole, 
    logout,
    notifications: contextNotifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    loading
  } = useApp();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  const unreadCount = contextNotifications.filter(n => !n.read).length;

  const getDashboardLabel = () => {
    switch (currentRole) {
      case 'student': return 'Student Dashboard';
      case 'landlord': return 'Landlord Dashboard';
      case 'agent': return 'Agent Dashboard';
      case 'admin': return 'Admin Dashboard';
      default: return 'Dashboard';
    }
  };

  const getDashboardPath = () => {
    switch (currentRole) {
      case 'student': return '/dashboard';
      case 'landlord': return '/landlord';
      case 'agent': return '/agent';
      case 'admin': return '/admin';
      default: return '/dashboard';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleNotificationClick = async (notification: any) => {
    try {
      // Mark as read
      await markAsRead(notification.id);

      // Navigate to action URL if provided
      if (notification.action_url) {
        navigate(notification.action_url);
      } else {
        navigate('/notifications');
      }

      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const isActivePage = (page: string) => {
    if (page === 'home') return currentPath === '/' || currentPath === '/home';
    if (page === 'dashboard') return currentPath.startsWith('/dashboard') || 
                                   currentPath.startsWith('/landlord') || 
                                   currentPath.startsWith('/agent') || 
                                   currentPath.startsWith('/admin');
    return currentPath.startsWith(`/${page}`);
  };

  const getPageTitle = (page: string) => {
    const titles: Record<string, string> = {
      'home': 'Home',
      'hostels': 'Hostels',
      'about': 'About',
      'contact': 'Contact',
      'dashboard': getDashboardLabel()
    };
    return titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-1.5 md:p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
              <Home className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
            </div>
            <span className="text-lg md:text-2xl font-bold text-purple-600">AffordHostel</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {['home', 'hostels', 'about', 'contact'].map((page) => (
              <button 
                key={page}
                onClick={() => navigate(page === 'home' ? '/' : `/${page}`)}
                className={`text-sm lg:text-base font-medium transition-colors ${
                  isActivePage(page)
                    ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {getPageTitle(page)}
              </button>
            ))}
            
            {isAuthenticated && (
              <button 
                onClick={() => navigate(getDashboardPath())}
                className={`text-sm lg:text-base font-medium transition-colors flex items-center space-x-1 ${
                  isActivePage('dashboard')
                    ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{getDashboardLabel()}</span>
              </button>
            )}
          </nav>
          
          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative group">
                  <button 
                    onClick={() => navigate('/notifications')}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                        </div>
                      ) : contextNotifications.length > 0 ? (
                        <div>
                          {contextNotifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <Bell className={`h-4 w-4 ${
                                    notification.type === 'success' ? 'text-green-500' :
                                    notification.type === 'warning' ? 'text-yellow-500' :
                                    notification.type === 'error' ? 'text-red-500' :
                                    'text-blue-500'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {notification.createdAt.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {contextNotifications.length > 5 && (
                            <div className="p-4 text-center border-t border-gray-100">
                              <button
                                onClick={() => navigate('/notifications')}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                              >
                                View all notifications ({contextNotifications.length})
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

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(user?.name || 'User')}
                      </div>
                    )}
                    <span className="text-sm">{user?.name?.split(' ')[0] || 'User'}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <p className="text-xs text-purple-600 capitalize font-medium mt-1">
                          {currentRole}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => navigate(getDashboardPath())}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>{getDashboardLabel()}</span>
                      </button>
                      
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {['home', 'hostels', 'about', 'contact'].map((page) => (
                <button 
                  key={page}
                  onClick={() => {
                    navigate(page === 'home' ? '/' : `/${page}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-medium transition-colors px-3 py-2 rounded-lg ${
                    isActivePage(page)
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  {getPageTitle(page)}
                </button>
              ))}
              
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      navigate(getDashboardPath());
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left font-medium transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      isActivePage('dashboard')
                        ? 'text-purple-600 bg-purple-50' 
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{getDashboardLabel()}</span>
                  </button>
                  
                  {/* Mobile User Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getInitials(user?.name || 'User')}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            navigate('/notifications');
                            setIsMobileMenuOpen(false);
                          }}
                          className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                          <Bell className="h-5 w-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;