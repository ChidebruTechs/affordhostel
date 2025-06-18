import React, { useState } from 'react';
import { Star, MapPin, Wifi, Car, Dumbbell, Book, Shield, Heart, Share2, Calendar, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const HostelDetailPage: React.FC = () => {
  const { setCurrentPage, hostels } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  // For demo purposes, using the first hostel
  const hostel = hostels[0];

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Gym': Dumbbell,
    'Study Area': Book,
    '24/7 Security': Shield,
    'Laundry': Users,
    'Swimming Pool': Users,
    'Cafeteria': Users
  };

  const reviews = [
    {
      id: 1,
      name: 'John Mwangi',
      avatar: 'JM',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Great hostel with clean facilities and friendly staff. The location is perfect for university students. WiFi is reliable and the study area is well-equipped.',
      helpful: 12
    },
    {
      id: 2,
      name: 'Grace Akinyi',
      avatar: 'GA',
      rating: 4,
      date: '1 month ago',
      comment: 'The study area is well-equipped and quiet. Internet is reliable which is great for online classes. Only issue is the laundry can get crowded during weekends.',
      helpful: 8
    },
    {
      id: 3,
      name: 'Michael Ochieng',
      avatar: 'MO',
      rating: 5,
      date: '2 months ago',
      comment: 'Excellent security and the rooms are spacious. The management is very responsive to any issues. Would definitely recommend to other students.',
      helpful: 15
    }
  ];

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return hostel.roomTypes[selectedRoomType].price * months;
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('hostels')}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Hostels</span>
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={hostel.images[selectedImage]}
                alt={hostel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {hostel.images.slice(1, 4).map((image, index) => (
              <div
                key={index + 1}
                className={`h-24 lg:h-[156px] rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedImage === index + 1 ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedImage(index + 1)}
              >
                <img
                  src={image}
                  alt={`${hostel.name} ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hostel Info */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hostel.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hostel.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{hostel.rating}</span>
                      <span>({hostel.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    Ksh {hostel.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {hostel.description}
              </p>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hostel.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-teal-600" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Room Types */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Room Types</h3>
              <div className="space-y-4">
                {hostel.roomTypes.map((room, index) => (
                  <div
                    key={index}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRoomType === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRoomType(index)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{room.type}</h4>
                        <p className="text-gray-600">{room.available} of {room.total} available</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          Ksh {room.price.toLocaleString()}
                        </div>
                        <div className="text-gray-600">per month</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Location */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Location</h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map coming soon</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{hostel.location} - Walking distance to campus</span>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{hostel.rating}</span>
                  <span className="text-gray-600">({hostel.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">View All Reviews</Button>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Book Your Stay</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              {/* Pricing Breakdown */}
              {checkIn && checkOut && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Room Type:</span>
                      <span>{hostel.roomTypes[selectedRoomType].type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Rate:</span>
                      <span>Ksh {hostel.roomTypes[selectedRoomType].price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24 * 30))} months</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>Ksh {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Free cancellation up to 48 hours before check-in
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage;