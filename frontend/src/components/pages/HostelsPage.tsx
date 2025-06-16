import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

const HostelsPage: React.FC = () => {
  const { hostels, setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');

  const universities = ['University of Nairobi', 'Kenyatta University', 'JKUAT', 'Mount Kenya University'];

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniversity = !selectedUniversity || hostel.university === selectedUniversity;
    return matchesSearch && matchesUniversity;
  });

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Hostels</h1>
            <p className="text-gray-600">Find your perfect accommodation near campus</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search hostels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full sm:w-64"
              />
            </div>
            
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Universities</option>
              {universities.map(uni => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHostels.map((hostel) => (
            <Card key={hostel.id} hover className="overflow-hidden">
              <div 
                className="h-48 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${hostel.images[0]})` }}
              >
                <div className="h-full bg-black bg-opacity-20 flex items-end justify-end p-4">
                  <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{hostel.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{hostel.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{hostel.location}</span>
                </div>
                
                <div className="text-2xl font-bold text-purple-600 mb-4">
                  Ksh {hostel.price.toLocaleString()}/month
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hostel.amenities.slice(0, 3).map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hostel.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{hostel.amenities.length - 3} more
                    </span>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentPage('hostel-detail')}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline">Previous</Button>
            <Button>1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelsPage;