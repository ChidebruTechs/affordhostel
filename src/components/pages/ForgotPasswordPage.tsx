import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const ForgotPasswordPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [step, setStep] = useState<'email' | 'sent' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('sent');
    }, 2000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!resetCode) {
      setErrors({ resetCode: 'Reset code is required' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!newPassword) {
      setErrors({ newPassword: 'New password is required' });
      return;
    }
    
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('login');
    }, 2000);
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendReset} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          No worries! Enter your email address and we'll send you a reset link.
        </p>
      </div>

      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        error={errors.email}
        required
      />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Sending Reset Link...
          </div>
        ) : (
          'Send Reset Link'
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setCurrentPage('login')}
          className="text-purple-600 hover:text-purple-500 font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </button>
      </div>
    </form>
  );

  const renderSentStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a password reset link to <strong>{email}</strong>
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div className="text-left">
            <p className="text-blue-800 font-medium">Didn't receive the email?</p>
            <p className="text-blue-700 text-sm mt-1">
              Check your spam folder or try resending the link.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-4">
        <Input
          label="Enter Reset Code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          placeholder="Enter the 6-digit code"
          error={errors.resetCode}
          required
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      <div className="flex justify-center space-x-4 text-sm">
        <button
          onClick={() => handleSendReset({ preventDefault: () => {} } as any)}
          className="text-purple-600 hover:text-purple-500 font-medium"
        >
          Resend Email
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={() => setCurrentPage('login')}
          className="text-gray-600 hover:text-gray-500"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        error={errors.newPassword}
        required
      />

      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        error={errors.confirmPassword}
        required
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Password Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <CheckCircle className={`h-4 w-4 mr-2 ${newPassword.length >= 6 ? 'text-green-500' : 'text-gray-400'}`} />
            At least 6 characters
          </li>
          <li className="flex items-center">
            <CheckCircle className={`h-4 w-4 mr-2 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
            One uppercase letter
          </li>
          <li className="flex items-center">
            <CheckCircle className={`h-4 w-4 mr-2 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
            One number
          </li>
        </ul>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Resetting Password...
          </div>
        ) : (
          'Reset Password'
        )}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8">
          {step === 'email' && renderEmailStep()}
          {step === 'sent' && renderSentStep()}
          {step === 'reset' && renderResetStep()}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;