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
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const { user, currentRole, setCurrentRole, setCurrentPage } = useApp();

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

  return (
    <div className="bg-gray-900 text-white w-64 h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div>
            <h3 className="font-semibold">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-400 capitalize">{currentRole}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {currentMenuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(item.page)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-purple-600 transition-colors group"
          >
            <item.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
            <span className="group-hover:text-white">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 mt-8">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Switch Role</h4>
        <div className="space-y-2">
          {['student', 'landlord', 'agent', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`w-full px-3 py-2 text-sm rounded-full text-left transition-colors ${
                currentRole === role 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;