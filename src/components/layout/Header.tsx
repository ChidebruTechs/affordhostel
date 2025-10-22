import React, { useState } from 'react';
import { Home, Bell, User, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { isAuthenticated, setCurrentPage, notifications, user, currentRole, logout, currentPage } = useApp();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardLabel = () => {
    switch (currentRole) {
      case 'student': return 'Student Dashboard';
      case 'landlord': return 'Landlord Dashboard';
      case 'agent': return 'Agent Dashboard';
      case 'admin': return 'Admin Dashboard';
      default: return 'Dashboard';
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div 
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
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
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`text-sm lg:text-base font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('hostels')}
              className={`text-sm lg:text-base font-medium transition-colors ${
                currentPage === 'hostels' 
                  ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Hostels
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`text-sm lg:text-base font-medium transition-colors ${
                currentPage === 'about' 
                  ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className={`text-sm lg:text-base font-medium transition-colors ${
                currentPage === 'contact' 
                  ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Contact
            </button>
            {isAuthenticated && (
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`text-sm lg:text-base font-medium transition-colors flex items-center space-x-1 ${
                  currentPage === 'dashboard' 
                    ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>
          
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setCurrentPage('notifications')}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-semibold">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm">{user?.name?.split(' ')[0] || 'User'}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 lg:w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage('dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>{getDashboardLabel()}</span>
                      </button>
                      
                      <button
                        onClick={() => setCurrentPage('profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={() => setCurrentPage('settings')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
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
              <div className="flex space-x-2 lg:space-x-3">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage('login')}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => setCurrentPage('signup')}>
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
              <button 
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === 'home' 
                    ? 'text-purple-600 bg-purple-50 px-2 py-1 rounded' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('hostels');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === 'hostels' 
                    ? 'text-purple-600 bg-purple-50 px-2 py-1 rounded' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Hostels
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('about');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === 'about' 
                    ? 'text-purple-600 bg-purple-50 px-2 py-1 rounded' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('contact');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === 'contact' 
                    ? 'text-purple-600 bg-purple-50 px-2 py-1 rounded' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Contact
              </button>
              
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      setCurrentPage('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left font-medium transition-colors flex items-center space-x-2 ${
                      currentPage === 'dashboard' 
                        ? 'text-purple-600 bg-purple-50 px-2 py-1 rounded' 
                        : 'text-gray-700 hover:text-purple-600'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setCurrentPage('notifications');
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
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
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
                      setCurrentPage('login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setCurrentPage('signup');
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