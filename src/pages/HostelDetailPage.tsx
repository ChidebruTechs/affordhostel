import React, { useState, useEffect } from 'react';
import { Star, MapPin, Wifi, Car, Dumbbell, Book, Shield, Heart, Share2, Calendar, Users, CheckCircle, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CheckoutPage from './CheckoutPage';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';

interface RoomType {
  id: string;
  type: string;
  price: number;
  total: number;
  features: string[];
  description: string;
}

interface Hostel {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  university: string;
  amenities: string[];
  images: string[];
  landlord_id: string;
  verified: boolean;
  verification_status: string;
  assigned_agent_id: string | null;
  created_at: string;
  updated_at: string;
  rating: number;
  roomTypes: RoomType[];
  landlord_name?: string;
  landlord_phone?: string;
  landlord_email?: string;
}

interface Review {
  id: string;
  hostel_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar?: string;
}

const HostelDetailPage: React.FC = () => {
  const { setCurrentPage, isAuthenticated, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landlord, setLandlord] = useState<any>(null);

  // Get hostel ID from URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch hostel data from Supabase
  useEffect(() => {
    const fetchHostelData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch hostel data
        const { data: hostelData, error: hostelError } = await supabase
          .from('hostels')
          .select('*')
          .eq('id', id)
          .single();

        if (hostelError) throw hostelError;

        if (hostelData) {
          // Fetch room types for this hostel
          const { data: roomTypesData, error: roomTypesError } = await supabase
            .from('room_types')
            .select('*')
            .eq('hostel_id', id);

          if (roomTypesError) throw roomTypesError;

          // Fetch landlord info
          const { data: landlordData, error: landlordError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', hostelData.landlord_id)
            .single();

          // Calculate rating from reviews
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select(`
              *,
              profiles:user_id (name, avatar_url)
            `)
            .eq('hostel_id', id)
            .order('created_at', { ascending: false });

          if (reviewsError) console.error('Error fetching reviews:', reviewsError);

          // Transform reviews data
          const transformedReviews = (reviewsData || []).map(review => ({
            id: review.id,
            hostel_id: review.hostel_id,
            user_id: review.user_id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user_name: review.profiles?.name || 'Anonymous',
            user_avatar: review.profiles?.avatar_url
          }));

          // Calculate average rating
          const avgRating = transformedReviews.length > 0
            ? transformedReviews.reduce((sum, review) => sum + review.rating, 0) / transformedReviews.length
            : Math.random() * 2 + 3; // Fallback to random 3-5 if no reviews

          // Transform hostel data
          const transformedHostel: Hostel = {
            ...hostelData,
            rating: parseFloat(avgRating.toFixed(1)),
            roomTypes: roomTypesData || [],
            landlord_name: landlordData?.name || 'Landlord',
            landlord_phone: landlordData?.phone,
            landlord_email: landlordData?.email
          };

          setHostel(transformedHostel);
          setReviews(transformedReviews);
          setLandlord(landlordData);
        }
      } catch (err: any) {
        console.error('Error fetching hostel data:', err);
        setError('Failed to load hostel details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHostelData();
  }, [id]);

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Gym': Dumbbell,
    'Study Area': Book,
    '24/7 Security': Shield,
    'Laundry': Users,
    'Swimming Pool': Users,
    'Cafeteria': Users,
    'Kitchen': Users,
    'Garden': Users,
    'CCTV': Shield,
    'Generator': Shield
  };

  const calculateTotal = () => {
    if (!hostel || !checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return hostel.roomTypes[selectedRoomType].price * months;
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated || !hostel) {
      setCurrentPage('login');
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCurrentPage('login');
        return;
      }

      if (isInWishlist(hostel.id)) {
        // Remove from wishlist in Supabase
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .match({ user_id: user.id, hostel_id: hostel.id });

        if (!error) {
          removeFromWishlist(hostel.id);
        }
      } else {
        // Add to wishlist in Supabase
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            hostel_id: hostel.id
          });

        if (!error) {
          addToWishlist(hostel.id);
        }
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const handleBookNow = () => {
    if (!hostel || !isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setShowCheckout(true);
  };

  const handleSubmitReview = async () => {
    if (!hostel || !isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCurrentPage('login');
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      // Submit review to Supabase
      const { data: reviewData, error } = await supabase
        .from('reviews')
        .insert({
          hostel_id: hostel.id,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment
        })
        .select()
        .single();

      if (error) throw error;

      // Add new review to local state
      const newReviewData: Review = {
        id: reviewData.id,
        hostel_id: reviewData.hostel_id,
        user_id: reviewData.user_id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        created_at: reviewData.created_at,
        user_name: profile?.name || 'Anonymous'
      };

      setReviews(prev => [newReviewData, ...prev]);
      
      // Update hostel rating
      if (hostel) {
        const newAvgRating = [...reviews, newReviewData].reduce((sum, r) => sum + r.rating, 0) / (reviews.length + 1);
        setHostel(prev => prev ? { ...prev, rating: parseFloat(newAvgRating.toFixed(1)) } : null);
      }

      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting review:', err);
      alert(`Failed to submit review: ${err.message}`);
    }
  };

  const handleShare = async () => {
    if (!hostel) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: hostel.name,
          text: `Check out ${hostel.name} on AffordHostel - ${hostel.description.substring(0, 100)}...`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (showCheckout && hostel) {
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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading hostel details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <div className="text-red-400 mb-4">
              <ArrowLeft className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Hostel not found'}
            </h3>
            <p className="text-gray-600 mb-6">
              The hostel you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/hostels')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hostels
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(hostel.id);

  // Set default check-in/out dates (1 month from now)
  const defaultCheckIn = new Date();
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setMonth(defaultCheckOut.getMonth() + 1);

  const defaultCheckInStr = defaultCheckIn.toISOString().split('T')[0];
  const defaultCheckOutStr = defaultCheckOut.toISOString().split('T')[0];

  if (!checkIn) setCheckIn(defaultCheckInStr);
  if (!checkOut) setCheckOut(defaultCheckOutStr);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hostels')}
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
                src={hostel.images[selectedImage] || 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                alt={hostel.name}
                className="w-full h-full object-cover"
              />
              {hostel.verified && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verified Hostel
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={handleShare}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                >
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
            {hostel.images.length === 1 && (
              <div className="h-24 lg:h-[156px] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No additional images</p>
              </div>
            )}
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

              {/* Contact Landlord */}
              {landlord && (
                <div className="mb-6 p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Landlord</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{landlord.name}</p>
                        <p className="text-sm text-gray-600">Hostel Owner</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {landlord.phone && (
                        <a 
                          href={`tel:${landlord.phone}`}
                          className="inline-flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      )}
                      {landlord.email && (
                        <a 
                          href={`mailto:${landlord.email}`}
                          className="inline-flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                        <p className="text-gray-600">{room.total} rooms available</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          Ksh {room.price.toLocaleString()}
                        </div>
                        <div className="text-gray-600">per month</div>
                      </div>
                    </div>
                    {room.description && (
                      <p className="text-gray-600 mb-3">{room.description}</p>
                    )}
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
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{hostel.location}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">University:</span> {hostel.university}
                </div>
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
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                          {review.user_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
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
                                <span className="text-gray-500 text-sm">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this hostel!</p>
                  </div>
                )}
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
                    min={defaultCheckInStr}
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
                    min={checkIn || defaultCheckInStr}
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
              {checkIn && checkOut && hostel.roomTypes[selectedRoomType] && (
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
                <Button 
                  className="w-full" 
                  onClick={handleBookNow}
                  disabled={!checkIn || !checkOut}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full" onClick={handleWishlistToggle}>
                  <Heart className={`h-4 w-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-teal-600 mr-2 flex-shrink-0" />
                  <span>Free cancellation up to 48 hours before check-in</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-teal-600 mr-2 flex-shrink-0" />
                  <span>24/7 customer support</span>
                </div>
                {hostel.verified && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-teal-600 mr-2 flex-shrink-0" />
                    <span>Verified property</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage;