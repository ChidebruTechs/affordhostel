import React from 'react';
import { 
  Home, 
  Calendar, 
  Heart, 
  Bell, 
  User, 
  Settings,
  Building,
  Users,
  CheckCircle,
  BarChart3,
  Shield,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, currentRole, setCurrentRole, setCurrentPage, currentPage } = useApp();

  const menuItems = {
    student: [
      { icon: Home, label: 'Dashboard', page: 'dashboard' },
      { icon: Calendar, label: 'My Bookings', page: 'bookings' },
      { icon: Heart, label: 'Wishlist', page: 'wishlist' },
      { icon: Bell, label: 'Notifications', page: 'notifications' },
      { icon: User, label: 'Profile', page: 'profile' },
      { icon: Settings, label: 'Settings', page: 'settings' }
    ],
    landlord: [
      { icon: Home, label: 'Dashboard', page: 'dashboard' },
      { icon: Building, label: 'My Properties', page: 'properties' },
      { icon: Calendar, label: 'Bookings', page: 'bookings' },
      { icon: Bell, label: 'Notifications', page: 'notifications' },
      { icon: User, label: 'Profile', page: 'profile' },
      { icon: Settings, label: 'Settings', page: 'settings' }
    ],
    agent: [
      { icon: Home, label: 'Dashboard', page: 'dashboard' },
      { icon: CheckCircle, label: 'Verifications', page: 'verifications' },
      { icon: Building, label: 'Properties', page: 'properties' },
      { icon: Bell, label: 'Notifications', page: 'notifications' },
      { icon: User, label: 'Profile', page: 'profile' },
      { icon: Settings, label: 'Settings', page: 'settings' }
    ],
    admin: [
      { icon: Home, label: 'Dashboard', page: 'dashboard' },
      { icon: Users, label: 'User Management', page: 'users' },
      { icon: Building, label: 'Properties', page: 'properties' },
      { icon: BarChart3, label: 'Analytics', page: 'analytics' },
      { icon: Shield, label: 'Security', page: 'security' },
      { icon: Settings, label: 'Settings', page: 'settings' }
    ]
  };

  const currentMenuItems = menuItems[currentRole as keyof typeof menuItems] || menuItems.student;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-screen overflow-y-auto flex-shrink-0 relative">
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white md:hidden z-10"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3 lg:space-x-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-teal-500"
            />
          ) : (
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-lg">
              {getInitials(user?.name || 'User')}
            </div>
          )}
          <div>
            <h3 className="text-sm lg:text-base font-semibold truncate">{user?.name || 'User'}</h3>
            <p className="text-xs lg:text-sm text-gray-400 capitalize">{currentRole}</p>
          </div>
        </div>
      </div>

      <nav className="p-3 lg:p-4 space-y-1 lg:space-y-2">
        {currentMenuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(item.page);
              // Close mobile sidebar when navigating on mobile
              if (onClose && window.innerWidth < 768) {
                onClose();
              }
            }}
            className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors group ${
              currentPage === item.page
                ? 'bg-purple-600 text-white'
                : 'hover:bg-purple-600 hover:text-white'
            }`}
          >
            <item.icon className={`h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 ${
              currentPage === item.page
                ? 'text-white'
                : 'text-gray-400 group-hover:text-white'
            }`} />
            <span className={`text-sm lg:text-base truncate ${
              currentPage === item.page
                ? 'text-white'
                : 'group-hover:text-white'
            }`}>{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;