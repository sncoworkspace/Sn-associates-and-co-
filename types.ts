
import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Product {
  id: string;
  title: string;
  type: 'E-Book' | 'Course';
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  features: string[];
  rating: number;
  students: number;
  author: string;
  updatedDate: string;
  language: string;
  content: {
    title: string;
    items: string[];
  }[];
}

export interface ClientDocument {
  id: string;
  userId: string;
  name: string;
  type: 'PDF' | 'Image' | 'Excel';
  size: number; // in bytes
  uploadedAt: string;
  category: 'GST' | 'Income Tax' | 'Company' | 'Other';
  status: 'verified' | 'pending' | 'rejected';
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  purchasedCourses: string[]; // array of product IDs
  role: 'admin' | 'user';
  isBlocked?: boolean;
  joinedAt: string;
  storageUsed: number; // in bytes
}

export type OrderStatus = 'pending' | 'success' | 'failed';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: Product[];
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string; // Razorpay payment ID
  date: string;
}
