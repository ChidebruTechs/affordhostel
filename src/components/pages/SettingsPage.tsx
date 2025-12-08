import React, { useState } from 'react';
import { Camera, Shield, Download, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle, Smartphone, Key, LogOut, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

const SettingsPage: React.FC = () => {
  const { user, logout, updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    university: user?.university || '',
    studentId: user?.studentId || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSettingUpTwoFactor, setIsSettingUpTwoFactor] = useState(false);

  // Active sessions state
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'Chrome, Windows',
      location: 'Nairobi, Kenya',
      lastActive: 'Just now',
      current: true
    },
    {
      id: '2',
      device: 'Safari, iOS',
      location: 'Nairobi, Kenya',
      lastActive: '2 days ago',
      current: false
    },
    {
      id: '3',
      device: 'Firefox, Android',
      location: 'Mombasa, Kenya',
      lastActive: '1 week ago',
      current: false
    }
  ]);

  // Delete account state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false
  });

  // Loading states
  const [isExportingData, setIsExportingData] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateUserProfile({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        studentId: formData.studentId
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password changed successfully!');
    } catch (error) {
      alert('Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (!twoFactorEnabled) {
      // Enable 2FA
      setIsSettingUpTwoFactor(true);
      
      try {
        // Simulate API call to generate QR code and secret
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockSetup: TwoFactorSetup = {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          secret: 'JBSWY3DPEHPK3PXP',
          backupCodes: [
            '12345678',
            '87654321',
            '11223344',
            '44332211',
            '55667788'
          ]
        };
        
        setTwoFactorSetup(mockSetup);
        setShowTwoFactorSetup(true);
      } catch (error) {
        alert('Failed to setup two-factor authentication');
      } finally {
        setIsSettingUpTwoFactor(false);
      }
    } else {
      // Disable 2FA
      if (confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setTwoFactorEnabled(false);
          alert('Two-factor authentication disabled');
        } catch (error) {
          alert('Failed to disable two-factor authentication');
        }
      }
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }
    
    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setVerificationCode('');
      setTwoFactorSetup(null);
      
      alert('Two-factor authentication enabled successfully!');
    } catch (error) {
      alert('Invalid verification code. Please try again.');
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      alert('Session logged out successfully');
    } catch (error) {
      alert('Failed to logout session');
    }
  };

  const handleLogoutAllSessions = async () => {
    if (confirm('Are you sure you want to logout from all other devices? You will need to login again on those devices.')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setActiveSessions(prev => prev.filter(session => session.current));
        alert('Logged out from all other sessions');
      } catch (error) {
        alert('Failed to logout from all sessions');
      }
    }
  };

  const handleExportData = async () => {
    setIsExportingData(true);
    
    try {
      // Simulate API call to prepare data export
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock data export
      const userData = {
        profile: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          role: user?.role,
          university: user?.university,
          studentId: user?.studentId,
          createdAt: user?.createdAt
        },
        bookings: [
          {
            id: '1',
            hostelName: 'Umoja Hostels',
            checkIn: '2023-08-15',
            checkOut: '2023-12-15',
            amount: 60000,
            status: 'confirmed'
          }
        ],
        reviews: [
          {
            id: '1',
            hostelName: 'Umoja Hostels',
            rating: 5,
            comment: 'Great hostel with excellent facilities',
            date: '2023-07-01'
          }
        ],
        exportDate: new Date().toISOString()
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `affordhostel_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion');
      return;
    }
    
    setIsDeletingAccount(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Account deleted successfully. You will be redirected to the homepage.');
      logout();
    } catch (error) {
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Personal Information
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">University</label>
              <select
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option>University of Nairobi</option>
                <option>Kenyatta University</option>
                <option>JKUAT</option>
                <option>Mount Kenya University</option>
              </select>
            </div>

            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Security Settings
        </h2>
        
        <div className="space-y-6">
          {/* Password Change */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing Password...
                  </div>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={handleTwoFactorToggle}
                  disabled={isSettingUpTwoFactor}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Two-Factor Setup Modal */}
            {showTwoFactorSetup && twoFactorSetup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="p-8 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Setup Two-Factor Authentication</h3>
                    <button
                      onClick={() => setShowTwoFactorSetup(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Smartphone className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-500 ml-2">QR Code</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Scan this QR code with your authenticator app
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or enter this secret key manually:
                      </label>
                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
                        {twoFactorSetup.secret}
                      </div>
                    </div>

                    <div>
                      <Input
                        label="Enter verification code from your app"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Backup Codes</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
                      </p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                        {twoFactorSetup.backupCodes.map((code, index) => (
                          <div key={index} className="bg-white p-2 rounded border">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={handleVerifyTwoFactor} className="flex-1">
                        <Key className="h-4 w-4 mr-2" />
                        Verify & Enable
                      </Button>
                      <Button variant="outline" onClick={() => setShowTwoFactorSetup(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
              <Button variant="outline" size="sm" onClick={handleLogoutAllSessions}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout All Others
              </Button>
            </div>
            <div className="space-y-2">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.device} {session.current && '(Current)'}
                      </p>
                      <p className="text-sm text-gray-600">{session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleLogoutSession(session.id)}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Notification Preferences
        </h2>
        
        <div className="space-y-3">
          {[
            { 
              key: 'email' as keyof typeof notifications, 
              label: 'Email Notifications', 
              description: 'Receive booking confirmations and updates via email' 
            },
            { 
              key: 'sms' as keyof typeof notifications, 
              label: 'SMS Notifications', 
              description: 'Get important alerts via text message' 
            },
            { 
              key: 'push' as keyof typeof notifications, 
              label: 'Push Notifications', 
              description: 'Receive browser notifications for real-time updates' 
            },
            { 
              key: 'marketing' as keyof typeof notifications, 
              label: 'Marketing Emails', 
              description: 'Stay updated with new hostels and special offers' 
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationChange(item.key)}
                  className="sr-only peer" 
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Data Management
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-medium text-blue-900">Export Your Data</h3>
              <p className="text-sm text-blue-700">Download a copy of all your data including profile, bookings, and reviews</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isExportingData}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              {isExportingData ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Exporting...
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h2 className="text-2xl font-semibold text-red-900 mb-6">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-red-700 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {!showDeleteConfirmation ? (
            <Button 
              variant="danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Type "DELETE" to confirm account deletion:
                </label>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE here"
                  className="border-red-300 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="danger"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount || deleteConfirmation !== 'DELETE'}
                >
                  {isDeletingAccount ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting Account...
                    </div>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Permanently Delete Account
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteConfirmation('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;