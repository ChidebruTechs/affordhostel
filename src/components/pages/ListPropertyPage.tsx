import React from 'react';
import { ArrowLeft, Plus, CheckCircle, Upload, Camera, MapPin, DollarSign, Users, Shield, Clock, Star, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ListPropertyPage: React.FC = () => {
  const { setCurrentPage, isAuthenticated, currentRole } = useApp();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      setCurrentPage('signup');
    } else if (currentRole === 'landlord') {
      setCurrentPage('add-edit-hostel');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up as a landlord and complete your profile verification',
      icon: Users,
      details: [
        'Register with your business details',
        'Upload required documentation',
        'Verify your identity and business registration',
        'Complete your landlord profile'
      ]
    },
    {
      number: 2,
      title: 'Add Property Details',
      description: 'Provide comprehensive information about your hostel',
      icon: Plus,
      details: [
        'Enter basic property information',
        'Add detailed descriptions and amenities',
        'Set pricing for different room types',
        'Upload high-quality photos'
      ]
    },
    {
      number: 3,
      title: 'Verification Process',
      description: 'Our team will verify your property for quality and safety',
      icon: Shield,
      details: [
        'Document review by our verification team',
        'Property inspection (if required)',
        'Safety and compliance check',
        'Approval and listing activation'
      ]
    },
    {
      number: 4,
      title: 'Start Receiving Bookings',
      description: 'Your property goes live and students can start booking',
      icon: Star,
      details: [
        'Property appears in search results',
        'Receive booking requests from students',
        'Manage bookings through your dashboard',
        'Receive payments securely'
      ]
    }
  ];

  const requirements = [
    {
      category: 'Legal Requirements',
      icon: Shield,
      items: [
        'Valid business registration certificate',
        'Tax compliance certificate (PIN)',
        'Property ownership documents or lease agreement',
        'Local authority permits and licenses'
      ]
    },
    {
      category: 'Property Standards',
      icon: CheckCircle,
      items: [
        'Clean and well-maintained facilities',
        'Basic safety measures (fire extinguishers, emergency exits)',
        'Adequate security (guards, CCTV, secure entry)',
        'Reliable utilities (water, electricity, internet)'
      ]
    },
    {
      category: 'Documentation',
      icon: Upload,
      items: [
        'High-quality photos of all room types',
        'Property layout and floor plans',
        'List of amenities and facilities',
        'Pricing structure and payment terms'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Reach Thousands of Students',
      description: 'Connect with verified university students actively looking for accommodation',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Secure Payment Processing',
      description: 'Receive payments safely through our verified payment systems',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Professional Management Tools',
      description: 'Manage bookings, payments, and tenant communications in one place',
      icon: Star,
      color: 'purple'
    },
    {
      title: 'Marketing Support',
      description: 'Professional photography and marketing to showcase your property',
      icon: Camera,
      color: 'orange'
    }
  ];

  const pricing = {
    commission: '5%',
    description: 'We only charge a small commission on successful bookings',
    features: [
      'No upfront listing fees',
      'Professional photography included',
      'Marketing and promotion',
      'Secure payment processing',
      'Customer support',
      'Property management tools'
    ]
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">List Your Property</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join hundreds of landlords earning consistent income by providing quality accommodation to university students
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
            <Plus className="h-5 w-5 mr-2" />
            Get Started Today
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose AffordHostel?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} hover className="p-6 text-center">
                <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center gap-8">
                <div className={`flex-shrink-0 order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                    <step.icon className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
                <Card className={`flex-1 p-8 order-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center mb-4">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Listing Requirements</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                    <req.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{req.category}</h3>
                </div>
                <ul className="space-y-3">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-purple-600 to-teal-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <div className="text-6xl font-bold mb-4">{pricing.commission}</div>
          <p className="text-xl mb-8 text-purple-100">{pricing.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {pricing.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-purple-100">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-6 mb-8 border-orange-200 bg-orange-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Important Notice</h3>
              <p className="text-orange-800 text-sm leading-relaxed">
                All properties listed on AffordHostel must meet our quality and safety standards. 
                Our verification process ensures that students have access to safe, clean, and reliable accommodation. 
                Properties that don't meet our standards will not be approved for listing.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to List Your Property?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our platform today and start earning from your property investment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
              <Plus className="h-5 w-5 mr-2" />
              List Your Property
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setCurrentPage('landlord-guide')}
              className="text-lg px-8 py-4"
            >
              Read Landlord Guide
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ListPropertyPage;