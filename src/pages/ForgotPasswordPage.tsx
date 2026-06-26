import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Building2, KeyRound, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { supabase } from '@lib/supabase';

const ForgotPasswordPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setStep('sent');
      setSuccess('Password reset link sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { setError('Password required'); return; }
    if (newPassword.length < 6) { setError('At least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords must match'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      setSuccess('Password reset successfully');
      setTimeout(() => setCurrentPage('login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-500">AffordHostel</p>
          </div>

          {step === 'email' && (
            <form onSubmit={sendReset} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}
              <h2 className="text-lg font-semibold text-center">Forgot password?</h2>
              <p className="text-sm text-gray-500 text-center mb-4">Enter your email to reset</p>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} icon={<Mail className="w-4 h-4" />} required />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
              <button type="button" onClick={() => setCurrentPage('login')} className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </form>
          )}

          {step === 'sent' && success && !newPassword && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-center">Check your email</h2>
              <p className="text-sm text-gray-500 text-center mb-4">Sent to <span className="font-medium">{email}</span></p>
              <p className="text-xs text-gray-500 text-center">Click the link in the email to reset your password</p>
              <div className="flex justify-center gap-4 text-sm mt-4">
                <button onClick={sendReset} className="text-purple-600 hover:text-purple-700">Resend</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setCurrentPage('login')} className="text-gray-500 hover:text-gray-700">Sign in</button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;