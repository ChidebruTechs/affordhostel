import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Hostel, Booking, Notification } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  hostels: Hostel[];
  bookings: Booking[];
  notifications: Notification[];
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => void;
  logout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Enhanced mock data with role-specific content
const createMockUser = (role: string): User => ({
  id: '1',
  name: role === 'student' ? 'John Doe' : 
        role === 'landlord' ? 'James Omondi' :
        role === 'agent' ? 'Brian Kiprotich' : 'Admin User',
  email: `${role}@example.com`,
  phone: '+254712345678',
  role: role as any,
  university: role === 'student' ? 'University of Nairobi' : undefined,
  studentId: role === 'student' ? 'UoN12345' : undefined,
  verified: true,
  createdAt: new Date('2023-06-15'),
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
    available: true
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
    available: true
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
    available: true
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
    available: true
  }
];

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState('student');
  const [currentPage, setCurrentPage] = useState('home');
  const [hostels] = useState<Hostel[]>(mockHostels);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const isAuthenticated = user !== null;

  const login = (email: string, password: string, role: string) => {
    const mockUser = createMockUser(role);
    setUser(mockUser);
    setCurrentRole(role);
    setBookings(createMockBookings(role));
    setNotifications(createMockNotifications(role));
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
    setNotifications([]);
    setCurrentPage('home');
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

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentRole,
      setCurrentRole: handleRoleChange,
      hostels,
      bookings,
      notifications,
      isAuthenticated,
      login,
      logout,
      currentPage,
      setCurrentPage
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