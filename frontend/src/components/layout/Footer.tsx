import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', page: 'home' },
        { label: 'Browse Hostels', page: 'hostels' },
        { label: 'About Us', page: 'about' },
        { label: 'Contact', page: 'contact' }
      ]
    },
    {
      title: 'For Students',
      links: [
        { label: 'How to Book', page: 'how-to-book' },
        { label: 'Student Guide', page: 'student-guide' },
        { label: 'Payment Options', page: 'payment-options' },
        { label: 'Safety Tips', page: 'safety-tips' }
      ]
    },
    {
      title: 'For Landlords',
      links: [
        { label: 'List Your Property', page: 'list-property' },
        { label: 'Landlord Guide', page: 'landlord-guide' },
        { label: 'Verification Process', page: 'verification' },
        { label: 'Pricing Plans', page: 'pricing' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', page: 'help' },
        { label: 'FAQs', page: 'faqs' },
        { label: 'Privacy Policy', page: 'privacy' },
        { label: 'Terms of Service', page: 'terms' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Home className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AffordHostel</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Simplifying hostel booking for Kenyan university students since 2023. 
              Find affordable, safe, and comfortable accommodation near your campus.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300">info@affordhostel.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300">+254 712 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => setCurrentPage(link.page)}
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-200 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest hostel listings and special offers.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-r-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 bg-gray-700 hover:bg-teal-500 rounded-full flex items-center justify-center transition-colors duration-200 group"
              >
                <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </a>
            ))}
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2024 AffordHostel. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Made with ❤️ for Kenyan students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;