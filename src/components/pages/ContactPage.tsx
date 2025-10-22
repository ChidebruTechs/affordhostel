import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, HelpCircle, Bug, Star } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleQuickSupport = (category: string) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category }));
    // Scroll to form
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Office',
      details: ['123 University Way', 'Nairobi, Kenya', 'P.O. Box 12345-00100'],
      color: 'purple'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+254 712 345 678', '+254 733 456 789', 'Mon-Fri: 8AM-6PM'],
      color: 'teal'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@affordhostel.com', 'support@affordhostel.com', 'Response within 24hrs'],
      color: 'orange'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8AM - 6PM', 'Saturday: 9AM - 4PM', 'Sunday: Closed'],
      color: 'green'
    }
  ];

  const supportCategories = [
    { 
      value: 'general', 
      label: 'General Inquiry', 
      icon: MessageSquare,
      description: 'General questions about our platform and services',
      color: 'blue'
    },
    { 
      value: 'booking', 
      label: 'Booking Support', 
      icon: CheckCircle,
      description: 'Help with bookings, payments, and reservations',
      color: 'green'
    },
    { 
      value: 'technical', 
      label: 'Technical Issue', 
      icon: Bug,
      description: 'Report bugs, website issues, or technical problems',
      color: 'red'
    },
    { 
      value: 'feedback', 
      label: 'Feedback', 
      icon: Star,
      description: 'Share your suggestions and feedback with us',
      color: 'yellow'
    }
  ];

  const faqs = [
    {
      question: 'How do I book a hostel?',
      answer: 'Simply browse our hostel listings, select your preferred accommodation, choose your dates, and complete the booking process with our secure payment system.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, bank transfers, and major credit/debit cards. All payments are processed securely through our platform.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking according to the cancellation policy of the specific hostel. Most hostels offer free cancellation up to 48 hours before check-in.'
    },
    {
      question: 'How do I become a verified landlord?',
      answer: 'To become a verified landlord, submit your property details, required documents, and wait for our verification team to review and approve your listing.'
    },
    {
      question: 'Is there customer support available?',
      answer: 'Yes, our customer support team is available Monday to Friday, 8AM to 6PM. You can reach us via phone, email, or through this contact form.'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for contacting us. We've received your message and will get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Reference ID:</strong> #MSG{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our platform? Need help with booking? Our team is here to assist you every step of the way.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} hover className="p-4 text-center">
              <div className={`w-16 h-16 bg-${info.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <info.icon className={`h-8 w-8 text-${info.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Support Categories */}
        <div className="mb-12">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Support</h2>
              <p className="text-gray-600">
                Choose a category for faster assistance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickSupport(category.value)}
                  className={`p-4 border-2 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer group ${
                    selectedCategory === category.value 
                      ? `border-${category.color}-500 bg-${category.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-${category.color}-200 transition-colors`}>
                      <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.label}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-6" id="contact-form">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                >
                  {supportCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief description of your inquiry"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Please provide details about your inquiry..."
                  required
                ></textarea>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Message...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                <p className="text-gray-600">
                  Quick answers to common questions about our platform.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Our Office</h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map coming soon</p>
                  <p className="text-sm text-gray-400">123 University Way, Nairobi</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;