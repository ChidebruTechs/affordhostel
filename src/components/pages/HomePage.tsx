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
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 text-white py-10 md:py-14 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Simplify Off-Campus
            <br />
            <span className="text-teal-300">Hostel Booking</span> in Kenya
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto text-purple-100 px-4">
            Find affordable, comfortable, and secure hostels near your university campus with our easy-to-use platform
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center px-4">
            <Button 
              size={window.innerWidth < 768 ? "md" : "lg"}
              variant="secondary"
              onClick={() => setCurrentPage('hostels')}
              className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
            >
              Browse Hostels
            </Button>
            <Button 
              size={window.innerWidth < 768 ? "md" : "lg"}
              variant="outline"
              onClick={() => setCurrentPage('signup')}
              className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-white text-white hover:bg-teal hover:text-purple-600 w-full sm:w-auto"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-14 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Choose AffordHostel?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We connect students, landlords, and agents in a secure, transparent ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} hover className="p-4 md:p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${feature.color}-100 mb-6`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-1 md:mb-2">1,200+</div>
              <div className="text-sm md:text-base text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-500 mb-1 md:mb-2">300+</div>
              <div className="text-sm md:text-base text-gray-600">Hostels</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-1 md:mb-2">50+</div>
              <div className="text-sm md:text-base text-gray-600">Verified Agents</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-1 md:mb-2">4.8</div>
              <div className="text-sm md:text-base text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 md:py-14 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Real feedback from students and landlords
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-4 md:p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="text-sm md:text-base font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 lg:py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Ready to Find Your Perfect Hostel?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 text-purple-100 px-4">
            Join thousands of students who have found their ideal accommodation through AffordHostel
          </p>
          <Button 
            size={window.innerWidth < 768 ? "md" : "lg"}
            variant="secondary"
            onClick={() => setCurrentPage('signup')}
            className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;