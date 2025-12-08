import React from 'react';
import { ArrowLeft, Shield, FileText, Eye, CheckCircle, Clock, AlertTriangle, Camera, MapPin, Users, Award, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const VerificationProcessPage: React.FC = () => {
  const { setCurrentPage, isAuthenticated, currentRole } = useApp();

  const handleStartVerification = () => {
    if (!isAuthenticated) {
      setCurrentPage('signup');
    } else if (currentRole === 'landlord') {
      setCurrentPage('add-edit-hostel');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const verificationSteps = [
    {
      number: 1,
      title: 'Document Submission',
      description: 'Upload all required legal and business documents',
      icon: FileText,
      duration: '1-2 days',
      requirements: [
        'Business registration certificate',
        'Tax compliance certificate (KRA PIN)',
        'Property ownership documents or valid lease agreement',
        'Local authority permits and licenses',
        'Identity verification documents'
      ],
      tips: [
        'Ensure all documents are clear and legible',
        'Documents should be current and not expired',
        'Upload high-resolution scans or photos',
        'All names and details must match across documents'
      ]
    },
    {
      number: 2,
      title: 'Property Documentation',
      description: 'Provide comprehensive property information and photos',
      icon: Camera,
      duration: '2-3 days',
      requirements: [
        'High-quality photos of all room types',
        'Common area and facility photos',
        'Property layout and floor plans',
        'Detailed amenity list and descriptions',
        'Safety equipment documentation'
      ],
      tips: [
        'Take photos during daylight for best quality',
        'Show rooms from multiple angles',
        'Include photos of bathrooms, kitchens, and study areas',
        'Highlight unique features and amenities'
      ]
    },
    {
      number: 3,
      title: 'Safety & Compliance Review',
      description: 'Assessment of safety measures and regulatory compliance',
      icon: Shield,
      duration: '3-5 days',
      requirements: [
        'Fire safety equipment (extinguishers, alarms)',
        'Emergency exit routes and signage',
        'Security measures (guards, CCTV, locks)',
        'Electrical and plumbing safety compliance',
        'Building structural integrity assessment'
      ],
      tips: [
        'Ensure all safety equipment is functional and current',
        'Maintain clear emergency exit routes',
        'Install adequate lighting in all areas',
        'Regular maintenance of utilities and infrastructure'
      ]
    },
    {
      number: 4,
      title: 'Site Inspection',
      description: 'Physical inspection by our verification team (if required)',
      icon: Eye,
      duration: '1-2 days',
      requirements: [
        'Property must be accessible for inspection',
        'All documented amenities must be available',
        'Safety measures must be in place and functional',
        'Property condition must match submitted photos',
        'Compliance with local regulations verified'
      ],
      tips: [
        'Schedule inspection during business hours',
        'Ensure property is clean and well-maintained',
        'Have all documentation readily available',
        'Address any maintenance issues before inspection'
      ]
    },
    {
      number: 5,
      title: 'Final Approval',
      description: 'Review completion and listing activation',
      icon: CheckCircle,
      duration: '1 day',
      requirements: [
        'All previous steps completed successfully',
        'Any identified issues resolved',
        'Final quality assurance check passed',
        'Listing information verified and approved',
        'Payment processing setup completed'
      ],
      tips: [
        'Respond promptly to any final requests',
        'Complete your landlord profile information',
        'Set up your preferred payment methods',
        'Review your listing before it goes live'
      ]
    }
  ];

  const verificationCriteria = [
    {
      category: 'Legal Compliance',
      icon: FileText,
      color: 'blue',
      items: [
        'Valid business registration',
        'Tax compliance certificates',
        'Property ownership or lease rights',
        'Local authority permits',
        'Insurance coverage (recommended)'
      ]
    },
    {
      category: 'Safety Standards',
      icon: Shield,
      color: 'red',
      items: [
        'Fire safety equipment and procedures',
        'Emergency exit routes and signage',
        'Electrical safety compliance',
        'Structural integrity and stability',
        'Security measures and access control'
      ]
    },
    {
      category: 'Quality Standards',
      icon: Star,
      color: 'yellow',
      items: [
        'Clean and well-maintained facilities',
        'Functional utilities (water, electricity, internet)',
        'Adequate furniture and amenities',
        'Proper ventilation and lighting',
        'Hygienic bathroom and kitchen facilities'
      ]
    },
    {
      category: 'Location & Accessibility',
      icon: MapPin,
      color: 'green',
      items: [
        'Proximity to universities and transport',
        'Safe neighborhood environment',
        'Accessible public transportation',
        'Nearby essential services (shops, medical)',
        'Adequate parking facilities (if applicable)'
      ]
    }
  ];

  const commonIssues = [
    {
      issue: 'Incomplete Documentation',
      description: 'Missing or expired legal documents',
      solution: 'Ensure all required documents are current and properly submitted',
      prevention: 'Review document checklist before submission'
    },
    {
      issue: 'Safety Compliance Failures',
      description: 'Inadequate fire safety or security measures',
      solution: 'Install required safety equipment and update security systems',
      prevention: 'Conduct regular safety audits and maintenance'
    },
    {
      issue: 'Property Condition Issues',
      description: 'Poor maintenance or cleanliness standards',
      solution: 'Address maintenance issues and improve property upkeep',
      prevention: 'Implement regular cleaning and maintenance schedules'
    },
    {
      issue: 'Photo Quality Problems',
      description: 'Poor quality or misleading property photos',
      solution: 'Retake photos with better lighting and angles',
      prevention: 'Use professional photography or follow our photo guidelines'
    }
  ];

  const timeline = {
    total: '7-14 business days',
    breakdown: [
      { phase: 'Document Review', duration: '1-3 days' },
      { phase: 'Property Assessment', duration: '2-5 days' },
      { phase: 'Site Inspection', duration: '1-3 days' },
      { phase: 'Final Review', duration: '1-2 days' },
      { phase: 'Listing Activation', duration: '1 day' }
    ]
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Verification Process</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive verification ensures quality, safety, and reliability for all properties on our platform
          </p>
        </div>

        {/* Timeline Overview */}
        <Card className="p-6 mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Timeline</h2>
            <p className="text-lg text-blue-600 font-semibold">Total Duration: {timeline.total}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {timeline.breakdown.map((phase, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{phase.phase}</h4>
                <p className="text-xs text-gray-600">{phase.duration}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Verification Steps</h2>
          <div className="space-y-8">
            {verificationSteps.map((step, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      <div className="ml-auto flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {step.duration}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {step.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Tips for Success</h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2">
                              <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Verification Criteria */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Verification Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationCriteria.map((criteria, index) => (
              <Card key={index} className="p-6">
                <div className={`w-12 h-12 bg-${criteria.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <criteria.icon className={`h-6 w-6 text-${criteria.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{criteria.category}</h3>
                <ul className="space-y-2">
                  {criteria.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Issues */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Common Issues & Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonIssues.map((issue, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{issue.issue}</h3>
                    <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Solution:</h4>
                    <p className="text-gray-700 text-sm">{issue.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Prevention:</h4>
                    <p className="text-gray-700 text-sm">{issue.prevention}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits of Verification */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Benefits of Verification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Trust & Credibility</h3>
              <p className="text-gray-600 text-sm">Verified badge increases student confidence and booking rates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Tenants</h3>
              <p className="text-gray-600 text-sm">Attract serious students looking for verified, quality accommodation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Platform Priority</h3>
              <p className="text-gray-600 text-sm">Verified properties receive priority in search results</p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Verification?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Begin the verification process today and join our network of trusted landlords
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleStartVerification}
              className="text-lg px-8 py-4"
            >
              <Shield className="h-5 w-5 mr-2" />
              Start Verification
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

export default VerificationProcessPage;