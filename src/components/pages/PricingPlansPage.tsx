import React from 'react';
import { ArrowLeft, DollarSign, CheckCircle, Star, TrendingUp, Shield, Users, Camera, BarChart3, MessageSquare, Clock, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const PricingPlansPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const pricingModel = {
    commission: '5%',
    description: 'We only earn when you earn - no upfront costs or hidden fees',
    calculation: 'Commission is calculated on successful bookings only'
  };

  const includedServices = [
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'High-quality photos of your property to attract more bookings',
      value: 'Worth Ksh 5,000'
    },
    {
      icon: Star,
      title: 'Premium Listing',
      description: 'Featured placement in search results and category pages',
      value: 'Worth Ksh 3,000/month'
    },
    {
      icon: Shield,
      title: 'Secure Payment Processing',
      description: 'Safe and reliable payment handling with fraud protection',
      value: 'Worth Ksh 2,000/month'
    },
    {
      icon: MessageSquare,
      title: '24/7 Customer Support',
      description: 'Dedicated support for you and your tenants',
      value: 'Worth Ksh 1,500/month'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Detailed insights on bookings, revenue, and performance',
      value: 'Worth Ksh 1,000/month'
    },
    {
      icon: Users,
      title: 'Tenant Screening',
      description: 'Verified student profiles and background checks',
      value: 'Worth Ksh 500/booking'
    }
  ];

  const comparisonData = [
    {
      feature: 'Listing Fee',
      affordHostel: 'Free',
      traditional: 'Ksh 2,000-5,000',
      competitors: 'Ksh 1,000-3,000'
    },
    {
      feature: 'Commission Rate',
      affordHostel: '5%',
      traditional: 'N/A',
      competitors: '8-15%'
    },
    {
      feature: 'Photography',
      affordHostel: 'Included',
      traditional: 'Ksh 5,000+',
      competitors: 'Extra cost'
    },
    {
      feature: 'Marketing',
      affordHostel: 'Included',
      traditional: 'Self-managed',
      competitors: 'Limited'
    },
    {
      feature: 'Payment Processing',
      affordHostel: 'Secure & Free',
      traditional: 'Manual/Risky',
      competitors: '2-3% extra'
    },
    {
      feature: 'Customer Support',
      affordHostel: '24/7',
      traditional: 'None',
      competitors: 'Business hours'
    }
  ];

  const revenueExample = {
    monthlyRent: 15000,
    occupancyRate: 85,
    roomsAvailable: 20,
    monthsPerYear: 12
  };

  const calculateRevenue = () => {
    const monthlyRevenue = revenueExample.monthlyRent * revenueExample.roomsAvailable * (revenueExample.occupancyRate / 100);
    const annualRevenue = monthlyRevenue * revenueExample.monthsPerYear;
    const commission = annualRevenue * 0.05;
    const netRevenue = annualRevenue - commission;
    
    return {
      monthlyRevenue,
      annualRevenue,
      commission,
      netRevenue
    };
  };

  const revenue = calculateRevenue();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increased Occupancy',
      description: 'Our platform helps you achieve 85%+ occupancy rates through targeted marketing to verified students',
      impact: '+25% average occupancy increase'
    },
    {
      icon: Clock,
      title: 'Faster Bookings',
      description: 'Streamlined booking process reduces vacancy periods and gets your rooms filled quickly',
      impact: '50% faster booking times'
    },
    {
      icon: Shield,
      title: 'Reduced Risk',
      description: 'Verified tenants and secure payments minimize the risk of defaults and property damage',
      impact: '90% reduction in payment issues'
    },
    {
      icon: Award,
      title: 'Premium Positioning',
      description: 'Verified properties command higher rents and attract quality tenants willing to pay premium rates',
      impact: '+15% higher rental rates'
    }
  ];

  const faqs = [
    {
      question: 'When do I pay the commission?',
      answer: 'Commission is only charged when you receive a successful booking payment. No bookings = no commission.'
    },
    {
      question: 'Are there any setup or listing fees?',
      answer: 'No, listing your property is completely free. We only earn when you earn through successful bookings.'
    },
    {
      question: 'What happens if a tenant cancels?',
      answer: 'If a tenant cancels before check-in, no commission is charged. Commission is only applied to completed bookings.'
    },
    {
      question: 'How is the commission calculated?',
      answer: 'Commission is 5% of the total booking value (rent amount paid by the tenant), calculated automatically.'
    },
    {
      question: 'Can I change my pricing anytime?',
      answer: 'Yes, you have full control over your pricing and can adjust rates anytime through your dashboard.'
    },
    {
      question: 'What payment methods do you support?',
      answer: 'We support M-Pesa, bank transfers, and other secure payment methods for both tenants and landlords.'
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent pricing that grows with your success. No hidden fees, no upfront costs.
          </p>
        </div>

        {/* Main Pricing Card */}
        <Card className="p-8 mb-12 text-center bg-gradient-to-r from-purple-600 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">One Simple Rate</h2>
            <div className="text-8xl font-bold mb-4">{pricingModel.commission}</div>
            <p className="text-2xl mb-6 text-purple-100">{pricingModel.description}</p>
            <p className="text-lg text-purple-200 mb-8">{pricingModel.calculation}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">No Setup Fees</h3>
                <p className="text-purple-100 text-sm">List your property completely free with no upfront costs</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Pay on Success</h3>
                <p className="text-purple-100 text-sm">Commission only applies to confirmed, paid bookings</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">All Services Included</h3>
                <p className="text-purple-100 text-sm">Photography, marketing, support - everything included</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Included Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedServices.map((service, index) => (
              <Card key={index} className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-3 text-sm">{service.description}</p>
                <span className="text-green-600 font-medium text-sm">{service.value}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Revenue Calculator */}
        <Card className="p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Revenue Example</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly rent per room:</span>
                    <span className="font-medium">Ksh {revenueExample.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of rooms:</span>
                    <span className="font-medium">{revenueExample.roomsAvailable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average occupancy:</span>
                    <span className="font-medium">{revenueExample.occupancyRate}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Revenue</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross annual revenue:</span>
                    <span className="font-medium">Ksh {revenue.annualRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AffordHostel commission (5%):</span>
                    <span className="font-medium text-purple-600">Ksh {revenue.commission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-900 font-semibold">Your net revenue:</span>
                    <span className="font-bold text-green-600 text-lg">Ksh {revenue.netRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How We Compare</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-purple-600">AffordHostel</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Traditional Listing</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Other Platforms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {row.affordHostel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{row.traditional}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{row.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Landlords Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {benefit.impact}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <Card className="p-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of landlords earning consistent income with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setCurrentPage('list-property')}
              className="text-lg px-8 py-4"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Start Earning Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setCurrentPage('contact')}
              className="text-lg px-8 py-4"
            >
              Have Questions? Contact Us
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PricingPlansPage;