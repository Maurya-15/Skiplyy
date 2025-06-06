export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "business" | "admin";
  avatar?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  category: BusinessCategory;
  address: string;
  description?: string;
  coverPhoto?: string;
  logo?: string;
  rating: number;
  totalReviews: number;
  openingHours: {
    [key: string]: { start: string; end: string; closed: boolean };
  };
  departments: Department[];
  isAcceptingBookings: boolean;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  estimatedWaitTime: number; // in minutes
  maxQueueSize: number;
  currentQueueSize: number;
  isActive: boolean;
  price?: number;
}

export interface QueueBooking {
  id: string;
  userId: string;
  businessId: string;
  departmentId: string;
  tokenNumber: number;
  status: BookingStatus;
  customerName: string;
  customerPhone: string;
  notes?: string;
  estimatedWaitTime: number;
  actualWaitTime?: number;
  bookedAt: string;
  checkedInAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
  peopleAhead: number;
  tokenNumber: number;
  lastUpdated: string;
}

export type BookingStatus =
  | "waiting"
  | "approved"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";

export type BusinessCategory =
  | "hospital"
  | "salon"
  | "bank"
  | "government"
  | "restaurant"
  | "clinic"
  | "pharmacy"
  | "dental"
  | "eye-care"
  | "gym"
  | "spa"
  | "auto-service"
  | "other";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role: "user" | "business",
  ) => Promise<void>;
  signupUser: (data: UserSignupData) => Promise<void>;
  signupBusiness: (data: BusinessSignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export interface UserSignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface BusinessSignupData {
  ownerName: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
  category: BusinessCategory;
  address: string;
  description?: string;
  departments: string[];
  openingHours: {
    [key: string]: { start: string; end: string; closed: boolean };
  };
}

export interface BookingFormData {
  departmentId: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  userGrowth: number;
  businessGrowth: number;
  bookingGrowth: number;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}
