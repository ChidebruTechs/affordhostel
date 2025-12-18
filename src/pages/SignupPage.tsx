import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { universities, towns } from '../data/universitiesAndTowns';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Building2, GraduationCap, UserCog, Shield, ChevronRight, ChevronLeft, Mail, Phone, Lock, User, Briefcase, MapPin, FileText, Banknote } from 'lucide-react';

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
  const [successMessage, setSuccessMessage] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const hasPrivilegedAccess = urlParams.get('access') === 'privileged';
  
  const allRoles = [
    { 
      value: 'student', 
      label: 'Student',
      description: 'Find and book hostels near your campus',
      icon: GraduationCap,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      borderColor: 'border-purple-100'
    },
    { 
      value: 'landlord', 
      label: 'Property Owner',
      description: 'List and manage your rental properties',
      icon: Building2,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-100'
    },
    { 
      value: 'agent', 
      label: 'Real Estate Agent',
      description: 'Verify properties and assist students',
      icon: UserCog,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      borderColor: 'border-amber-100'
    },
    { 
      value: 'admin', 
      label: 'Administrator',
      description: 'Manage platform operations and users',
      icon: Shield,
      color: 'bg-gradient-to-r from-rose-500 to-red-600',
      borderColor: 'border-rose-100'
    }
  ];

  const roles = hasPrivilegedAccess 
    ? allRoles 
    : allRoles.filter(role => role.value === 'student' || role.value === 'landlord');

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
      }
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
        const validAdminCode = process.env.REACT_APP_ADMIN_ACCESS_CODE || 'ADMIN123';
        if (formData.adminCode !== validAdminCode) {
          newErrors.adminCode = 'Invalid admin access code';
        }
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
    setErrors({});
    setSuccessMessage('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;

        let roleData: any = {};
        let roleTable = '';

        switch (formData.role) {
          case 'student':
            roleTable = 'students';
            roleData = {
              user_id: authData.user.id,
              university: formData.university,
              student_id: formData.studentId,
              course: formData.course,
              year_of_study: formData.yearOfStudy,
              is_verified: false,
            };
            break;
          case 'landlord':
            roleTable = 'landlords';
            roleData = {
              user_id: authData.user.id,
              business_name: formData.businessName,
              business_registration: formData.businessRegistration || null,
              tax_pin: formData.taxPin,
              bank_account: formData.bankAccount,
              is_verified: false,
              verification_status: 'pending',
            };
            break;
          case 'agent':
            roleTable = 'agents';
            roleData = {
              user_id: authData.user.id,
              town: formData.town,
              license_number: formData.licenseNumber,
              experience: formData.experience,
              specialization: formData.specialization,
              is_verified: false,
              verification_status: 'pending',
              rating: 0,
              total_verifications: 0,
            };
            break;
          case 'admin':
            roleTable = 'admins';
            roleData = {
              user_id: authData.user.id,
              department: formData.department,
              access_level: 'basic',
              is_active: true,
            };
            break;
        }

        if (roleTable) {
          const { error: roleError } = await supabase
            .from(roleTable)
            .insert(roleData);

          if (roleError) throw roleError;
        }

        setSuccessMessage('Account created successfully! Please check your email to verify your account.');
        
        setTimeout(() => {
          setCurrentPage('login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.message?.includes('already registered')) {
        setErrors({ email: 'This email is already registered. Please try logging in.' });
      } else if (error.message?.includes('User already exists')) {
        setErrors({ email: 'An account with this email already exists.' });
      } else if (error.message?.includes('password')) {
        setErrors({ password: 'Password does not meet requirements.' });
      } else if (error.message?.includes('phone')) {
        setErrors({ phone: 'Invalid phone number format.' });
      } else {
        setErrors({ submit: error.message || 'An error occurred during signup. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Your Role</h3>
          <span className="text-sm text-gray-500">Step 1 of 2</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setFormData({ ...formData, role: role.value })}
              className={`p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                formData.role === role.value
                  ? `border-purple-500 shadow-lg ring-2 ring-purple-500/20 ${role.borderColor}`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${role.color} p-2 rounded-lg`}>
                  <role.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{role.label}</h4>
                    {formData.role === role.value && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          placeholder="John"
          error={errors.firstName}
          icon={<User className="w-5 h-5" />}
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          placeholder="Doe"
          error={errors.lastName}
          icon={<User className="w-5 h-5" />}
          required
        />
      </div>

      <div className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+254 712 345 678"
          error={errors.phone}
          icon={<Phone className="w-5 h-5" />}
          required
        />
        <Input
          label="Password"
          type="password"  // This will automatically show the toggle eye icon
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Create a strong password"
          error={errors.password}
          icon={<Lock className="w-5 h-5" />}
          required
          helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
        />

        <Input
          label="Confirm Password"
          type="password"  // This will also show the toggle eye icon
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          icon={<Lock className="w-5 h-5" />}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => {
    const roleConfig = {
      student: {
        title: 'Student Information',
        subtitle: 'Complete your academic details',
        icon: GraduationCap,
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
      },
      landlord: {
        title: 'Business Information',
        subtitle: 'Verify your property ownership details',
        icon: Building2,
        color: 'bg-gradient-to-r from-emerald-500 to-teal-600'
      },
      agent: {
        title: 'Professional Credentials',
        subtitle: 'Provide your professional qualifications',
        icon: UserCog,
        color: 'bg-gradient-to-r from-amber-500 to-orange-600'
      },
      admin: {
        title: 'Administrative Access',
        subtitle: 'Verify administrative credentials',
        icon: Shield,
        color: 'bg-gradient-to-r from-rose-500 to-red-600'
      }
    };

    const config = roleConfig[formData.role as keyof typeof roleConfig];

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className={`inline-flex p-3 rounded-xl ${config.color} mb-4`}>
            <config.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{config.title}</h3>
          <p className="text-gray-600">{config.subtitle}</p>
        </div>

        {formData.role === 'student' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
              <div className="relative">
                <select
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select your university</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
                <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
            </div>

            <Input
              label="Student ID"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="e.g., UoN/2023/12345"
              error={errors.studentId}
              icon={<FileText className="w-5 h-5" />}
              required
            />

            <Input
              label="Course/Program"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g., Computer Science"
              error={errors.course}
              icon={<GraduationCap className="w-5 h-5" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
              <div className="relative">
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
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
                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.yearOfStudy && <p className="text-sm text-red-600 mt-1">{errors.yearOfStudy}</p>}
            </div>
          </div>
        )}

        {formData.role === 'landlord' && (
          <div className="space-y-6">
            <Input
              label="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Your business or property name"
              error={errors.businessName}
              icon={<Building2 className="w-5 h-5" />}
              required
            />

            <Input
              label="Business Registration Number (Optional)"
              value={formData.businessRegistration}
              onChange={(e) => setFormData({ ...formData, businessRegistration: e.target.value })}
              placeholder="Business registration number"
              icon={<FileText className="w-5 h-5" />}
            />

            <Input
              label="Tax PIN"
              value={formData.taxPin}
              onChange={(e) => setFormData({ ...formData, taxPin: e.target.value })}
              placeholder="KRA Tax PIN"
              error={errors.taxPin}
              icon={<FileText className="w-5 h-5" />}
              required
            />

            <Input
              label="Bank Account Number"
              value={formData.bankAccount}
              onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
              placeholder="For payment processing"
              error={errors.bankAccount}
              icon={<Banknote className="w-5 h-5" />}
              required
            />
          </div>
        )}

        {formData.role === 'agent' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Town/City</label>
              <div className="relative">
                <select
                  value={formData.town}
                  onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select your preferred town</option>
                  {towns.map(town => (
                    <option key={town} value={town}>{town}</option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.town && <p className="text-sm text-red-600 mt-1">{errors.town}</p>}
            </div>

            <Input
              label="License Number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="Real estate license number"
              error={errors.licenseNumber}
              icon={<FileText className="w-5 h-5" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <div className="relative">
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.experience && <p className="text-sm text-red-600 mt-1">{errors.experience}</p>}
            </div>

            <Input
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g., Student accommodation, Commercial properties"
              error={errors.specialization}
              icon={<UserCog className="w-5 h-5" />}
              required
            />
          </div>
        )}

        {formData.role === 'admin' && (
          <div className="space-y-6">
            <Input
              label="Admin Access Code"
              type="password"
              value={formData.adminCode}
              onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
              placeholder="Enter admin access code"
              error={errors.adminCode}
              icon={<Shield className="w-5 h-5" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <div className="relative">
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select department</option>
                  <option value="operations">Operations</option>
                  <option value="customer_support">Customer Support</option>
                  <option value="technical">Technical</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                </select>
                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 shadow-2xl">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">AffordHostel</h1>
                </div>
                <p className="text-white/90 text-lg">
                  Join thousands of students, landlords, and agents in Kenya's largest student accommodation platform.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: GraduationCap, text: 'Find affordable hostels near your campus' },
                  { icon: Building2, text: 'List properties with verified student tenants' },
                  { icon: Shield, text: 'Secure payments and verified listings' },
                  { icon: UserCog, text: 'Professional agent verification services' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white/10 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Already have an account?</h4>
                    <p className="text-white/80 text-sm">Sign in to access your dashboard</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentPage('login')}
                    className="bg-white text-purple-700 hover:bg-gray-50 border-0"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div>
            <Card className="p-8 shadow-xl border-0 rounded-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-600">Join our platform in just a few steps</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    2
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-700">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-red-600 mr-2">!</div>
                    <p className="text-red-700">{errors.submit}</p>
                  </div>
                </div>
              )}

              <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {currentStep === 1 ? renderStep1() : renderStep2()}

                <div className="flex space-x-4 mt-8">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 py-3"
                      disabled={isLoading}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    className={`flex-1 py-3 ${!currentStep > 1 ? 'col-span-2' : ''}`}
                    disabled={isLoading || !!successMessage}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : currentStep === 1 ? (
                      <>
                        Continue
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </form>

              {/* Mobile Sign In */}
              <div className="mt-8 pt-6 border-t border-gray-200 md:hidden">
                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="text-purple-600 hover:text-purple-500 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;