import React from 'react';
import { ArrowLeft, Home, Users, DollarSign, Shield, CheckCircle, AlertTriangle, Clock, Star, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const LandlordGuidePage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const sections = [
    {
      title: 'Getting Started',
      icon: Home,
      color: 'purple',
      topics: [
        {
          title: 'Setting Up Your Account',
          description: 'Complete your landlord profile and verification process.',
          tips: [
            'Upload clear photos of required documents',
            'Provide accurate business registration details',
            'Complete your profile with contact information',
            'Verify your identity through our secure process'
          ]
        },
        {
          title: 'Property Documentation',
          description: 'Gather all necessary documents before listing your property.',
          tips: [
            'Business registration certificate',
            'Property ownership or lease documents',
            'Tax compliance certificates',
            'Local authority permits and licenses'
          ]
        },
        {
          title: 'Photography Guidelines',
          description: 'High-quality photos significantly increase booking rates.',
          tips: [
            'Take photos during daylight hours',
            'Clean and organize rooms before photography',
            'Include photos of all room types and common areas',
            'Show amenities like kitchens, study areas, and bathrooms'
          ]
        }
      ]
    },
    {
      title: 'Property Management',
      icon: Settings,
      color: 'teal',
      topics: [
        {
          title: 'Managing Bookings',
          description: 'Efficiently handle booking requests and tenant communications.',
          tips: [
            'Respond to booking requests within 24 hours',
            'Keep your availability calendar updated',
            'Communicate clearly with potential tenants',
            'Use our messaging system for all communications'
          ]
        },
        {
          title: 'Pricing Strategy',
          description: 'Set competitive prices to maximize occupancy and revenue.',
          tips: [
            'Research similar properties in your area',
            'Consider seasonal demand fluctuations',
            'Offer competitive rates for longer stays',
            'Include utilities in your pricing when possible'
          ]
        },
        {
          title: 'Maintenance and Upkeep',
          description: 'Maintain your property to ensure positive reviews and repeat bookings.',
          tips: [
            'Conduct regular property inspections',
            'Address maintenance issues promptly',
            'Keep common areas clean and well-maintained',
            'Ensure all utilities are functioning properly'
          ]
        }
      ]
    },
    {
      title: 'Tenant Relations',
      icon: Users,
      color: 'blue',
      topics: [
        {
          title: 'Screening Tenants',
          description: 'Select reliable tenants to minimize issues and ensure timely payments.',
          tips: [
            'Review student profiles and university verification',
            'Check references from previous landlords',
            'Verify student enrollment status',
            'Communicate expectations clearly before booking'
          ]
        },
        {
          title: 'Communication Best Practices',
          description: 'Maintain positive relationships with your tenants.',
          tips: [
            'Be responsive to tenant inquiries and concerns',
            'Provide clear house rules and expectations',
            'Address conflicts fairly and promptly',
            'Respect tenant privacy and quiet hours'
          ]
        },
        {
          title: 'Handling Issues',
          description: 'Resolve problems quickly to maintain tenant satisfaction.',
          tips: [
            'Have emergency contact procedures in place',
            'Maintain relationships with reliable service providers',
            'Document all maintenance requests and resolutions',
            'Follow up to ensure tenant satisfaction'
          ]
        }
      ]
    },
    {
      title: 'Financial Management',
      icon: DollarSign,
      color: 'green',
      topics: [
        {
          title: 'Payment Processing',
          description: 'Understand how payments work on our platform.',
          tips: [
            'Payments are processed securely through our platform',
            'Funds are transferred to your account after booking confirmation',
            'Keep track of all transactions in your dashboard',
            'Maintain records for tax purposes'
          ]
        },
        {
          title: 'Revenue Optimization',
          description: 'Maximize your rental income through strategic management.',
          tips: [
            'Maintain high occupancy rates through competitive pricing',
            'Offer incentives for longer-term bookings',
            'Keep your property well-maintained to justify premium pricing',
            'Monitor market trends and adjust pricing accordingly'
          ]
        },
        {
          title: 'Tax Considerations',
          description: 'Understand your tax obligations as a rental property owner.',
          tips: [
            'Keep detailed records of all rental income',
            'Track deductible expenses like maintenance and utilities',
            'Consult with a tax professional for advice',
            'File required tax returns on time'
          ]
        }
      ]
    }
  ];

  const bestPractices = [
    {
      icon: Star,
      title: 'Maintain High Standards',
      description: 'Keep your property clean, safe, and well-maintained to earn positive reviews and attract quality tenants.'
    },
    {
      icon: Clock,
      title: 'Be Responsive',
      description: 'Quick response times to inquiries and maintenance requests lead to higher tenant satisfaction and better reviews.'
    },
    {
      icon: Shield,
      title: 'Prioritize Safety',
      description: 'Ensure your property meets all safety requirements including fire safety, security measures, and emergency procedures.'
    },
    {
      icon: MessageSquare,
      title: 'Clear Communication',
      description: 'Set clear expectations, house rules, and maintain open communication channels with your tenants.'
    }
  ];

  const commonChallenges = [
    {
      challenge: 'Low Occupancy Rates',
      solutions: [
        'Review and adjust your pricing strategy',
        'Improve property photos and descriptions',
        'Add amenities that students value',
        'Ensure your property appears in relevant searches'
      ]
    },
    {
      challenge: 'Maintenance Issues',
      solutions: [
        'Establish relationships with reliable service providers',
        'Conduct regular property inspections',
        'Address issues promptly to prevent escalation',
        'Budget for ongoing maintenance costs'
      ]
    },
    {
      challenge: 'Difficult Tenants',
      solutions: [
        'Screen tenants thoroughly before approval',
        'Set clear expectations and house rules',
        'Document all communications and issues',
        'Know your rights and responsibilities as a landlord'
      ]
    },
    {
      challenge: 'Payment Delays',
      solutions: [
        'Use our secure payment processing system',
        'Set clear payment terms and deadlines',
        'Follow up on overdue payments promptly',
        'Consider requiring deposits for longer stays'
      ]
    }
  ];

  const resources = [
    {
      title: 'Landlord Dashboard',
      description: 'Access your property management tools, booking requests, and financial reports.',
      action: 'Go to Dashboard',
      onClick: () => setCurrentPage('dashboard')
    },
    {
      title: 'Verification Process',
      description: 'Learn about our property verification requirements and process.',
      action: 'Learn More',
      onClick: () => setCurrentPage('verification')
    },
    {
      title: 'Pricing Guidelines',
      description: 'Understand our pricing structure and commission rates.',
      action: 'View Pricing',
      onClick: () => setCurrentPage('pricing')
    },
    {
      title: 'Support Center',
      description: 'Get help with any questions or issues you may have.',
      action: 'Contact Support',
      onClick: () => setCurrentPage('contact')
    }
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Landlord Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive guide to successful property management on AffordHostel
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-16">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center space-x-3 mb-8">
                <div className={`w-12 h-12 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                  <section.icon className={`h-6 w-6 text-${section.color}-600`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.topics.map((topic, topicIndex) => (
                  <Card key={topicIndex} className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <ul className="space-y-2">
                      {topic.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Best Practices */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Best Practices for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestPractices.map((practice, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <practice.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{practice.title}</h3>
                <p className="text-gray-600 text-sm">{practice.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Challenges */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Common Challenges & Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonChallenges.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{item.challenge}</h3>
                </div>
                <ul className="space-y-2">
                  {item.solutions.map((solution, solutionIndex) => (
                    <li key={solutionIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={resource.onClick}>
                  {resource.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-16 p-8 text-center bg-gradient-to-r from-purple-600 to-teal-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Join hundreds of successful landlords on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setCurrentPage('list-property')}
              className="text-lg px-8 py-4"
            >
              List Your Property
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentPage('contact')}
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LandlordGuidePage;