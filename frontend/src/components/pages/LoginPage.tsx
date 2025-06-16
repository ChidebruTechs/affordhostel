import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(formData.email, formData.password, formData.role);
      setIsLoading(false);
    }, 1000);
  };

  const roles = [
    { 
      value: 'student', 
      label: 'Student',
      description: 'Find and book hostels near your university',
      icon: '🎓'
    },
    { 
      value: 'landlord', 
      label: 'Landlord',
      description: 'List and manage your properties',
      icon: '🏠'
    },
    { 
      value: 'agent', 
      label: 'Agent',
      description: 'Verify properties and assist students',
      icon: '👔'
    },
    { 
      value: 'admin', 
      label: 'Admin',
      description: 'Manage platform operations',
      icon: '⚙️'
    }
  ];

  const getRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return (
          <div className="space-y-4 mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800">Student Access</h4>
            <p className="text-sm text-purple-600">
              Access hostel listings, make bookings, and manage your accommodation preferences.
            </p>
          </div>
        );
      case 'landlord':
        return (
          <div className="space-y-4 mt-4 p-4 bg-teal-50 rounded-lg">
            <h4 className="font-medium text-teal-800">Landlord Portal</h4>
            <p className="text-sm text-teal-600">
              Manage your properties, view booking requests, and track revenue.
            </p>
          </div>
        );
      case 'agent':
        return (
          <div className="space-y-4 mt-4 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-800">Agent Dashboard</h4>
            <p className="text-sm text-orange-600">
              Verify properties, assist students, and manage landlord relationships.
            </p>
          </div>
        );
      case 'admin':
        return (
          <div className="space-y-4 mt-4 p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-800">Admin Panel</h4>
            <p className="text-sm text-red-600">
              Full platform access, user management, and system analytics.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your AffordHostel account</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-3 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                    formData.role === role.value
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{role.icon}</span>
                    <span className="font-medium text-sm">{role.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-tight">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {getRoleSpecificFields()}

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setCurrentPage('forgot-password')}
                className="text-sm text-purple-600 hover:text-purple-500 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${roles.find(r => r.value === formData.role)?.label}`
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;