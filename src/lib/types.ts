export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "business" | "admin";
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  address: string;
  description?: string;
  photo?: string;
  rating: number;
  totalReviews: number;
  departments: Department[];
  ownerId: string;
  isAcceptingBookings: boolean;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  estimatedWaitTime: number; // in minutes
  currentQueueSize: number;
  maxQueueSize: number;
  isActive: boolean;
}

export interface QueueBooking {
  id: string;
  userId: string;
  businessId: string;
  departmentId: string;
  tokenNumber: number;
  status: "waiting" | "in-progress" | "completed" | "cancelled";
  estimatedWaitTime: number;
  notes?: string;
  bookedAt: string;
  userName: string;
  userPhone: string;
}

export interface BusinessOwner extends User {
  businessId: string;
}

export interface QueueStatus {
  currentPosition: number;
  estimatedWaitTime: number;
  peopleAhead: number;
  tokenNumber: number;
}

export type BusinessCategory =
  | "hospital"
  | "salon"
  | "government"
  | "bank"
  | "restaurant"
  | "clinic"
  | "pharmacy"
  | "other";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  businesses: Business[];
  nearbyBusinesses: Business[];
  selectedLocation: string;
  selectedCategory: BusinessCategory | "all";
  userBookings: QueueBooking[];
}

export interface BookingForm {
  departmentId: string;
  userName: string;
  userPhone: string;
  notes?: string;
}

export interface LoginForm {
  email: string;
  password: string;
  role: "user" | "business";
}

export interface SignupUserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface SignupBusinessForm {
  ownerName: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
  category: BusinessCategory;
  address: string;
  description?: string;
}
