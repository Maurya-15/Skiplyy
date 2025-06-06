import { User, Business, QueueBooking, BusinessCategory } from "../types";

export const BUSINESS_CATEGORIES = [
  {
    value: "hospital" as BusinessCategory,
    label: "Hospitals",
    icon: "🏥",
    color: "bg-red-100 text-red-800",
  },
  {
    value: "salon" as BusinessCategory,
    label: "Salons & Spas",
    icon: "💇‍♀️",
    color: "bg-pink-100 text-pink-800",
  },
  {
    value: "bank" as BusinessCategory,
    label: "Banks",
    icon: "🏦",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "government" as BusinessCategory,
    label: "Government Offices",
    icon: "🏛️",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "restaurant" as BusinessCategory,
    label: "Restaurants",
    icon: "🍽️",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "clinic" as BusinessCategory,
    label: "Clinics",
    icon: "🩺",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "pharmacy" as BusinessCategory,
    label: "Pharmacies",
    icon: "💊",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "dental" as BusinessCategory,
    label: "Dental Clinics",
    icon: "🦷",
    color: "bg-teal-100 text-teal-800",
  },
  {
    value: "eye-care" as BusinessCategory,
    label: "Eye Care",
    icon: "👁️",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "gym" as BusinessCategory,
    label: "Gyms & Fitness",
    icon: "💪",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "spa" as BusinessCategory,
    label: "Spas",
    icon: "🧘‍♀️",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    value: "auto-service" as BusinessCategory,
    label: "Auto Services",
    icon: "🚗",
    color: "bg-slate-100 text-slate-800",
  },
];

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0123",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "New York, NY",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1-555-0124",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "Los Angeles, CA",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "business-1",
    name: "Dr. Michael Smith",
    email: "michael@cityhospital.com",
    phone: "+1-555-0125",
    role: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "business-2",
    name: "Lisa Beauty",
    email: "lisa@glamoursalon.com",
    phone: "+1-555-0126",
    role: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@skiply.com",
    phone: "+1-555-0127",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
];

