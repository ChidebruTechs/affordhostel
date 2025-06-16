export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'landlord' | 'agent' | 'admin';
  avatar?: string;
  university?: string;
  studentId?: string;
  verified: boolean;
  createdAt: Date;
}

export interface Hostel {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  university: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: number;
  roomTypes: RoomType[];
  landlordId: string;
  verified: boolean;
  available: boolean;
}

export interface RoomType {
  id: string;
  type: string;
  price: number;
  available: number;
  total: number;
  features: string[];
}

export interface Booking {
  id: string;
  hostelId: string;
  studentId: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  [key: string]: number | string;
}