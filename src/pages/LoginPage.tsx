import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, Mail, Lock, GraduationCap, Building2, UserCog, Shield, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if privileged access is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hasPrivilegedAccess = urlParams.get('access') === 'privileged';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Starting login process...');
      
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      console.log('Attempting Supabase login with:', { email: formData.email });

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('Supabase auth response:', { authData, authError });

      if (authError) {
        console.error('Supabase auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Login failed. No user data returned.');
      }

      console.log('User authenticated, fetching profile:', authData.user.id);

      // Get user profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      console.log('Profile fetch result:', { profile, profileError });

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error(`Unable to fetch user profile: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Verify the user's role matches the selected role
      console.log('Checking role match:', { selectedRole: formData.role, userRole: profile.role });
      
      if (profile.role !== formData.role) {
        console.log('Role mismatch, signing out...');
        await supabase.auth.signOut();
        throw new Error(`Please login as a ${profile.role} using the correct role selector`);
      }

      console.log('Role verified, fetching role-specific data for:', profile.role);

      // Get role-specific data
      let roleData = {};
      try {
        switch (formData.role) {
          case 'student':
            const { data: studentData, error: studentError } = await supabase
              .from('students')
              .select('*')
              .eq('user_id', authData.user.id)
              .single();
            
            if (studentError) {
              console.warn('Student data fetch error:', studentError);
            } else {
              roleData = studentData || {};
            }
            break;
            
          case 'landlord':
            const { data: landlordData, error: landlordError } = await supabase
              .from('landlords')
              .select('*')
              .eq('user_id', authData.user.id)
              .single();
            
            if (landlordError) {
              console.warn('Landlord data fetch error:', landlordError);
            } else {
              roleData = landlordData || {};
            }
            break;
            
          case 'agent':
            const { data: agentData, error: agentError } = await supabase
              .from('agents')
              .select('*')
              .eq('user_id', authData.user.id)
              .single();
            
            if (agentError) {
              console.warn('Agent data fetch error:', agentError);
            } else {
              roleData = agentData || {};
            }
            break;
            
          case 'admin':
            const { data: adminData, error: adminError } = await supabase
              .from('admins')
              .select('*')
              .eq('user_id', authData.user.id)
              .single();
            
            if (adminError) {
              console.warn('Admin data fetch error:', adminError);
            } else {
              roleData = adminData || {};
            }
            break;
        }
      } catch (roleDataError) {
        console.warn('Error fetching role-specific data:', roleDataError);
        // Continue without role-specific data
      }

      console.log('Role data fetched:', roleData);

      // Create user session object
      const userSession = {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        ...roleData
      };

      console.log('Created user session:', userSession);
      console.log('Calling login function from context...');

      // Call the login function from context
      if (typeof login === 'function') {
        login(userSession);
      } else {
        throw new Error('Login function not available in context');
      }
      
    } catch (err: any) {
      console.error('Login error caught:', err);
      
      // Handle specific error cases
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in.');
      } else if (err.message?.includes('rate limit')) {
        setError('Too many login attempts. Please try again later.');
      } else if (err.message?.includes('User profile not found')) {
        setError('User profile not found. Please sign up first.');
      } else if (err.message?.includes('Unable to fetch user profile')) {
        setError('Unable to fetch user information. Please try again.');
      } else if (err.message?.includes('Please login as a')) {
        setError(err.message);
      } else {
        setError(err.message || 'An unexpected error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const allRoles = [
    { 
      value: 'student', 
      label: 'Student',
      description: 'Find and book hostels near campus',
      icon: GraduationCap,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50'
    },
    { 
      value: 'landlord', 
      label: 'Property Owner',
      description: 'List and manage rental properties',
      icon: Building2,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    { 
      value: 'agent', 
      label: 'Real Estate Agent',
      description: 'Verify properties and assist students',
      icon: UserCog,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      value: 'admin', 
      label: 'Administrator',
      description: 'Manage platform operations',
      icon: Shield,
      color: 'bg-gradient-to-r from-rose-500 to-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  // Filter roles based on privileged access
  const roles = hasPrivilegedAccess 
    ? allRoles 
    : allRoles.filter(role => role.value === 'student' || role.value === 'landlord');

  const getRoleSpecificFields = () => {
    const role = roles.find(r => r.value === formData.role);
    if (!role) return null;

    const messages = {
      student: {
        title: 'Student Access',
        description: 'Access hostel listings, make bookings, and manage your accommodation preferences.'
      },
      landlord: {
        title: 'Landlord Portal',
        description: 'Manage your properties, view booking requests, and track revenue.'
      },
      agent: {
        title: 'Agent Dashboard',
        description: 'Verify properties, assist students, and manage landlord relationships.'
      },
      admin: {
        title: 'Admin Panel',
        description: 'Full platform access, user management, and system analytics.'
      }
    };

    const message = messages[formData.role as keyof typeof messages];

    return (
      <div className={`mt-4 p-4 ${role.bgColor} rounded-xl border border-opacity-20`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${role.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')} rounded-lg`}>
            <role.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{message.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{message.description}</p>
          </div>
        </div>
      </div>
    );
  };

  // Add password visibility toggle button
  const PasswordToggleButton = () => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors"
      disabled={isLoading}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  );

  // Test login for development (remove in production)
  const handleTestLogin = (role: string) => {
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const testUsers = {
        student: {
          id: 'test_student_1',
          email: 'student@test.com',
          name: 'Test Student',
          phone: '+254712345678',
          role: 'student',
          university: 'University of Nairobi',
          studentId: 'UoN/2023/12345',
          verified: true,
          createdAt: new Date()
        },
        landlord: {
          id: 'test_landlord_1',
          email: 'landlord@test.com',
          name: 'Test Landlord',
          phone: '+254712345678',
          role: 'landlord',
          verified: true,
          createdAt: new Date()
        },
        agent: {
          id: 'test_agent_1',
          email: 'agent@test.com',
          name: 'Test Agent',
          phone: '+254712345678',
          role: 'agent',
          verified: true,
          createdAt: new Date()
        },
        admin: {
          id: 'test_admin_1',
          email: 'admin@test.com',
          name: 'Test Admin',
          phone: '+254712345678',
          role: 'admin',
          verified: true,
          createdAt: new Date()
        }
      };

      const testUser = testUsers[role as keyof typeof testUsers];
      if (testUser && typeof login === 'function') {
        login(testUser);
      } else {
        setError('Test login failed');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8 shadow-xl border-0 rounded-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your AffordHostel account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-3 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    formData.role === role.value
                      ? `border-purple-500 shadow-lg ring-2 ring-purple-500/20 ${role.bgColor}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-md ${role.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}>
                      <role.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm text-gray-900">{role.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 leading-tight">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {getRoleSpecificFields()}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError('');
              }}
              placeholder="your@email.com"
              icon={<Mail className="w-5 h-5" />}
              required
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError('');
                }}
                placeholder="Enter your password"
                icon={<Lock className="w-5 h-5" />}
                required
                disabled={isLoading}
              />
              <PasswordToggleButton />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setCurrentPage('forgot-password')}
                className="text-sm text-purple-600 hover:text-purple-500 font-medium disabled:text-gray-400"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${roles.find(r => r.value === formData.role)?.label}`
              )}
            </Button>
          </form>

          {/* Test Login Buttons (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3 text-center">Development Test Logins:</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <Button
                    key={`test-${role.value}`}
                    type="button"
                    variant="outline"
                    onClick={() => handleTestLogin(role.value)}
                    className="text-sm py-2"
                    disabled={isLoading}
                  >
                    Test as {role.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-purple-600 hover:text-purple-500 font-medium"
                disabled={isLoading}
              >
                Create account
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;