export const mockBusinesses: Business[] = [
  {
    id: "business-1",
    name: "City General Hospital",
    ownerId: "business-1",
    category: "hospital",
    address: "123 Medical Center Dr, New York, NY 10001",
    description:
      "Leading healthcare facility with 24/7 emergency services and specialized departments.",
    coverPhoto:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=hospital",
    rating: 4.5,
    totalReviews: 1248,
    openingHours: {
      monday: { start: "00:00", end: "23:59", closed: false },
      tuesday: { start: "00:00", end: "23:59", closed: false },
      wednesday: { start: "00:00", end: "23:59", closed: false },
      thursday: { start: "00:00", end: "23:59", closed: false },
      friday: { start: "00:00", end: "23:59", closed: false },
      saturday: { start: "00:00", end: "23:59", closed: false },
      sunday: { start: "00:00", end: "23:59", closed: false },
    },
    departments: [
      {
        id: "dept-1",
        name: "Emergency Department",
        description: "Immediate medical attention for urgent cases",
        estimatedWaitTime: 45,
        maxQueueSize: 25,
        currentQueueSize: 12,
        isActive: true,
      },
      {
        id: "dept-2",
        name: "Cardiology",
        description: "Heart and cardiovascular care",
        estimatedWaitTime: 30,
        maxQueueSize: 15,
        currentQueueSize: 8,
        isActive: true,
      },
      {
        id: "dept-3",
        name: "Orthopedics",
        description: "Bone and joint specialists",
        estimatedWaitTime: 25,
        maxQueueSize: 12,
        currentQueueSize: 5,
        isActive: true,
      },
      {
        id: "dept-4",
        name: "Pediatrics",
        description: "Healthcare for children",
        estimatedWaitTime: 20,
        maxQueueSize: 10,
        currentQueueSize: 3,
        isActive: true,
      },
    ],
    isAcceptingBookings: true,
    location: { lat: 40.7128, lng: -74.006 },
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "business-2",
    name: "Glamour Hair & Beauty Salon",
    ownerId: "business-2",
    category: "salon",
    address: "456 Fashion Ave, New York, NY 10018",
    description:
      "Premium hair styling, coloring, and beauty treatments in a luxurious setting.",
    coverPhoto:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=salon",
    rating: 4.8,
    totalReviews: 892,
    openingHours: {
      monday: { start: "09:00", end: "19:00", closed: false },
      tuesday: { start: "09:00", end: "19:00", closed: false },
      wednesday: { start: "09:00", end: "19:00", closed: false },
      thursday: { start: "09:00", end: "20:00", closed: false },
      friday: { start: "09:00", end: "20:00", closed: false },
      saturday: { start: "08:00", end: "18:00", closed: false },
      sunday: { start: "10:00", end: "17:00", closed: false },
    },
    departments: [
      {
        id: "dept-5",
        name: "Hair Cut & Styling",
        description: "Professional haircuts and styling services",
        estimatedWaitTime: 45,
        maxQueueSize: 12,
        currentQueueSize: 6,
        isActive: true,
        price: 65,
      },
      {
        id: "dept-6",
        name: "Hair Coloring",
        description: "Hair dyeing, highlights, and color treatments",
        estimatedWaitTime: 120,
        maxQueueSize: 8,
        currentQueueSize: 3,
        isActive: true,
        price: 150,
      },
      {
        id: "dept-7",
        name: "Manicure & Pedicure",
        description: "Nail care and nail art services",
        estimatedWaitTime: 60,
        maxQueueSize: 10,
        currentQueueSize: 4,
        isActive: true,
        price: 45,
      },
      {
        id: "dept-8",
        name: "Facial Treatments",
        description: "Deep cleansing and rejuvenating facial treatments",
        estimatedWaitTime: 75,
        maxQueueSize: 6,
        currentQueueSize: 2,
        isActive: true,
        price: 95,
      },
    ],
    isAcceptingBookings: true,
    location: { lat: 40.7589, lng: -73.9851 },
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "business-3",
    name: "First National Bank",
    ownerId: "business-3",
    category: "bank",
    address: "789 Financial St, New York, NY 10005",
    description:
      "Full-service banking with personal and business solutions, investment services.",
    coverPhoto:
      "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=bank",
    rating: 4.2,
    totalReviews: 567,
    openingHours: {
      monday: { start: "09:00", end: "17:00", closed: false },
      tuesday: { start: "09:00", end: "17:00", closed: false },
      wednesday: { start: "09:00", end: "17:00", closed: false },
      thursday: { start: "09:00", end: "18:00", closed: false },
      friday: { start: "09:00", end: "18:00", closed: false },
      saturday: { start: "09:00", end: "14:00", closed: false },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
    departments: [
      {
        id: "dept-9",
        name: "Customer Service",
        description: "General banking inquiries and account services",
        estimatedWaitTime: 15,
        maxQueueSize: 20,
        currentQueueSize: 10,
        isActive: true,
      },
      {
        id: "dept-10",
        name: "Loan Services",
        description: "Personal and business loan consultations",
        estimatedWaitTime: 45,
        maxQueueSize: 8,
        currentQueueSize: 3,
        isActive: true,
      },
      {
        id: "dept-11",
        name: "Investment Advisory",
        description: "Financial planning and investment guidance",
        estimatedWaitTime: 60,
        maxQueueSize: 6,
        currentQueueSize: 2,
        isActive: true,
      },
    ],
    isAcceptingBookings: true,
    location: { lat: 40.7074, lng: -74.0113 },
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "business-4",
    name: "Downtown DMV Office",
    ownerId: "business-4",
    category: "government",
    address: "321 Government Plaza, New York, NY 10007",
    description:
      "Department of Motor Vehicles services including license renewals and vehicle registration.",
    coverPhoto:
      "https://images.unsplash.com/photo-1486312338219-ce68e2c6b39d?w=800",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=government",
    rating: 3.8,
    totalReviews: 234,
    openingHours: {
      monday: { start: "08:00", end: "16:30", closed: false },
      tuesday: { start: "08:00", end: "16:30", closed: false },
      wednesday: { start: "08:00", end: "16:30", closed: false },
      thursday: { start: "08:00", end: "16:30", closed: false },
      friday: { start: "08:00", end: "16:30", closed: false },
      saturday: { start: "00:00", end: "00:00", closed: true },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
    departments: [
      {
        id: "dept-12",
        name: "License Services",
        description: "Driver license applications and renewals",
        estimatedWaitTime: 35,
        maxQueueSize: 15,
        currentQueueSize: 9,
        isActive: true,
      },
      {
        id: "dept-13",
        name: "Vehicle Registration",
        description: "Car registration and title services",
        estimatedWaitTime: 25,
        maxQueueSize: 12,
        currentQueueSize: 7,
        isActive: true,
      },
      {
        id: "dept-14",
        name: "Road Test",
        description: "Driving test appointments",
        estimatedWaitTime: 60,
        maxQueueSize: 8,
        currentQueueSize: 2,
        isActive: true,
      },
    ],
    isAcceptingBookings: true,
    location: { lat: 40.7128, lng: -74.006 },
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "business-5",
    name: "Bella Vista Restaurant",
    ownerId: "business-5",
    category: "restaurant",
    address: "654 Culinary Blvd, New York, NY 10014",
    description:
      "Fine dining Italian restaurant with authentic cuisine and elegant atmosphere.",
    coverPhoto:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=restaurant",
    rating: 4.7,
    totalReviews: 1156,
    openingHours: {
      monday: { start: "11:00", end: "22:00", closed: false },
      tuesday: { start: "11:00", end: "22:00", closed: false },
      wednesday: { start: "11:00", end: "22:00", closed: false },
      thursday: { start: "11:00", end: "23:00", closed: false },
      friday: { start: "11:00", end: "23:00", closed: false },
      saturday: { start: "11:00", end: "23:00", closed: false },
      sunday: { start: "11:00", end: "21:00", closed: false },
    },
    departments: [
      {
        id: "dept-15",
        name: "Dining Room",
        description: "Main dining area for regular seating",
        estimatedWaitTime: 25,
        maxQueueSize: 20,
        currentQueueSize: 8,
        isActive: true,
      },
      {
        id: "dept-16",
        name: "Private Dining",
        description: "Private rooms for special occasions",
        estimatedWaitTime: 45,
        maxQueueSize: 6,
        currentQueueSize: 1,
        isActive: true,
      },
      {
        id: "dept-17",
        name: "Bar Seating",
        description: "Bar area with quick service options",
        estimatedWaitTime: 15,
        maxQueueSize: 12,
        currentQueueSize: 4,
        isActive: true,
      },
    ],
    isAcceptingBookings: true,
    location: { lat: 40.7342, lng: -74.0059 },
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
];

export let mockBookings: QueueBooking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    businessId: "business-1",
    departmentId: "dept-1",
    tokenNumber: 15,
    status: "waiting",
    customerName: "John Doe",
    customerPhone: "+1-555-0123",
    notes: "Chest pain, arrived by ambulance",
    estimatedWaitTime: 30,
    bookedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "booking-2",
    userId: "user-1",
    businessId: "business-2",
    departmentId: "dept-5",
    tokenNumber: 8,
    status: "completed",
    customerName: "John Doe",
    customerPhone: "+1-555-0123",
    notes: "Regular haircut, trim the sides",
    estimatedWaitTime: 45,
    actualWaitTime: 40,
    bookedAt: "2024-01-19T11:00:00Z",
    checkedInAt: "2024-01-19T11:15:00Z",
    completedAt: "2024-01-19T12:00:00Z",
  },
  {
    id: "booking-3",
    userId: "user-2",
    businessId: "business-3",
    departmentId: "dept-9",
    tokenNumber: 12,
    status: "approved",
    customerName: "Sarah Johnson",
    customerPhone: "+1-555-0124",
    notes: "Need to open a new savings account",
    estimatedWaitTime: 15,
    bookedAt: "2024-01-20T09:45:00Z",
  },
  {
    id: "booking-4",
    userId: "user-2",
    businessId: "business-5",
    departmentId: "dept-15",
    tokenNumber: 6,
    status: "cancelled",
    customerName: "Sarah Johnson",
    customerPhone: "+1-555-0124",
    notes: "Table for 2, window seating preferred",
    estimatedWaitTime: 25,
    bookedAt: "2024-01-18T18:30:00Z",
    cancelledAt: "2024-01-18T19:00:00Z",
  },
];

// Utility functions for mock data
export const addBooking = (booking: QueueBooking) => {
  mockBookings.push(booking);
  // Update business queue size
  const business = mockBusinesses.find((b) => b.id === booking.businessId);
  if (business) {
    const department = business.departments.find(
      (d) => d.id === booking.departmentId,
    );
    if (department) {
      department.currentQueueSize++;
    }
  }
};

export const updateBooking = (
  bookingId: string,
  updates: Partial<QueueBooking>,
) => {
  const index = mockBookings.findIndex((b) => b.id === bookingId);
  if (index !== -1) {
    mockBookings[index] = { ...mockBookings[index], ...updates };
  }
};

export const removeBooking = (bookingId: string) => {
  const booking = mockBookings.find((b) => b.id === bookingId);
  if (booking) {
    // Update business queue size
    const business = mockBusinesses.find((b) => b.id === booking.businessId);
    if (business) {
      const department = business.departments.find(
        (d) => d.id === booking.departmentId,
      );
      if (department && department.currentQueueSize > 0) {
        department.currentQueueSize--;
      }
    }
  }
  mockBookings = mockBookings.filter((b) => b.id !== bookingId);
};
