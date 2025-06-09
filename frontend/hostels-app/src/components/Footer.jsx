import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { HiHome, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="text-white py-10 px-6 md:px-16" style={{ backgroundColor: '#2c2c2c' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
     
        <div>
          <div className="flex items-center mb-4 space-x-2">
            <HiHome className="text-teal-400 text-2xl" />
            <span className="text-xl font-bold">AffordHostel</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Simplifying hostel booking for Kenyan university students since 2023.
          </p>
          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
              <div key={index} className="bg-gray-700 hover:bg-teal-500 p-2 rounded-full transition">
                <Icon className="text-white text-sm" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-teal-400 font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/hostels">Hostels</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-teal-400 font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/help-center">Help Center</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-teal-400 font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <HiMail className="text-teal-400" />
              info@affordhostel.com
            </li>
            <li className="flex items-center gap-2">
              <HiPhone className="text-teal-400" />
              +254 712 345 678
            </li>
            <li className="flex items-center gap-2">
              <HiLocationMarker className="text-teal-400" />
              Nairobi, Kenya
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-8 border-gray-700" />

      <p className="text-center text-sm text-gray-400">
        © 2023 AffordHostel. All rights reserved.
      </p>
    </footer>
  );
}
