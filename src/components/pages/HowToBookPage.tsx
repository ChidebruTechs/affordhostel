import React from 'react';
import { ArrowLeft, Search, Calendar, CreditCard, CheckCircle, MapPin, Star, Users, Shield, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const HowToBookPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const steps = [
    {
      number: 1,
      title: 'Browse Hostels',
      description: 'Search for hostels near your university using our filters',
      icon: Search,
      details: [
        'Use location filters to find hostels near your campus',
        'Filter by price range, amenities, and room types',
        'Read reviews from other students',
        'View detailed photos and descriptions'
      ]
    },
    {
      number: 2,
      title: 'Select Your Room',
      description: 'Choose the perfect room type that fits your needs',
      icon: Users,
      details: [
        'Compare different room types and prices',
        'Check availability for your preferred dates',
        'Review included amenities and features',
        'Consider proximity to campus and facilities'
      ]
    },
    {
      number: 3,
      title: 'Book & Pay',
      description: 'Secure your booking with our safe payment system',
      icon: CreditCard,
      details: [
        'Fill in your booking details and dates',
        'Choose your preferred payment method',
        'Pay securely using M-Pesa or other options',
        'Receive instant booking confirmation'
      ]
    },
    {
      number: 4,
      title: 'Move In',
      description: 'Get ready to move into your new home away from home',
      icon: CheckCircle,
      details: [
        'Receive check-in instructions via email',
        'Contact the landlord to arrange key collection',
        'Complete any required documentation',
        'Enjoy your comfortable student accommodation'
      ]
    }
  ];

  const tips = [
    {
      icon: Clock,
      title: 'Book Early',
      description: 'Popular hostels fill up quickly, especially at the start of semesters. Book as early as possible to secure your preferred choice.'
    },
    {
      icon: MapPin,
      title: 'Consider Location',
      description: 'Choose hostels within walking distance or with good transport links to your university to save time and money.'
    },
    {
      icon: Star,
      title: 'Read Reviews',
      description: 'Check reviews from previous students to get honest feedback about the hostel facilities and management.'
    },
    {
      icon: Shield,
      title: 'Verify Safety',
      description: 'Ensure the hostel has proper security measures like CCTV, security guards, and secure entry systems.'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How to Book a Hostel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow our simple 4-step process to find and book your perfect student accommodation
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="p-6 md:p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Booking Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tip.icon className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-6 md:p-8 text-center bg-gradient-to-r from-purple-600 to-teal-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Hostel?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Browse our verified hostels and book your accommodation today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setCurrentPage('hostels')}
              className="text-lg px-8 py-4"
            >
              Browse Hostels
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentPage('signup')}
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HowToBookPage;