import React from 'react';
import { Users, Target, Heart, Award, CheckCircle, Calendar, TrendingUp, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AboutPage: React.FC = () => {
  const { setCurrentPage, setCurrentRole, isAuthenticated, companyInfo } = useApp();

  const handleJoinAsLandlord = () => {
    if (isAuthenticated) {
      // If user is already authenticated, switch to landlord role
      setCurrentRole('landlord');
      setCurrentPage('dashboard');
    } else {
      // If not authenticated, go to signup page with landlord role pre-selected
      setCurrentPage('signup');
    }
  };

  const stats = [
    { number: '1,200+', label: 'Students Served', icon: Users },
    { number: '300+', label: 'Verified Hostels', icon: Shield },
    { number: '50+', label: 'Partner Universities', icon: Award },
    { number: '4.8/5', label: 'Average Rating', icon: TrendingUp }
  ];

  const values = [
    {
      icon: Target,
      title: 'Transparency',
      description: 'We believe in honest pricing, clear terms, and transparent processes. No hidden fees, no surprises.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every hostel on our platform is verified for safety, security, and quality standards.',
      color: 'teal'
    },
    {
      icon: Heart,
      title: 'Student-Centric',
      description: 'Everything we do is designed with students in mind - from affordability to convenience.',
      color: 'orange'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a supportive community of students, landlords, and agents working together.',
      color: 'green'
    }
  ];

  const timeline = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'AffordHostel was founded with a simple mission: make hostel booking easier for Kenyan students.',
      milestone: 'Company Founded'
    },
    {
      year: '2023',
      title: 'First Partnerships',
      description: 'We partnered with 5 major universities and onboarded our first 50 verified hostels.',
      milestone: '50 Hostels Listed'
    },
    {
      year: '2023',
      title: 'Growing Community',
      description: 'Reached 500 registered students and introduced our agent verification program.',
      milestone: '500 Students'
    },
    {
      year: '2024',
      title: 'Platform Expansion',
      description: 'Launched mobile app and expanded to cover 15+ universities across Kenya.',
      milestone: 'Mobile App Launch'
    }
  ];

  const features = [
    'Verified hostel listings with real photos',
    'Transparent pricing with no hidden fees',
    'Secure online booking and payment',
    '24/7 customer support',
    'University-specific search filters',
    'Student reviews and ratings',
    'Mobile-friendly platform',
    'Agent verification program'
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            About AffordHostel
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100">
            Revolutionizing student accommodation in Kenya through technology, transparency, and trust
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <stat.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                {companyInfo.mission}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                {companyInfo.vision}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600">
              Born from personal experience, built with passion
            </p>
          </div>

          <Card className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                AffordHostel was born out of frustration. As university students in Nairobi, our founders 
                experienced firsthand the challenges of finding safe, affordable, and quality accommodation 
                near campus. The process was often opaque, time-consuming, and filled with unpleasant surprises.
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                After countless hours spent visiting questionable hostels, dealing with unreliable landlords, 
                and facing hidden fees, we realized that thousands of other students were going through the 
                same struggles. That's when the idea for AffordHostel was born.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to serve over 1,200 students across Kenya, working with 300+ verified 
                hostels and 50+ partner universities. Our platform has facilitated thousands of successful 
                bookings, helping students find their home away from home with confidence and ease.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} hover className="p-4 text-center">
                <div className={`w-16 h-16 bg-${value.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className={`h-8 w-8 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              Key milestones in our growth story
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1">
                  <Card className={`p-4 mb-4 md:mb-0 ${index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'}`}>
                    <div className="flex items-center mb-3">
                      <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-purple-600 font-semibold">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                      {item.milestone}
                    </div>
                  </Card>
                </div>
                <div className="w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10 my-2 md:my-0"></div>
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The passionate people behind AffordHostel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyInfo.team.map((member) => (
              <Card key={member.id} hover className="p-4 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              Comprehensive features designed for student success
            </p>
          </div>

          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Hostel?
          </h2>
          <p className="text-xl mb-6 text-purple-100">
            Join thousands of students who have found their ideal accommodation through AffordHostel
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-4"
              onClick={() => setCurrentPage('hostels')}
            >
              Browse Hostels
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600"
              onClick={handleJoinAsLandlord}
            >
              Join as Landlord
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;