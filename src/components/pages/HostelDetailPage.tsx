import React, { useState } from 'react';
import { Star, MapPin, Wifi, Car, Dumbbell, Book, Shield, Heart, Share2, Calendar, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CheckoutPage from './CheckoutPage';

const HostelDetailPage: React.FC = () => {
  const { setCurrentPage, hostels, isAuthenticated, addToWishlist, removeFromWishlist, isInWishlist, addReview, getHostelReviews } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // For demo purposes, using the first hostel
  const hostel = hostels[0];
  const reviews = getHostelReviews(hostel.id);
  const inWishlist = isInWishlist(hostel.id);

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

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return hostel.roomTypes[selectedRoomType].price * months;
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(hostel.id);
    } else {
      addToWishlist(hostel.id);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const duration = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    const bookingData = {
      hostelId: hostel.id,
      hostelName: hostel.name,
      roomType: hostel.roomTypes[selectedRoomType].type,
      checkIn,
      checkOut,
      amount: calculateTotal(),
      duration
    };

    setShowCheckout(true);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    addReview(hostel.id, newReview.rating, newReview.comment);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  if (showCheckout) {
    const duration = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    const bookingData = {
      hostelId: hostel.id,
      hostelName: hostel.name,
      roomType: hostel.roomTypes[selectedRoomType].type,
      checkIn,
      checkOut,
      amount: calculateTotal(),
      duration
    };

    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CheckoutPage 
            bookingData={bookingData}
            onBack={() => setShowCheckout(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('hostels')}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Hostels</span>
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
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
                <button 
                  onClick={handleWishlistToggle}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hostel Info */}
            <Card className="p-6">
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
                      <span>({reviews.length} reviews)</span>
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
            <Card className="p-6">
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
            <Card className="p-6">
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
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{hostel.rating}</span>
                    <span className="text-gray-600">({reviews.length} reviews)</span>
                  </div>
                  {isAuthenticated && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      Write Review
                    </Button>
                  )}
                </div>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <Card className="p-4 mb-4 bg-purple-50 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              star <= newReview.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Share your experience with this hostel..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                    <Button variant="outline" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                        {review.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
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
                              <span className="text-gray-500 text-sm">{review.createdAt.toLocaleDateString()}</span>
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
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Book Your Stay</h3>
              
              <div className="space-y-3 mb-4">
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
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
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

              <div className="space-y-2">
                <Button className="w-full" onClick={handleBookNow}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full" onClick={handleWishlistToggle}>
                  <Heart className={`h-4 w-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              <div className="mt-4 text-center">
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