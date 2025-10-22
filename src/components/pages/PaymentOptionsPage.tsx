import React from 'react';
import { ArrowLeft, Smartphone, CreditCard, Building, Shield, CheckCircle, AlertTriangle, Clock, DollarSign, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const PaymentOptionsPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const paymentMethods = [
    {
      name: 'M-Pesa',
      icon: Smartphone,
      color: 'green',
      description: 'Kenya\'s leading mobile money service',
      features: [
        'Instant payment processing',
        'No additional fees',
        'Available 24/7',
        'Secure STK Push technology',
        'Automatic receipt generation'
      ],
      howTo: [
        'Select M-Pesa as payment method',
        'Enter your M-Pesa phone number',
        'Confirm payment amount',
        'Enter your M-Pesa PIN when prompted',
        'Receive confirmation SMS'
      ],
      fees: 'No additional fees',
      processingTime: 'Instant'
    },
    {
      name: 'PayPal',
      icon: CreditCard,
      color: 'blue',
      description: 'International payment platform',
      features: [
        'Secure international payments',
        'Buyer protection',
        'Multiple currency support',
        'Easy refund process',
        'Mobile app integration'
      ],
      howTo: [
        'Select PayPal as payment method',
        'Log in to your PayPal account',
        'Review payment details',
        'Confirm payment',
        'Receive email confirmation'
      ],
      fees: '2.9% + KSh 30 per transaction',
      processingTime: '1-2 minutes'
    },
    {
      name: 'Bank Transfer',
      icon: Building,
      color: 'purple',
      description: 'Direct bank-to-bank transfer',
      features: [
        'Traditional banking method',
        'Large amount transfers',
        'Bank-level security',
        'Detailed transaction records',
        'Available at all banks'
      ],
      howTo: [
        'Get our bank account details',
        'Visit your bank or use mobile banking',
        'Transfer the exact amount',
        'Send payment confirmation',
        'Wait for verification (1-2 business days)'
      ],
      fees: 'Bank charges apply',
      processingTime: '1-2 business days'
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: 'SSL Encryption',
      description: 'All payment data is encrypted using industry-standard SSL technology'
    },
    {
      icon: Shield,
      title: 'PCI Compliance',
      description: 'We follow Payment Card Industry security standards for safe transactions'
    },
    {
      icon: CheckCircle,
      title: 'Verified Merchants',
      description: 'All landlords are verified before they can receive payments'
    },
    {
      icon: AlertTriangle,
      title: 'Fraud Protection',
      description: 'Advanced fraud detection systems monitor all transactions'
    }
  ];

  const paymentTips = [
    {
      title: 'Verify Payment Details',
      description: 'Always double-check the amount, hostel name, and booking dates before confirming payment.',
      icon: CheckCircle
    },
    {
      title: 'Keep Payment Records',
      description: 'Save all payment confirmations, receipts, and transaction IDs for your records.',
      icon: DollarSign
    },
    {
      title: 'Pay on Time',
      description: 'Make payments by the due date to avoid late fees and secure your booking.',
      icon: Clock
    },
    {
      title: 'Use Secure Networks',
      description: 'Always make payments using secure, private internet connections.',
      icon: Shield
    }
  ];

  const faqs = [
    {
      question: 'Is it safe to pay online?',
      answer: 'Yes, we use bank-level security with SSL encryption and fraud protection. Your payment information is never stored on our servers.'
    },
    {
      question: 'Can I get a refund if I cancel?',
      answer: 'Refund policies depend on the hostel\'s cancellation terms. Most hostels offer full refunds for cancellations made 48+ hours before check-in.'
    },
    {
      question: 'What if my payment fails?',
      answer: 'If a payment fails, you can try again immediately. For persistent issues, contact our support team for assistance.'
    },
    {
      question: 'Do you accept international cards?',
      answer: 'Yes, we accept international credit and debit cards through PayPal. Local cards can also be used through M-Pesa.'
    },
    {
      question: 'When will I be charged?',
      answer: 'Payment is processed immediately upon booking confirmation. You\'ll receive an instant receipt and booking confirmation.'
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Payment Options</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our secure payment methods to book your hostel accommodation
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-8 mb-16">
          {paymentMethods.map((method, index) => (
            <Card key={index} className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 bg-${method.color}-100 rounded-xl flex items-center justify-center`}>
                    <method.icon className={`h-10 w-10 text-${method.color}-600`} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.name}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                      <ul className="space-y-2">
                        {method.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">How to Pay</h4>
                      <ol className="space-y-2">
                        {method.howTo.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2">
                            <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700 text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Fees: {method.fees}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Processing: {method.processingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Security Features */}
        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Security & Protection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Tips */}
        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Payment Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tip.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* FAQs */}
        <Card className="p-6 md:p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-6 md:p-8 text-center bg-gradient-to-r from-purple-600 to-teal-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Hostel?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Choose your payment method and secure your accommodation today
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

export default PaymentOptionsPage;