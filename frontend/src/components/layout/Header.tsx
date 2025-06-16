import React from 'react';
import { Home, Bell, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { isAuthenticated, setCurrentPage, notifications } = useApp();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
              <Home className="h-8 w-8 text-teal-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">AffordHostel</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('hostels')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Hostels
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Contact
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setCurrentPage('notifications')}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden sm:block">Dashboard</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage('login')}
                >
                  Sign In
                </Button>
                <Button onClick={() => setCurrentPage('signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;