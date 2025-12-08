import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { universities, towns } from '../../data/universitiesAndTowns';

const SignupPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'student',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Student specific
    university: '',
    studentId: '',
    course: '',
    yearOfStudy: '',
    // Landlord specific
    businessName: '',
    businessRegistration: '',
    taxPin: '',
    bankAccount: '',
    // Agent specific
    town: '',
    licenseNumber: '',
    experience: '',
    specialization: '',
    // Admin specific
    adminCode: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if privileged access is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hasPrivilegedAccess = urlParams.get('access') === 'privileged';
  const allRoles = [
    { 
      value: 'student', 
      label: 'Student',
      description: 'Find and book hostels near your university',
      icon: '🎓',
      color: 'purple'
    },
    { 
      value: 'landlord', 
      label: 'Landlord',
      description: 'List and manage your properties',
      icon: '🏠',
      color: 'teal'
    },
    { 
      value: 'agent', 
      label: 'Agent',
      description: 'Verify properties and assist students',
      icon: '👔',
      color: 'orange'
    },
    { 
      value: 'admin', 
      label: 'Admin',
      description: 'Manage platform operations',
      icon: '⚙️',
      color: 'red'
    }
  ];

  // Filter roles based on privileged access
  const roles = hasPrivilegedAccess 
    ? allRoles 
    : allRoles.filter(role => role.value === 'student' || role.value === 'landlord');

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (formData.role === 'student') {
        if (!formData.university) newErrors.university = 'University is required';
        if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
        if (!formData.course.trim()) newErrors.course = 'Course is required';
        if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
      } else if (formData.role === 'landlord') {
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.taxPin.trim()) newErrors.taxPin = 'Tax PIN is required';
        if (!formData.bankAccount.trim()) newErrors.bankAccount = 'Bank account is required';
      } else if (formData.role === 'agent') {
        if (!formData.town) newErrors.town = 'Town is required';
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
      } else if (formData.role === 'admin') {
        if (!formData.adminCode.trim()) newErrors.adminCode = 'Admin code is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('login');
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What describes you best?
        </label>
        <div className="grid grid-cols-1 gap-3">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setFormData({ ...formData, role: role.value })}
              className={`p-3 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                formData.role === role.value
                  ? `border-${role.color}-500 bg-${role.color}-50 shadow-md`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{role.label}</h4>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          placeholder="John"
          error={errors.firstName}
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          placeholder="Doe"
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="john@example.com"
        error={errors.email}
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="+254712345678"
        error={errors.phone}
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Create a strong password"
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
        required
      />
    </div>
  );

  const renderStep2 = () => {
    switch (formData.role) {
      case 'student':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
              <p className="text-gray-600">Help us personalize your hostel search</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
              <select
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select your university</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
            </div>

            <Input
              label="Student ID"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="e.g., UoN/2023/12345"
              error={errors.studentId}
              required
            />

            <Input
              label="Course/Program"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g., Computer Science"
              error={errors.course}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
              <select
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="postgrad">Postgraduate</option>
              </select>
              {errors.yearOfStudy && <p className="text-sm text-red-600 mt-1">{errors.yearOfStudy}</p>}
            </div>
          </div>
        );

      case 'landlord':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              <p className="text-gray-600">Verify your business details</p>
            </div>

            <Input
              label="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Your business or property name"
              error={errors.businessName}
              required
            />

            <Input
              label="Business Registration Number (Optional)"
              value={formData.businessRegistration}
              onChange={(e) => setFormData({ ...formData, businessRegistration: e.target.value })}
              placeholder="Business registration number"
            />

            <Input
              label="Tax PIN"
              value={formData.taxPin}
              onChange={(e) => setFormData({ ...formData, taxPin: e.target.value })}
              placeholder="KRA Tax PIN"
              error={errors.taxPin}
              required
            />

            <Input
              label="Bank Account Number"
              value={formData.bankAccount}
              onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
              placeholder="For payment processing"
              error={errors.bankAccount}
              required
            />
          </div>
        );

      case 'agent':
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👔</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Agent Credentials</h3>
              <p className="text-gray-600">Verify your professional qualifications</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Town/City</label>
              <select
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select your preferred town</option>
                {towns.map(town => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
              {errors.town && <p className="text-sm text-red-600 mt-1">{errors.town}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Select the town where you prefer to verify properties
              </p>
            </div>

            <Input
              label="License Number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="Real estate license number"
              error={errors.licenseNumber}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              {errors.experience && <p className="text-sm text-red-600 mt-1">{errors.experience}</p>}
            </div>

            <Input
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g., Student accommodation, Commercial properties"
              error={errors.specialization}
              required
            />
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Admin Access</h3>
              <p className="text-gray-600">Verify your administrative credentials</p>
            </div>

            <Input
              label="Admin Access Code"
              value={formData.adminCode}
              onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
              placeholder="Enter admin access code"
              error={errors.adminCode}
              required
            />

            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g., Operations, Customer Support"
              error={errors.department}
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-6 mt-8">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🏠</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join AffordHostel</h2>
            <p className="text-gray-600">Create your account in just 2 steps</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600">Step {currentStep} of 2</span>
              <span className="text-sm text-gray-500">{currentStep === 1 ? 'Basic Info' : 'Role Details'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {currentStep === 1 ? renderStep1() : renderStep2()}

            <div className="flex space-x-3 mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : currentStep === 1 ? (
                  'Continue'
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;