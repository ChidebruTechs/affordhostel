import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Building2, KeyRound, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const ForgotPasswordPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [step, setStep] = useState<'email' | 'sent' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('sent'); }, 1500);
  };

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) { setError('Code is required'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('reset'); }, 1000);
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { setError('Password required'); return; }
    if (newPassword.length < 6) { setError('At least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords must match'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrentPage('login'); }, 1500);
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
              <h2 className="text-lg font-semibold text-center">Forgot password?</h2>
              <p className="text-sm text-gray-500 text-center mb-4">Enter your email to reset</p>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} icon={<Mail className="w-4 h-4" />} required />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
              <button type="button" onClick={() => setCurrentPage('login')} className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </form>
          )}

          {step === 'sent' && (
            <form onSubmit={verifyCode} className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-center">Check your email</h2>
              <p className="text-sm text-gray-500 text-center mb-4">Sent to <span className="font-medium">{email}</span></p>
              <Input label="Reset code" value={code} onChange={(e) => setCode(e.target.value)} error={error} icon={<KeyRound className="w-4 h-4" />} required />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify code'}</Button>
              <div className="flex justify-center gap-4 text-sm">
                <button onClick={sendReset} className="text-purple-600 hover:text-purple-700">Resend</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setCurrentPage('login')} className="text-gray-500 hover:text-gray-700">Sign in</button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={resetPassword} className="space-y-4">
              <h2 className="text-lg font-semibold text-center">New password</h2>
              <p className="text-sm text-gray-500 text-center mb-4">Enter your new password</p>
              <Input label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} error={error} icon={<Lock className="w-4 h-4" />} required />
              <Input label="Confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={error} icon={<Lock className="w-4 h-4" />} required />
              {newPassword && (
                <div className="text-xs space-y-1">
                  <p className={newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}>- At least 6 characters</p>
                  <p className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>- One uppercase letter</p>
                  <p className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>- One number</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;