import React, { useState } from 'react';
import { Bell, Search, Settings, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

interface DashboardNavbarProps {
  onToggleMobileSidebar: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, currentRole, currentPage, setCurrentPage, logout, notifications } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
      default:
        return currentPage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const quickActions = {
    student: [
      { label: 'Browse Hostels', action: () => setCurrentPage('hostels') },
      { label: 'My Bookings', action: () => setCurrentPage('bookings') },
      { label: 'Wishlist', action: () => setCurrentPage('wishlist') }
    ],
    landlord: [
      { label: 'Add Property', action: () => alert('Add Property feature coming soon') },
      { label: 'View Bookings', action: () => setCurrentPage('bookings') },
      { label: 'Analytics', action: () => setCurrentPage('analytics') }
    ],
    agent: [
      { label: 'Verify Properties', action: () => alert('Verification queue') },
      { label: 'View Reports', action: () => setCurrentPage('analytics') },
      { label: 'Manage Landlords', action: () => alert('Landlord management') }
    ],
    admin: [
      { label: 'User Management', action: () => alert('User management') },
      { label: 'Analytics', action: () => setCurrentPage('analytics') },
      { label: 'System Settings', action: () => setCurrentPage('settings') }
    ]
  };

  const currentQuickActions = quickActions[currentRole as keyof typeof quickActions] || [];

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
          <div className="hidden lg:flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-48 xl:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
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

          {/* Settings */}
          <button
            onClick={() => setCurrentPage('settings')}
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
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold">
                  {getInitials(user?.name || 'User')}
                </div>
              )}
              
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name?.split(' ')[0] || 'User'}
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
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm md:text-base font-semibold">
                        {getInitials(user?.name || 'User')}
                      </div>
                    )}
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-purple-600 capitalize font-medium">{currentRole}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentPage('settings');
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
                        setCurrentPage('analytics');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Analytics</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={() => {
                      logout();
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