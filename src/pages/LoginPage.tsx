import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Mail, GraduationCap, Building2, Shield, AlertCircle } from 'lucide-react';
import type { User } from '../types';

// Helper to add a timeout to a promise (30s)
const withTimeout = <T,>(ms: number, promise: Promise<T>, errorMessage: string): Promise<T> => {
  const timeoutPromise: Promise<never> = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), ms)
  );
  return Promise.race([promise, timeoutPromise]);
};

const LoginPage: React.FC = () => {
  const { setUser, setCurrentRole } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const hasPrivilegedAccess = urlParams.get('access') === 'privileged';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

     try {
       if (!formData.email || !formData.password) {
         throw new Error('Please enter both email and password');
       }

       // Basic email format validation
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(formData.email)) {
         throw new Error('Please enter a valid email address');
       }

       // Sign in with Supabase (30s timeout)
       const signInPromise = supabase.auth.signInWithPassword({
         email: formData.email,
         password: formData.password,
       });
      const { data: authData, error: authError } = await withTimeout(
        30000,
        signInPromise,
        'Login request timed out. Please check your connection and try again.'
      );

      if (authError) throw authError;
      if (!authData.user) throw new Error('Login failed');

      // Extract info from user metadata (set during signup)
      const meta = authData.user.user_metadata || {};
      const role = meta.role;
      const firstName = meta.first_name || '';
      const lastName = meta.last_name || '';

      if (!role) {
        // No role in metadata; cannot proceed without profile lookup
        throw new Error('User role not found. Please contact support.');
      }

      // Role validation
      if (role !== formData.role) {
        await supabase.auth.signOut();
        throw new Error(`Please login as a ${role}`);
      }

      // Build minimal User object
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || authData.user.email?.split('@')[0] || 'User';
      const user: User = {
        id: authData.user.id,
        name: fullName,
        email: authData.user.email || '',
        phone: '', // will be fetched later by the auth listener
        role: role,
        verified: false, // will be updated later
        createdAt: authData.user.created_at ? new Date(authData.user.created_at) : new Date(),
        avatar: meta.avatar_url || undefined
      };

      // Set user in context
      setUser(user);
      setCurrentRole(role);

      // Navigate based on role
      let redirectPath = '/dashboard';
      if (role === 'landlord') redirectPath = '/landlord';
      else if (role === 'agent') redirectPath = '/agent';
      else if (role === 'admin') redirectPath = '/admin';
      navigate(redirectPath);
     } catch (err: any) {
       // Log error details for debugging (only in development)
       if (import.meta.env.DEV) {
         console.error('Login error details:', err);
         if (err.name) console.error('Error name:', err.name);
         if (err.message) console.error('Error message:', err.message);
         if (err.stack) console.error('Error stack:', err.stack);
       }

       if (err.name === 'AuthInvalidCredentialsError') {
         setError('Invalid email or password');
       } else if (err.message?.includes('Invalid login credentials')) {
         setError('Invalid email or password');
       } else if (err.message?.includes('Email not confirmed')) {
         setError('Please verify your email first');
       } else if (err.message?.includes('User profile not found') || err.message?.includes('role not found')) {
         setError(err.message);
       } else if (err.message?.includes('Please login as a')) {
         setError(err.message);
       } else {
         setError(err.message || 'Login failed. Please try again.');
       }
     } finally {
       setIsLoading(false);
     }
   };

   const roles = hasPrivilegedAccess
    ? [
        { value: 'student', label: 'Student', icon: GraduationCap },
        { value: 'landlord', label: 'Landlord', icon: Building2 },
        { value: 'agent', label: 'Agent', icon: Building2 },
        { value: 'admin', label: 'Admin', icon: Shield }
      ]
    : [
        { value: 'student', label: 'Student', icon: GraduationCap },
        { value: 'landlord', label: 'Landlord', icon: Building2 }
      ];



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">I am a</label>
            <div className="flex gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.role === role.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(''); }}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
              placeholder="Enter password"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-purple-600 hover:text-purple-700">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>



           <div className="mt-6 pt-4 border-t text-center">
             <p className="text-sm text-gray-600">
               Don't have an account?{' '}
               <button onClick={() => {
                   const urlParams = new URLSearchParams(window.location.search);
                   const accessParam = urlParams.get('access');
                   if (accessParam) {
                     navigate(`/signup?access=${accessParam}`);
                   } else {
                     navigate('/signup');
                   }
                 }} className="text-purple-600 font-medium">
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