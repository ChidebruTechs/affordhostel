import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { universities, towns } from '../data/universitiesAndTowns';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Building2, GraduationCap, ChevronRight, ChevronLeft, Mail, Phone, Lock, User, Briefcase, FileText, Banknote, AlertCircle } from 'lucide-react';

const SignupPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    role: 'student',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: '',
    course: '',
    yearOfStudy: '',
    businessName: '',
    taxPin: '',
    bankAccount: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const privileged = urlParams.get('access') === 'privileged';

  const roles = privileged
    ? [
        { value: 'student', label: 'Student', icon: GraduationCap },
        { value: 'landlord', label: 'Landlord', icon: Building2 },
      ]
    : [
        { value: 'student', label: 'Student', icon: GraduationCap },
        { value: 'landlord', label: 'Landlord', icon: Building2 },
      ];

  const validate = (s: number) => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.firstName.trim()) errs.firstName = 'Required';
      if (!form.lastName.trim()) errs.lastName = 'Required';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
      if (!form.phone.trim()) errs.phone = 'Required';
      if (form.password.length < 8) errs.password = 'At least 8 characters';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords must match';
    }
    if (s === 2) {
      if (form.role === 'student') {
        if (!form.university) errs.university = 'Required';
        if (!form.studentId) errs.studentId = 'Required';
        if (!form.course) errs.course = 'Required';
        if (!form.yearOfStudy) errs.yearOfStudy = 'Required';
      } else if (form.role === 'landlord') {
        if (!form.businessName) errs.businessName = 'Required';
        if (!form.taxPin) errs.taxPin = 'Required';
        if (!form.bankAccount) errs.bankAccount = 'Required';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate(1)) setStep(2); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(2)) return;

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        phone: form.phone,
        options: { data: { first_name: form.firstName, last_name: form.lastName, role: form.role } },
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          role: form.role,
        });

        const roleData: Record<string, any> = { user_id: authData.user.id, is_verified: false };
        let table = '';

        if (form.role === 'student') {
          table = 'students';
          roleData.university = form.university;
          roleData.student_id = form.studentId;
          roleData.course = form.course;
          roleData.year_of_study = form.yearOfStudy;
        } else if (form.role === 'landlord') {
          table = 'landlords';
          roleData.business_name = form.businessName;
          roleData.tax_pin = form.taxPin;
          roleData.bank_account = form.bankAccount;
          roleData.verification_status = 'pending';
        }

        if (table) {
          await supabase.from(table).insert(roleData);
        }

        setSuccess('Account created! Please check your email to verify.');
        setTimeout(() => setCurrentPage('login'), 3000);
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setErrors({ email: 'Email already registered' });
      } else {
        setErrors({ submit: err.message || 'Signup failed' });
      }
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
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">Join AffordHostel</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>2</div>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </p>
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

          <form onSubmit={step === 2 ? submit : (e) => { e.preventDefault(); next(); }}>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">I am a</label>
                  <div className="flex gap-2">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setForm({ ...form, role: role.value })}
                          className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            form.role === role.value
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

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    label="First name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    error={errors.firstName}
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Last name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    error={errors.lastName}
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                  icon={<Phone className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Confirm password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </>
            )}

            {step === 2 && (
              <>
                {form.role === 'student' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                      <select
                        value={form.university}
                        onChange={(e) => setForm({ ...form, university: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select university</option>
                        {universities.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      {errors.university && <p className="text-xs text-red-600 mt-1">{errors.university}</p>}
                    </div>
                    <Input label="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} error={errors.studentId} icon={<FileText className="w-4 h-4" />} required />
                    <Input label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} error={errors.course} icon={<GraduationCap className="w-4 h-4" />} required />
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                      <select
                        value={form.yearOfStudy}
                        onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                      {errors.yearOfStudy && <p className="text-xs text-red-600 mt-1">{errors.yearOfStudy}</p>}
                    </div>
                  </>
                )}

                {form.role === 'landlord' && (
                  <>
                    <Input label="Business Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} error={errors.businessName} icon={<Building2 className="w-4 h-4" />} required />
                    <Input label="Tax PIN" value={form.taxPin} onChange={(e) => setForm({ ...form, taxPin: e.target.value })} error={errors.taxPin} icon={<FileText className="w-4 h-4" />} required />
                    <Input label="Bank Account" value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} error={errors.bankAccount} icon={<Banknote className="w-4 h-4" />} required />
                  </>
                )}
              </>
            )}

            <div className="flex gap-3 mt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={loading || success}>
                {loading ? 'Creating...' : step === 1 ? 'Continue' : 'Create account'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setCurrentPage('login')} className="text-purple-600 font-medium">
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