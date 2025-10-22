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
  verificationStatus: 'pending_submission' | 'pending_review' | 'verified' | 'rejected' | 'needs_more_info';
  assignedAgentId?: string;
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
  paymentId?: string;
  receiptUrl?: string;
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

export interface WishlistItem {
  id: string;
  userId: string;
  hostelId: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  hostelId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export interface PaymentData {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface MPesaResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export interface DashboardStats {
  [key: string]: number | string;
}

export interface ReceiptData {
  bookingId: string;
  transactionId: string;
  hostelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  duration: number;
  amount: number;
  serviceFee: number;
  totalAmount: number;
  paymentMethod: string;
  phoneNumber: string;
  timestamp: Date;
  customerName: string;
  customerEmail: string;
}

export interface VerificationReport {
  id: string;
  hostelId: string;
  agentId: string;
  comments: string;
  photos: string[];
  status: 'verified' | 'rejected' | 'needs_more_info';
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order?: number;
  active?: boolean;
}