import React from 'react';
import { ArrowLeft, BookOpen, Home, Users, Shield, DollarSign, Calendar, AlertTriangle, CheckCircle, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const StudentGuidePage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const sections = [
    {
      title: 'Before You Move',
      icon: BookOpen,
      color: 'purple',
      items: [
        {
          title: 'Research Your Options',
          description: 'Compare different hostels, read reviews, and check proximity to your university.',
          tips: [
            'Use our filter system to narrow down options',
            'Read student reviews carefully',
            'Check transport links to campus',
            'Consider your budget for the entire semester'
          ]
        },
        {
          title: 'Budget Planning',
          description: 'Plan your accommodation budget including rent, deposits, and additional costs.',
          tips: [
            'Factor in security deposits (usually 1-2 months rent)',
            'Budget for utilities if not included',
            'Consider meal plans or cooking facilities',
            'Set aside money for emergencies'
          ]
        },
        {
          title: 'Documentation',
          description: 'Prepare all necessary documents for your hostel application.',
          tips: [
            'Student ID and admission letter',
            'National ID or passport copy',
            'Parent/guardian contact information',
            'Medical insurance details'
          ]
        }
      ]
    },
    {
      title: 'Living in a Hostel',
      icon: Home,
      color: 'teal',
      items: [
        {
          title: 'Roommate Etiquette',
          description: 'Learn how to live harmoniously with your roommates.',
          tips: [
            'Respect personal space and belongings',
            'Communicate openly about issues',
            'Share common area responsibilities',
            'Be considerate with noise levels'
          ]
        },
        {
          title: 'Facility Usage',
          description: 'Make the most of your hostel amenities while being respectful.',
          tips: [
            'Follow kitchen and laundry schedules',
            'Keep common areas clean',
            'Report maintenance issues promptly',
            'Respect quiet hours and study time'
          ]
        },
        {
          title: 'Building Relationships',
          description: 'Create lasting friendships and support networks.',
          tips: [
            'Participate in hostel activities',
            'Form study groups with fellow residents',
            'Be open to meeting new people',
            'Respect cultural differences'
          ]
        }
      ]
    },
    {
      title: 'Safety & Security',
      icon: Shield,
      color: 'orange',
      items: [
        {
          title: 'Personal Safety',
          description: 'Keep yourself and your belongings safe.',
          tips: [
            'Always lock your room when leaving',
            'Don\'t share room keys or access codes',
            'Keep valuables in a secure place',
            'Be aware of your surroundings'
          ]
        },
        {
          title: 'Emergency Procedures',
          description: 'Know what to do in case of emergencies.',
          tips: [
            'Know emergency contact numbers',
            'Understand fire evacuation procedures',
            'Keep emergency contacts updated',
            'Report suspicious activities immediately'
          ]
        }
      ]
    },
    {
      title: 'Academic Success',
      icon: BookOpen,
      color: 'green',
      items: [
        {
          title: 'Study Environment',
          description: 'Create an environment conducive to academic success.',
          tips: [
            'Establish a study routine',
            'Use designated study areas',
            'Minimize distractions in your room',
            'Join or form study groups'
          ]
        },
        {
          title: 'Time Management',
          description: 'Balance academic work with social life.',
          tips: [
            'Create a daily schedule',
            'Set boundaries for social activities',
            'Use hostel quiet hours for studying',
            'Take advantage of library facilities'
          ]
        }
      ]
    }
  ];

  const emergencyContacts = [
    { service: 'Police', number: '999', description: 'For emergencies requiring immediate police response' },
    { service: 'Medical Emergency', number: '999', description: 'For medical emergencies and ambulance services' },
    { service: 'Fire Department', number: '999', description: 'For fire emergencies and rescue services' },
    { service: 'AffordHostel Support', number: '+254 712 345 678', description: 'For hostel-related emergencies and support' }
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Student Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive guide to successful hostel living and academic achievement
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center space-x-3 mb-8">
                <div className={`w-12 h-12 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                  <section.icon className={`h-6 w-6 text-${section.color}-600`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {section.items.map((item, itemIndex) => (
                  <Card key={itemIndex} className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <ul className="space-y-2">
                      {item.tips.map((tip, tipIndex) => (
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

        {/* Emergency Contacts */}
        <Card className="p-6 md:p-8 mt-12">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">Emergency Contacts</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Keep these important numbers handy for emergencies. Save them in your phone and keep a written copy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <Phone className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{contact.service}</h4>
                  <p className="text-2xl font-bold text-red-600 my-1">{contact.number}</p>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Support Section */}
        <Card className="p-6 md:p-8 mt-8 bg-gradient-to-r from-purple-600 to-teal-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Our support team is here to help you succeed in your hostel journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setCurrentPage('contact')}
              className="text-lg px-8 py-4"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentPage('hostels')}
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Browse Hostels
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentGuidePage;