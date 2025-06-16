import React from 'react';
import { Users, Building, UserCheck, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const HomePage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const features = [
    {
      icon: Users,
      title: 'For Students',
      description: 'Find verified hostels with transparent pricing, amenities, and location details. Book with confidence.',
      color: 'purple'
    },
    {
      icon: Building,
      title: 'For Landlords',
      description: 'Reach thousands of students. Manage bookings, payments, and listings all in one place.',
      color: 'teal'
    },
    {
      icon: UserCheck,
      title: 'For Agents',
      description: 'Get verified to help students find quality accommodation and earn commissions.',
      color: 'orange'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Kamau',
      role: 'University of Nairobi Student',
      content: 'AffordHostel made finding my hostel so easy! The platform is user-friendly and I found a great place near campus.',
      rating: 5
    },
    {
      name: 'Mr. Ochieng',
      role: 'Landlord',
      content: 'As a landlord, this platform has helped me fill vacancies quickly and manage my properties efficiently.',
      rating: 5
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Simplify Off-Campus
            <br />
            <span className="text-teal-300">Hostel Booking</span> in Kenya
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100">
            Find affordable, comfortable, and secure hostels near your university campus with our easy-to-use platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setCurrentPage('hostels')}
              className="text-lg px-8 py-4"
            >
              Browse Hostels
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setCurrentPage('signup')}
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AffordHostel?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect students, landlords, and agents in a secure, transparent ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${feature.color}-100 mb-6`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1,200+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">300+</div>
              <div className="text-gray-600">Hostels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600">Verified Agents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from students and landlords
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Hostel?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students who have found their ideal accommodation through AffordHostel
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setCurrentPage('signup')}
            className="text-lg px-8 py-4"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;