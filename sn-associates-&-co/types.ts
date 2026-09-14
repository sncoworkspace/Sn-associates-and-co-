
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
  type: 'E-Book' | 'Course' | 'Internship' | 'ebook' | 'course' | 'internship';
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
  driveLink?: string;
  youtubeLink?: string;
  content: {
    title: string;
    items: string[];
  }[];
}

export interface Blog {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  author: string;
  image: string;
  date: string;
  link?: string;
  created_at?: string;
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

export type ServiceCategory =
  | 'Business Entity Incorporation & Registration'
  | 'Post-Incorporation & Business Registrations'
  | 'Tax & Legal Compliance Services'
  | 'Outsourcing, Accounting & CFO Services'
  | 'Digital, Technology & Growth Services'
  | 'SNAC Academy: Professional Training';
export type ClientType = 'Individuals' | 'Businesses' | 'Startups';
export type DocumentType = 'Forms' | 'Checklists' | 'Guidelines' | 'Templates' | 'Reports';
export type AccessType = 'View Only' | 'Download Allowed';

export interface ServiceResource {
  id: string;
  name: string;
  link: string;
  type: DocumentType;
  access: AccessType;
  isPublic: boolean;
}

export interface ProfessionalService {
  id: string;
  name: string;
  category: ServiceCategory | string;
  description: string;
  applicableClients: ClientType[];
  fees?: string;
  status: 'Active' | 'Inactive';
  resources: ServiceResource[];
  createdAt: string;
  updatedAt: string;
  image?: string;
  feeNote?: string;
  priceNumber?: number;
  rating?: number;
  reviewCount?: number;
  turnaround?: string;
  popular?: boolean;
  categoryKey?: string;
  categorySlug?: string;
}

export type ResourceCategory = 'Notes' | 'PDF' | 'Video' | 'Study Material' | 'Other';

export interface EbookResource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  gdriveUrl: string;
  category: ResourceCategory;
  status: 'Active' | 'Inactive';
  buttonText: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationPayment {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  createdAt: string;
}
