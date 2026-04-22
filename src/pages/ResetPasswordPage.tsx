import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../../lib/supabase';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'password' | 'success'>('password');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidToken(true);
      } else {
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };
    checkSession();
  }, []);

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
      setStep('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-center">Password Reset!</h2>
              <p className="text-sm text-gray-500 text-center mt-2">Your password has been updated successfully.</p>
              <p className="text-sm text-purple-600 text-center mt-4">Redirecting to login...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-center">Reset Password</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your new password</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={resetPassword} className="space-y-4">
            {isValidToken ? (
              <>
                <Input 
                  label="New password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  error={error} 
                  icon={<Lock className="w-4 h-4" />} 
                  required 
                />
                <Input 
                  label="Confirm password" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  error={error} 
                  icon={<Lock className="w-4 h-4" />} 
                  required 
                />
                {newPassword && (
                  <div className="text-xs space-y-1">
                    <p className={newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}>- At least 6 characters</p>
                    <p className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>- One uppercase letter</p>
                    <p className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>- One number</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset password'}
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Please use the link from your email to reset password.</p>
                <Button onClick={() => navigate('/forgot-password')}>
                  Request New Link
                </Button>
              </div>
            )}
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;