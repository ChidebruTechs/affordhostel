import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Hostel, Booking, Notification, WishlistItem, Review, VerificationReport, TeamMember } from '../types';

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
  hostels: Hostel[];
  bookings: Booking[];
  notifications: Notification[];
  wishlist: WishlistItem[];
  reviews: Review[];
  companyInfo: CompanyInfo;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => void;
  logout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  addToWishlist: (hostelId: string) => void;
  removeFromWishlist: (hostelId: string) => void;
  isInWishlist: (hostelId: string) => boolean;
  addReview: (hostelId: string, rating: number, comment: string) => void;
  getHostelReviews: (hostelId: string) => Review[];
  createBooking: (bookingData: any) => Promise<Booking>;
  addHostel: (hostelData: any) => void;
  updateHostel: (hostelId: string, hostelData: any) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  uploadProfilePicture: (file: File) => Promise<string>;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (id: string) => void;
  assignAgentToHostel: (hostelId: string, agentId: string) => void;
  submitVerificationReport: (hostelId: string, report: VerificationReport) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Enhanced mock data with role-specific content
const createMockUser = (role: string): User => ({
  id: '1',
  name: role === 'student' ? 'John Mwangi' : 
        role === 'landlord' ? 'James Omondi' :
        role === 'agent' ? 'Brian Kiprotich' : 'Sarah Wanjiku',
  email: `${role}@example.com`,
  phone: '+254712345678',
  role: role as any,
  university: role === 'student' ? 'University of Nairobi' : undefined,
  studentId: role === 'student' ? 'UoN/2023/12345' : undefined,
  verified: true,
  createdAt: new Date('2023-06-15'),
  avatar: undefined
});

const mockHostels: Hostel[] = [
  {
    id: '1',
    name: 'Umoja Hostels',
    description: 'Modern, comfortable hostel near University of Nairobi with excellent amenities.',
    price: 15000,
    location: 'Near University of Nairobi',
    university: 'University of Nairobi',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    amenities: ['WiFi', 'Laundry', '24/7 Security', 'Study Area'],
    rating: 4.7,
    reviews: 24,
    roomTypes: [
      { id: '1', type: 'Single Room', price: 15000, available: 5, total: 20, features: ['Private bathroom', 'Desk', 'Wardrobe'] },
      { id: '2', type: 'Shared Room', price: 10000, available: 8, total: 15, features: ['Shared bathroom', 'Bunk bed', 'Locker'] }
    ],
    landlordId: '2',
    verified: true,
    available: true,
    verificationStatus: 'verified',
    assignedAgentId: undefined
  },
  {
    id: '2',
    name: 'Kilele Hostels',
    description: 'Affordable accommodation with modern facilities near Kenyatta University.',
    price: 12000,
    location: 'Near Kenyatta University',
    university: 'Kenyatta University',
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    amenities: ['Parking', 'Gym', 'Study Area', 'WiFi'],
    rating: 4.5,
    reviews: 18,
    roomTypes: [
      { id: '1', type: 'Single Room', price: 12000, available: 3, total: 12, features: ['Private bathroom', 'AC', 'Desk'] }
    ],
    landlordId: '3',
    verified: true,
    available: true,
    verificationStatus: 'verified',
    assignedAgentId: undefined
  },
  {
    id: '3',
    name: 'Prestige Hostels',
    description: 'Premium hostel with luxury amenities including swimming pool and gym.',
    price: 18000,
    location: 'Near Mount Kenya University',
    university: 'Mount Kenya University',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    amenities: ['Swimming Pool', 'Gym', 'Study Area', 'Cafeteria'],
    rating: 4.8,
    reviews: 32,
    roomTypes: [
      { id: '1', type: 'Deluxe Room', price: 18000, available: 2, total: 8, features: ['Private bathroom', 'AC', 'Balcony'] }
    ],
    landlordId: '4',
    verified: true,
    available: true,
    verificationStatus: 'verified',
    assignedAgentId: undefined
  },
  {
    id: '4',
    name: 'Greenview Apartments',
    description: 'Spacious apartments with garden views and modern amenities.',
    price: 20000,
    location: 'Near JKUAT',
    university: 'JKUAT',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    amenities: ['Garden', 'Parking', 'WiFi', 'Kitchen'],
    rating: 4.6,
    reviews: 15,
    roomTypes: [
      { id: '1', type: 'Studio Apartment', price: 20000, available: 4, total: 10, features: ['Kitchenette', 'Private bathroom', 'Balcony'] }
    ],
    landlordId: '2',
    verified: true,
    available: true,
    verificationStatus: 'verified',
    assignedAgentId: undefined
  }
];

