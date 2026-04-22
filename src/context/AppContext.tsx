import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hostel, Booking, Notification, WishlistItem, Review, VerificationReport, TeamMember } from '../types';
import { supabase } from '../../lib/supabase';

interface CompanyInfo {
  mission: string;
  vision: string;
  team: TeamMember[];
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  currentPage: string;
  setCurrentPage: (page: string, params?: any) => void;
  hostels: Hostel[];
  bookings: Booking[];
  notifications: Notification[];
  wishlist: WishlistItem[];
  reviews: Review[];
  companyInfo: CompanyInfo;
  isAuthenticated: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  addToWishlist: (hostelId: string) => Promise<void>;
  removeFromWishlist: (hostelId: string) => Promise<void>;
  isInWishlist: (hostelId: string) => boolean;
  addReview: (hostelId: string, rating: number, comment: string) => Promise<void>;
  getHostelReviews: (hostelId: string) => Promise<Review[]>;
  createBooking: (bookingData: any) => Promise<Booking>;
  addHostel: (hostelData: any) => Promise<void>;
  updateHostel: (hostelId: string, hostelData: any) => Promise<void>;
  deleteHostel: (hostelId: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  assignAgentToHostel: (hostelId: string, agentId: string) => Promise<void>;
  submitVerificationReport: (hostelId: string, report: VerificationReport) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchHostels: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCompanyInfo: CompanyInfo = {
  mission: "To simplify and democratize student accommodation in Kenya by providing a transparent, secure, and user-friendly platform that connects students with quality, affordable hostels near their universities.",
  vision: "To become the leading student accommodation platform in East Africa, empowering students to focus on their education while we take care of their housing needs through innovation and excellence.",
  team: []
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState('student');
  const [currentPage, setCurrentPageState] = useState('home');
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  // Initialize app data
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          // Clear any stale data
          clearAppData();
        }
      } catch (err: any) {
        console.error('Error initializing app:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initApp();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          clearAppData();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearAppData = () => {
    setUser(null);
    setCurrentRole('student');
    setHostels([]);
    setBookings([]);
    setNotifications([]);
    setWishlist([]);
    setReviews([]);
  };

  const setCurrentPage = (page: string, params?: any) => {
    setCurrentPageState(page);
    const pageRoutes: Record<string, string> = {
      'home': '/',
      'login': '/login',
      'signup': '/signup',
      'forgot-password': '/forgot-password',
      'hostels': '/hostels',
      'hostel-detail': `/hostels/${params?.hostelId || ':id'}`,
      'about': '/about',
      'contact': '/contact',
      'dashboard': '/dashboard',
      'landlord': '/landlord',
      'agent': '/agent',
      'admin': '/admin',
      'settings': '/settings',
      'profile': '/profile',
      'bookings': '/bookings',
      'wishlist': '/wishlist',
      'analytics': '/analytics',
      'messages': '/messages',
      'notifications': '/notifications',
      'add-edit-hostel': '/add-edit-hostel',
      'how-to-book': '/how-to-book',
      'student-guide': '/student-guide',
      'payment-options': '/payment-options',
      'safety-tips': '/safety-tips',
      'list-property': '/list-property',
      'landlord-guide': '/landlord-guide',
      'verification': '/verification',
      'pricing': '/pricing',
    };
    const route = pageRoutes[page];
    if (route) {
      navigate(route);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch user profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        const userObj: User = {
          id: profile.id,
          name: profile.name || profile.email?.split('@')[0] || 'User',
          email: profile.email,
          phone: profile.phone,
          role: profile.role || 'student',
          university: profile.university,
          studentId: profile.student_id,
          verified: profile.verified || false,
          createdAt: new Date(profile.created_at),
          avatar: profile.avatar_url
        };

        setUser(userObj);
        setCurrentRole(userObj.role);

        // Fetch user data based on role
        await Promise.all([
          fetchHostels(),
          fetchBookings(),
          fetchNotifications(),
          fetchWishlist(),
          fetchCompanyInfo()
        ]);
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: any) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });

