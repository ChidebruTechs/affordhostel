import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, GraduationCap, Building2, Shield, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useApp();
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

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Login failed');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw new Error(`Unable to fetch user profile: ${profileError.message}`);
      if (!profile) throw new Error('User profile not found');

      if (profile.role !== formData.role) {
        await supabase.auth.signOut();
        throw new Error(`Please login as a ${profile.role}`);
      }

      let roleData = {};
      const tables: Record<string, string> = {
        student: 'students',
        landlord: 'landlords',
        agent: 'agents',
        admin: 'admins'
      };
      const table = tables[formData.role];
      if (table) {
        const { data } = await supabase.from(table).select('*').eq('user_id', authData.user.id).single();
        roleData = data || {};
      }

      const userSession = {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        ...roleData
      };

      if (typeof login === 'function') {
        login(userSession);
      } else {
        throw new Error('Login function not available');
      }
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please verify your email first');
      } else if (err.message?.includes('User profile not found')) {
        setError('Profile not found. Please sign up first.');
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
              <button type="button" onClick={() => setCurrentPage('forgot-password')} className="text-purple-600 hover:text-purple-700">
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
              <button onClick={() => setCurrentPage('signup')} className="text-purple-600 font-medium">
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