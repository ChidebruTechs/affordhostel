import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Phone, AlertTriangle, CheckCircle, Users, Home, Clock, MapPin, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const SafetyTipsPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const safetyCategories = [
    {
      title: 'Personal Safety',
      icon: Shield,
      color: 'red',
      tips: [
        {
          title: 'Always Lock Your Room',
          description: 'Never leave your room unlocked, even for short periods. This is your first line of defense against theft.',
          icon: Lock
        },
        {
          title: 'Don\'t Share Keys or Codes',
          description: 'Keep your room keys and access codes private. Don\'t lend them to friends or roommates.',
          icon: Eye
        },
        {
          title: 'Be Aware of Surroundings',
          description: 'Stay alert when walking around the hostel, especially at night. Trust your instincts if something feels wrong.',
          icon: Eye
        },
        {
          title: 'Keep Emergency Contacts Handy',
          description: 'Save important numbers in your phone and keep a written copy in your room.',
          icon: Phone
        }
      ]
    },
    {
      title: 'Property Security',
      icon: Home,
      color: 'blue',
      tips: [
        {
          title: 'Secure Valuables',
          description: 'Use a lockbox or safe for important documents, cash, and expensive items like laptops and phones.',
          icon: Lock
        },
        {
          title: 'Don\'t Display Wealth',
          description: 'Avoid showing off expensive items or large amounts of cash to prevent becoming a target.',
          icon: Eye
        },
        {
          title: 'Mark Your Belongings',
          description: 'Label your items with your name and contact information to help recover them if lost.',
          icon: CheckCircle
        },
        {
          title: 'Take Photos of Valuables',
          description: 'Keep photos and serial numbers of expensive items for insurance and police reports.',
          icon: Camera
        }
      ]
    },
    {
      title: 'Social Safety',
      icon: Users,
      color: 'green',
      tips: [
        {
          title: 'Get to Know Your Neighbors',
          description: 'Build relationships with fellow residents. They can watch out for you and your belongings.',
          icon: Users
        },
        {
          title: 'Verify Visitors',
          description: 'Don\'t let strangers into the building. Always verify visitors with the person they\'re visiting.',
          icon: CheckCircle
        },
        {
          title: 'Report Suspicious Activity',
          description: 'Immediately report any suspicious behavior or unknown individuals to hostel management.',
          icon: AlertTriangle
        },
        {
          title: 'Travel in Groups at Night',
          description: 'When possible, walk with friends or roommates, especially during late hours.',
          icon: Users
        }
      ]
    },
    {
      title: 'Emergency Preparedness',
      icon: AlertTriangle,
      color: 'orange',
      tips: [
        {
          title: 'Know Emergency Exits',
          description: 'Familiarize yourself with all emergency exits and evacuation routes in your hostel.',
          icon: MapPin
        },
        {
          title: 'Keep Emergency Kit',
          description: 'Maintain a basic emergency kit with flashlight, first aid supplies, and emergency contacts.',
          icon: CheckCircle
        },
        {
          title: 'Stay Connected',
          description: 'Keep your phone charged and inform someone of your whereabouts when going out.',
          icon: Phone
        },
        {
          title: 'Know Fire Safety Procedures',
          description: 'Understand fire alarm signals and evacuation procedures. Never ignore fire alarms.',
          icon: AlertTriangle
        }
      ]
    }
  ];

  const redFlags = [
    'Hostels without proper security measures (no guards, CCTV, or secure entry)',
    'Landlords who refuse to provide proper documentation or contracts',
    'Requests for full payment upfront without viewing the property',
    'Hostels in areas known for high crime rates',
    'No emergency contact information or procedures',
    'Poor lighting in common areas and around the building',
    'Broken locks, windows, or security systems',
    'Landlords who pressure you to make quick decisions'
  ];

  const emergencyNumbers = [
    { service: 'Police Emergency', number: '999', description: 'For immediate police assistance' },
    { service: 'Medical Emergency', number: '999', description: 'For ambulance and medical emergencies' },
    { service: 'Fire Emergency', number: '999', description: 'For fire and rescue services' },
    { service: 'Gender-Based Violence Helpline', number: '1195', description: 'For GBV support and assistance' },
    { service: 'AffordHostel Emergency', number: '+254 712 345 678', description: 'For hostel-related emergencies' }
  ];

  const safetyChecklist = [
    'Hostel has 24/7 security guards',
    'CCTV cameras in common areas',
    'Secure entry system (key cards/codes)',
    'Well-lit corridors and outdoor areas',
    'Fire safety equipment (extinguishers, alarms)',
    'Emergency evacuation plan posted',
    'Secure parking area (if needed)',
    'Reliable communication with management',
    'Safe neighborhood location',
    'Proper documentation and contracts'
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Safety Tips</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your safety is our priority. Follow these essential tips to stay safe while living in student accommodation.
          </p>
        </div>

        {/* Safety Categories */}
        <div className="space-y-12 mb-16">
          {safetyCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center space-x-3 mb-8">
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                  <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.tips.map((tip, tipIndex) => (
                  <Card key={tipIndex} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <tip.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Red Flags */}
        <Card className="p-6 md:p-8 mb-12 border-red-200 bg-red-50">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-red-900">Red Flags to Watch Out For</h2>
          </div>
          <p className="text-red-800 mb-6">
            Be cautious and avoid hostels or situations that show these warning signs:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-800 text-sm">{flag}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Safety Checklist */}
        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hostel Safety Checklist</h2>
          <p className="text-gray-600 mb-6">
            Use this checklist when evaluating potential hostels to ensure they meet basic safety standards:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyChecklist.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Emergency Contacts */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Phone className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Emergency Contacts</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Save these important numbers in your phone and keep a written copy in your room:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyNumbers.map((contact, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{contact.service}</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">{contact.number}</p>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-6 md:p-8 text-center bg-gradient-to-r from-purple-600 to-teal-600 text-white">
          <Shield className="h-16 w-16 mx-auto mb-4 text-white" />
          <h2 className="text-3xl font-bold mb-4">Your Safety Matters</h2>
          <p className="text-xl mb-6 text-purple-100">
            Choose verified hostels with proper safety measures for peace of mind
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setCurrentPage('hostels')}
              className="text-lg px-8 py-4"
            >
              Browse Safe Hostels
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentPage('contact')}
              className="text-lg px-8 py-4 border-white text-white hover:bg-teal hover:text-purple-600"
            >
              Report Safety Concerns
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SafetyTipsPage;