const initialCompanyInfo: CompanyInfo = {
  mission: "To simplify and democratize student accommodation in Kenya by providing a transparent, secure, and user-friendly platform that connects students with quality, affordable hostels near their universities.",
  vision: "To become the leading student accommodation platform in East Africa, empowering students to focus on their education while we take care of their housing needs through innovation and excellence.",
  team: [
    {
      id: '1',
      name: 'Sarah Wanjiku',
      role: 'CEO & Co-Founder',
      bio: 'Former university student who experienced the challenges of finding quality accommodation firsthand.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      name: 'James Kiprotich',
      role: 'CTO & Co-Founder',
      bio: 'Tech enthusiast with 8+ years of experience building scalable platforms for the African market.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      name: 'Grace Akinyi',
      role: 'Head of Operations',
      bio: 'Operations expert ensuring smooth platform functionality and excellent user experience.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '4',
      name: 'Michael Omondi',
      role: 'Head of Partnerships',
      bio: 'Building relationships with universities, landlords, and agents across Kenya.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ]
};

const createMockBookings = (role: string): Booking[] => {
  if (role !== 'student') return [];
  
  return [
    {
      id: '1',
      hostelId: '1',
      studentId: '1',
      roomType: 'Single Room',
      checkIn: new Date('2023-08-15'),
      checkOut: new Date('2023-12-15'),
      amount: 60000,
      status: 'confirmed',
      createdAt: new Date('2023-07-10')
    },
    {
      id: '2',
      hostelId: '3',
      studentId: '1',
      roomType: 'Deluxe Room',
      checkIn: new Date('2023-09-01'),
      checkOut: new Date('2023-12-31'),
      amount: 72000,
      status: 'pending',
      createdAt: new Date('2023-07-12')
    }
  ];
};

const createMockNotifications = (role: string): Notification[] => {
  const baseNotifications = [
    {
      id: '1',
      userId: '1',
      title: 'Welcome to AffordHostel!',
      message: 'Your account has been successfully created.',
      type: 'success' as const,
      read: false,
      createdAt: new Date('2023-07-12')
    }
  ];

  switch (role) {
    case 'student':
      return [
        ...baseNotifications,
        {
          id: '2',
          userId: '1',
          title: 'Booking Confirmed',
          message: 'Your booking at Umoja Hostels has been confirmed.',
          type: 'success' as const,
          read: false,
          createdAt: new Date('2023-07-12')
        },
        {
          id: '3',
          userId: '1',
          title: 'Payment Reminder',
          message: 'Your payment for Prestige Hostels is due in 3 days.',
          type: 'warning' as const,
          read: false,
          createdAt: new Date('2023-07-10')
        }
      ];
    case 'landlord':
      return [
        ...baseNotifications,
        {
          id: '2',
          userId: '1',
          title: 'New Booking Request',
          message: 'You have a new booking request for Umoja Hostels.',
          type: 'info' as const,
          read: false,
          createdAt: new Date('2023-07-12')
        },
        {
          id: '3',
          userId: '1',
          title: 'Property Verification Complete',
          message: 'Your property Kilele Hostels has been verified.',
          type: 'success' as const,
          read: true,
          createdAt: new Date('2023-07-10')
        }
      ];
    case 'agent':
      return [
        ...baseNotifications,
        {
          id: '2',
          userId: '1',
          title: 'New Verification Request',
          message: 'Sunset View Hostels requires verification.',
          type: 'info' as const,
          read: false,
          createdAt: new Date('2023-07-12')
        },
        {
          id: '3',
          userId: '1',
          title: 'Verification Approved',
          message: 'Your verification for Haven Residences was approved.',
          type: 'success' as const,
          read: true,
          createdAt: new Date('2023-07-10')
        }
      ];
    case 'admin':
      return [
        ...baseNotifications,
        {
          id: '2',
          userId: '1',
          title: 'System Alert',
          message: 'Server maintenance scheduled for tonight.',
          type: 'warning' as const,
          read: false,
          createdAt: new Date('2023-07-12')
        },
        {
          id: '3',
          userId: '1',
          title: 'New User Registration',
          message: '15 new users registered today.',
          type: 'info' as const,
          read: true,
          createdAt: new Date('2023-07-10')
        }
      ];
    default:
      return baseNotifications;
  }
};

const mockReviews: Review[] = [
  {
    id: '1',
    hostelId: '1',
    userId: '1',
    userName: 'John Mwangi',
    rating: 5,
    comment: 'Great hostel with clean facilities and friendly staff. The location is perfect for university students.',
    createdAt: new Date('2023-07-01'),
    helpful: 12
  },
  {
    id: '2',
    hostelId: '1',
    userId: '2',
    userName: 'Grace Akinyi',
    rating: 4,
    comment: 'The study area is well-equipped and quiet. Internet is reliable which is great for online classes.',
    createdAt: new Date('2023-06-15'),
    helpful: 8
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState('student');
  const [currentPage, setCurrentPage] = useState('home');
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  
  // Initialize companyInfo from localStorage or use default
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    try {
      const savedCompanyInfo = localStorage.getItem('affordhostel_company_info');
      if (savedCompanyInfo) {
        const parsed = JSON.parse(savedCompanyInfo);
        // Ensure the parsed data has the correct structure
        return {
          mission: parsed.mission || initialCompanyInfo.mission,
          vision: parsed.vision || initialCompanyInfo.vision,
          team: Array.isArray(parsed.team) ? parsed.team : initialCompanyInfo.team
        };
      }
    } catch (error) {
      console.warn('Failed to load company info from localStorage:', error);
    }
    return initialCompanyInfo;
  });

  // Save companyInfo to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('affordhostel_company_info', JSON.stringify(companyInfo));
    } catch (error) {
      console.warn('Failed to save company info to localStorage:', error);
    }
  }, [companyInfo]);

  const isAuthenticated = user !== null;

  const login = (email: string, password: string, role: string) => {
    const mockUser = createMockUser(role);
    setUser(mockUser);
    setCurrentRole(role);
    setBookings(createMockBookings(role));
    setNotifications(createMockNotifications(role));
    // Redirect to dashboard after login
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
    setNotifications([]);
    setWishlist([]);
    setCurrentPage('home');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  const handleRoleChange = (newRole: string) => {
    if (user) {
      const updatedUser = createMockUser(newRole);
      setUser(updatedUser);
      setCurrentRole(newRole);
      setBookings(createMockBookings(newRole));
      setNotifications(createMockNotifications(newRole));
    } else {
      setCurrentRole(newRole);
    }
  };

  const addToWishlist = (hostelId: string) => {
    if (!user) return;
    
    const newWishlistItem: WishlistItem = {
      id: Date.now().toString(),
      userId: user.id,
      hostelId,
      createdAt: new Date()
    };
    
    setWishlist(prev => [...prev, newWishlistItem]);
  };

  const removeFromWishlist = (hostelId: string) => {
    if (!user) return;
    setWishlist(prev => prev.filter(item => !(item.hostelId === hostelId && item.userId === user.id)));
  };

  const isInWishlist = (hostelId: string) => {
    if (!user) return false;
    return wishlist.some(item => item.hostelId === hostelId && item.userId === user.id);
  };

  const addReview = (hostelId: string, rating: number, comment: string) => {
    if (!user) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      hostelId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date(),
      helpful: 0
    };
    
    setReviews(prev => [...prev, newReview]);
  };

  const getHostelReviews = (hostelId: string) => {
    return reviews.filter(review => review.hostelId === hostelId);
  };

  const createBooking = async (bookingData: any): Promise<Booking> => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      hostelId: bookingData.hostelId,
      studentId: user?.id || '',
      roomType: bookingData.roomType,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      amount: bookingData.amount,
      status: 'pending',
      createdAt: new Date()
    };
    
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const addHostel = (hostelData: any) => {
    const newHostel: Hostel = {
      id: Date.now().toString(),
      name: hostelData.name,
      description: hostelData.description,
      price: hostelData.price,
      location: hostelData.location,
      university: hostelData.university,
      images: hostelData.images,
      amenities: hostelData.amenities,
      rating: 0,
      reviews: 0,
      roomTypes: hostelData.roomTypes.map((rt: any) => ({
        ...rt,
        available: rt.total // Initially all rooms are available
      })),
      landlordId: user?.id || '',
      verified: false,
      available: true,
      verificationStatus: 'pending_submission',
      assignedAgentId: undefined
    };
    
    setHostels(prev => [...prev, newHostel]);
  };
  
  const updateHostel = (hostelId: string, hostelData: any) => {
    setHostels(prev => prev.map(hostel => 
      hostel.id === hostelId 
        ? { ...hostel, ...hostelData }
        : hostel
    ));
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    // Simulate file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        if (user) {
          setUser({ ...user, avatar: mockUrl });
        }
        resolve(mockUrl);
      }, 2000);
    });
  };

  const updateCompanyInfo = (updates: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setCompanyInfo(prev => ({
      ...prev,
      team: prev.team.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    }));
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    };
    setCompanyInfo(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));
  };

  const removeTeamMember = (id: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== id)
    }));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const assignAgentToHostel = (hostelId: string, agentId: string) => {
    setHostels(prev => prev.map(hostel => 
      hostel.id === hostelId 
        ? { 
            ...hostel, 
            assignedAgentId: agentId,
            verificationStatus: 'pending_review' as const
          }
        : hostel
    ));
  };

  const submitVerificationReport = (hostelId: string, report: VerificationReport) => {
    setHostels(prev => prev.map(hostel => 
      hostel.id === hostelId 
        ? { 
            ...hostel, 
            verificationStatus: report.status,
            verified: report.status === 'verified'
          }
        : hostel
    ));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentRole,
      setCurrentRole: handleRoleChange,
      hostels,
      bookings,
      notifications,
      wishlist,
      reviews,
      companyInfo,
      isAuthenticated,
      login,
      logout,
      currentPage,
      setCurrentPage: handlePageChange,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      addReview,
      getHostelReviews,
      createBooking,
      addHostel,
      updateHostel,
      updateUserProfile,
      uploadProfilePicture,
      updateCompanyInfo,
      updateTeamMember,
      addTeamMember,
      removeTeamMember,
      assignAgentToHostel,
      submitVerificationReport,
      markAsRead,
      markAllAsRead
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