      if (authError) throw authError;

      if (data.user) {
        await fetchUserProfile(data.user.id);
        
        // Navigate to appropriate dashboard based on role
        const role = data.user.user_metadata?.role || 'student';
        switch (role) {
          case 'student':
            navigate('/dashboard');
            break;
          case 'landlord':
            navigate('/landlord');
            break;
          case 'agent':
            navigate('/agent');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearAppData();
      navigate('/login');
    } catch (err: any) {
      console.error('Error logging out:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          room_types(*),
          profiles:landlord_id (name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedHostels: Hostel[] = (data || []).map((hostel: any) => ({
        id: hostel.id,
        name: hostel.name,
        description: hostel.description,
        price: hostel.price,
        location: hostel.location,
        university: hostel.university,
        images: hostel.images || [],
        amenities: hostel.amenities || [],
        rating: hostel.rating || 0,
        reviews: hostel.reviews || 0,
        roomTypes: hostel.room_types?.map((room: any) => ({
          id: room.id,
          type: room.type,
          price: room.price,
          available: room.available || 0,
          total: room.total,
          features: room.features || []
        })) || [],
        landlordId: hostel.landlord_id,
        verified: hostel.verified || false,
        available: hostel.available || true,
        verificationStatus: hostel.verification_status || 'pending_submission',
        assignedAgentId: hostel.assigned_agent_id
      }));

      setHostels(transformedHostels);
    } catch (err: any) {
      console.error('Error fetching hostels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          hostels(*),
          profiles:user_id (name, email)
        `)
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (currentRole === 'student') {
        query = query.eq('user_id', user.id);
      } else if (currentRole === 'landlord') {
        // Get bookings for hostels owned by this landlord
        const { data: ownedHostels } = await supabase
          .from('hostels')
          .select('id')
          .eq('landlord_id', user.id);

        const hostelIds = ownedHostels?.map(h => h.id) || [];
        query = query.in('hostel_id', hostelIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedBookings: Booking[] = (data || []).map((booking: any) => ({
        id: booking.id,
        hostelId: booking.hostel_id,
        studentId: booking.user_id,
        roomType: booking.room_type,
        checkIn: new Date(booking.check_in),
        checkOut: new Date(booking.check_out),
        amount: booking.amount,
        status: booking.status,
        createdAt: new Date(booking.created_at)
      }));

      setBookings(transformedBookings);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transformedNotifications: Notification[] = (data || []).map((notification: any) => ({
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        action_url: notification.action_url,
        createdAt: new Date(notification.created_at)
      }));

      setNotifications(transformedNotifications);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          hostels(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedWishlist: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        hostelId: item.hostel_id,
        createdAt: new Date(item.created_at)
      }));

      setWishlist(transformedWishlist);
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .single();

      if (error && error.code === 'PGRST116') {
        // No company info in database, use default
        return;
      }

      if (error) throw error;

      if (data) {
        setCompanyInfo({
          mission: data.mission || initialCompanyInfo.mission,
          vision: data.vision || initialCompanyInfo.vision,
          team: data.team || []
        });
      }
    } catch (err: any) {
      console.error('Error fetching company info:', err);
      setError(err.message);
    }
  };

  const addToWishlist = async (hostelId: string) => {
    if (!user) throw new Error('Must be logged in to add to wishlist');

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          hostel_id: hostelId
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: WishlistItem = {
        id: data.id,
        userId: data.user_id,
        hostelId: data.hostel_id,
        createdAt: new Date(data.created_at)
      };

      setWishlist(prev => [...prev, newItem]);
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (hostelId: string) => {
    if (!user) throw new Error('Must be logged in to remove from wishlist');

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('hostel_id', hostelId);

      if (error) throw error;

      setWishlist(prev => prev.filter(item => item.hostelId !== hostelId));
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (hostelId: string) => {
    if (!user) return false;
    return wishlist.some(item => item.hostelId === hostelId && item.userId === user.id);
  };

  const addReview = async (hostelId: string, rating: number, comment: string) => {
    if (!user) throw new Error('Must be logged in to add review');

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          hostel_id: hostelId,
          user_id: user.id,
          rating,
          comment
        })
        .select()
        .single();

      if (error) throw error;

      const newReview: Review = {
        id: data.id,
        hostelId: data.hostel_id,
        userId: data.user_id,
        userName: user.name,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date(data.created_at),
        helpful: 0
      };

      setReviews(prev => [...prev, newReview]);
    } catch (err: any) {
      console.error('Error adding review:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHostelReviews = async (hostelId: string): Promise<Review[]> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq('hostel_id', hostelId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((review: any) => ({
        id: review.id,
        hostelId: review.hostel_id,
        userId: review.user_id,
        userName: review.profiles?.name || 'Anonymous',
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(review.created_at),
        helpful: review.helpful || 0
      }));
    } catch (err: any) {
      console.error('Error getting hostel reviews:', err);
      setError(err.message);
      return [];
    }
  };

  const createBooking = async (bookingData: any): Promise<Booking> => {
    if (!user) throw new Error('Must be logged in to create booking');

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          hostel_id: bookingData.hostelId,
          user_id: user.id,
          room_type: bookingData.roomType,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          amount: bookingData.amount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newBooking: Booking = {
        id: data.id,
        hostelId: data.hostel_id,
        studentId: data.user_id,
        roomType: data.room_type,
        checkIn: new Date(data.check_in),
        checkOut: new Date(data.check_out),
        amount: data.amount,
        status: data.status,
        createdAt: new Date(data.created_at)
      };

      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addHostel = async (hostelData: any) => {
    if (!user) throw new Error('Must be logged in to add hostel');
    if (currentRole !== 'landlord' && currentRole !== 'admin') {
      throw new Error('Only landlords and admins can add hostels');
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('hostels')
        .insert({
          name: hostelData.name,
          description: hostelData.description,
          price: hostelData.price,
          location: hostelData.location,
          university: hostelData.university,
          images: hostelData.images,
          amenities: hostelData.amenities,
          landlord_id: user.id,
          verified: false,
          verification_status: 'pending_submission'
        })
        .select()
        .single();

      if (error) throw error;

      // Add room types
      if (hostelData.roomTypes && hostelData.roomTypes.length > 0) {
        const roomTypesData = hostelData.roomTypes.map((room: any) => ({
          hostel_id: data.id,
          type: room.type,
          price: room.price,
          total: room.total,
          features: room.features,
          description: room.description
        }));

        const { error: roomTypesError } = await supabase
          .from('room_types')
          .insert(roomTypesData);

        if (roomTypesError) throw roomTypesError;
      }

      // Refresh hostels list
      await fetchHostels();
    } catch (err: any) {
      console.error('Error adding hostel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHostel = async (hostelId: string, hostelData: any) => {
    if (!user) throw new Error('Must be logged in to update hostel');
    if (currentRole !== 'landlord' && currentRole !== 'admin') {
      throw new Error('Only landlords and admins can update hostels');
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('hostels')
        .update({
          name: hostelData.name,
          description: hostelData.description,
          price: hostelData.price,
          location: hostelData.location,
          university: hostelData.university,
          images: hostelData.images,
          amenities: hostelData.amenities,
          updated_at: new Date().toISOString()
        })
        .eq('id', hostelId);

      if (error) throw error;

      // Refresh hostels list
      await fetchHostels();
    } catch (err: any) {
      console.error('Error updating hostel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHostel = async (hostelId: string) => {
    if (!user) throw new Error('Must be logged in to delete hostel');
    if (currentRole !== 'landlord' && currentRole !== 'admin') {
      throw new Error('Only landlords and admins can delete hostels');
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('hostels')
        .delete()
        .eq('id', hostelId);

      if (error) throw error;

      // Refresh hostels list
      await fetchHostels();
    } catch (err: any) {
      console.error('Error deleting hostel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('Must be logged in to update profile');

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          phone: updates.phone,
          university: updates.university,
          student_id: updates.studentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user) throw new Error('Must be logged in to upload profile picture');

    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const updatedUser = { ...user, avatar: publicUrl };
      setUser(updatedUser);

      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyInfo = async (updates: Partial<CompanyInfo>) => {
    if (currentRole !== 'admin') {
      throw new Error('Only admins can update company info');
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('company_info')
        .upsert({
          id: 'company_info',
          mission: updates.mission,
          vision: updates.vision,
          team: updates.team,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setCompanyInfo(prev => ({ ...prev, ...updates }));
    } catch (err: any) {
      console.error('Error updating company info:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    if (currentRole !== 'admin') {
      throw new Error('Only admins can update team members');
    }

    try {
      setLoading(true);
      const updatedTeam = companyInfo.team.map(member => 
        member.id === id ? { ...member, ...updates } : member
      );
      
      await updateCompanyInfo({ ...companyInfo, team: updatedTeam });
    } catch (err: any) {
      console.error('Error updating team member:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    if (currentRole !== 'admin') {
      throw new Error('Only admins can add team members');
    }

    try {
      setLoading(true);
      const newMember: TeamMember = {
        ...member,
        id: Date.now().toString()
      };
      
      const updatedTeam = [...companyInfo.team, newMember];
      await updateCompanyInfo({ ...companyInfo, team: updatedTeam });
    } catch (err: any) {
      console.error('Error adding team member:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = async (id: string) => {
    if (currentRole !== 'admin') {
      throw new Error('Only admins can remove team members');
    }

    try {
      setLoading(true);
      const updatedTeam = companyInfo.team.filter(member => member.id !== id);
      await updateCompanyInfo({ ...companyInfo, team: updatedTeam });
    } catch (err: any) {
      console.error('Error removing team member:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
    }
  };

  const assignAgentToHostel = async (hostelId: string, agentId: string) => {
    if (currentRole !== 'admin') {
      throw new Error('Only admins can assign agents');
    }

    try {
      const { error } = await supabase
        .from('hostels')
        .update({
          assigned_agent_id: agentId,
          verification_status: 'pending_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', hostelId);

      if (error) throw error;

      await fetchHostels();
    } catch (err: any) {
      console.error('Error assigning agent:', err);
      setError(err.message);
      throw err;
    }
  };

  const submitVerificationReport = async (hostelId: string, report: VerificationReport) => {
    if (currentRole !== 'agent') {
      throw new Error('Only agents can submit verification reports');
    }

    try {
      const { error } = await supabase
        .from('hostels')
        .update({
          verification_status: report.status,
          verified: report.status === 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', hostelId);

      if (error) throw error;

      // Create verification history record
      const { error: historyError } = await supabase
        .from('verification_history')
        .insert({
          hostel_id: hostelId,
          agent_id: user?.id,
          status: report.status,
          notes: report.notes,
          documents: report.documents
        });

      if (historyError) throw historyError;

      await fetchHostels();
    } catch (err: any) {
      console.error('Error submitting verification report:', err);
      setError(err.message);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentRole,
      setCurrentRole,
      currentPage,
      setCurrentPage,
      hostels,
      bookings,
      notifications,
      wishlist,
      reviews,
      companyInfo,
      isAuthenticated,
      login,
      logout,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      addReview,
      getHostelReviews,
      createBooking,
      addHostel,
      updateHostel,
      deleteHostel,
      updateUserProfile,
      uploadProfilePicture,
      updateCompanyInfo,
      updateTeamMember,
      addTeamMember,
      removeTeamMember,
      assignAgentToHostel,
      submitVerificationReport,
      markAsRead,
      markAllAsRead,
      fetchHostels,
      fetchBookings,
      fetchNotifications,
      fetchWishlist,
      loading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};