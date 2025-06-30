import React, { useState } from 'react';
import { Home, Bell, User, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { isAuthenticated, setCurrentPage, notifications } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
              <Home className="h-8 w-8 text-teal-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">AffordHostel</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-purple-600 font-medium">
              Home
            </button>
            <button onClick={() => setCurrentPage('hostels')} className="text-gray-700 hover:text-purple-600 font-medium">
              Hostels
            </button>
            <button onClick={() => setCurrentPage('about')} className="text-gray-700 hover:text-purple-600 font-medium">
              About
            </button>
            <button onClick={() => setCurrentPage('contact')} className="text-gray-700 hover:text-purple-600 font-medium">
              Contact
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-purple-600"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden sm:block">Dashboard</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setCurrentPage('login')}>
                  Sign In
                </Button>
                <Button onClick={() => setCurrentPage('signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
              {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-3">
          <button onClick={() => { setCurrentPage('home'); setMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-purple-600">
            Home
          </button>
          <button onClick={() => { setCurrentPage('hostels'); setMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-purple-600">
            Hostels
          </button>
          <button onClick={() => { setCurrentPage('about'); setMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-purple-600">
            About
          </button>
          <button onClick={() => { setCurrentPage('contact'); setMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-purple-600">
            Contact
          </button>

          {/* Mobile Auth Actions */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <button
                onClick={() => { setCurrentPage('notifications'); setMenuOpen(false); }}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
              </button>
              <button
                onClick={() => { setCurrentPage('dashboard'); setMenuOpen(false); }}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
              >
                <User className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button variant="outline" onClick={() => { setCurrentPage('login'); setMenuOpen(false); }} fullWidth>
                Sign In
              </Button>
              <Button onClick={() => { setCurrentPage('signup'); setMenuOpen(false); }} fullWidth>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
