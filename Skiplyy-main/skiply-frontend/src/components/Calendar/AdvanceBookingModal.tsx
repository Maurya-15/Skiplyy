import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  X,
  MessageSquare,
  Star,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import QRCode from "react-qr-code";


interface Department {
  id: string;
  name: string;
  estimatedWaitTime: number;
  currentQueueSize: number;
  maxQueueSize: number;
  isActive: boolean;
  description?: string;
  price?: number;
}

interface AdvanceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  business?: any;
  date?: Date | null;
  time?: string | null;
}

interface BookingData {
  departmentId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  date?: string;
  time?: string;
  tokenNumber?: number;
  estimatedWaitTime?: number;
  bookingId?: string;
  qrCode?: string;
}

const AdvanceBookingModal: React.FC<AdvanceBookingModalProps> = ({ isOpen, onClose, business, date, time }): JSX.Element => {
  // Defensive fallback: ensure departments is always an array of objects
  let safeBusiness = business;
  if (business && Array.isArray(business.departments) && typeof business.departments[0] === 'string') {
    safeBusiness = {
      ...business,
      departments: business.departments.map((name: string, i: number) => ({
        id: `dept-${i}`,
        name,
        currentQueueSize: 0,
        maxQueueSize: 20,
        estimatedWaitTime: 10,
        isActive: true,
      }))
    };
  }

  const { user } = useAuth();
  // If there is only one department, or a department is preselected, skip to details step
  const autoDepartment = safeBusiness?.departments && safeBusiness.departments.length === 1 ? safeBusiness.departments[0] : null;
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(autoDepartment);
  const [step, setStep] = useState<"departments" | "details" | "confirm" | "success">(
    autoDepartment ? "details" : "departments"
  );

  const [bookingData, setBookingData] = useState<BookingData>({
    departmentId: "",
    customerName: user?.name || "",
    customerPhone: user?.phone || '',
    customerEmail: user?.email,
    notes: "",
    date: date ? date.toISOString() : undefined,
    time: time || undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment(dept);
    setBookingData(prev => ({ ...prev, departmentId: dept.id }));
    setStep("details");
  };

  const handleDetailsSubmit = () => {
    if (!bookingData.customerName || !bookingData.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedDepartment || !user) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/queues/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: business._id || business.id,
          businessName: business.businessName || business.name,
          departmentName: selectedDepartment.name,
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          notes: bookingData.notes,
          bookedAt: date ? date.toISOString() : new Date().toISOString(),
          time: time || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to create booking");
      const booking = await res.json();
      setBookingData(prev => ({
        ...prev,
        tokenNumber: booking.tokenNumber || booking.token || 1,
        estimatedWaitTime: selectedDepartment.estimatedWaitTime,
        bookingId: booking._id,
        qrCode: booking.qrCode,
      }));
      setStep("success");
      toast.success("Your booking has been confirmed!");
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setStep("departments");
    setSelectedDepartment(null);
    setBookingData({
      departmentId: "",
      customerName: user?.name || "",
      customerPhone: user?.phone || '',
      customerEmail: user?.email,
      notes: "",
      date: date ? date.toISOString() : undefined,
      time: time || undefined,
    });
  };

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-6">
          {["departments", "details", "confirm", "success"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold transition-colors duration-200 ` +
                  (step === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-gray-300 text-gray-400 bg-white")
                }
              >
                {idx + 1}
              </div>
              {idx < 3 && <div className="w-8 h-1 bg-gray-300 mx-1 rounded" />}
            </div>
          ))}
        </div>

        {/* Step: Department Selection */}
        {step === "departments" && (
          <div className="space-y-4">
            <h3 className="font-medium mb-3">Select a Department/Service</h3>
            <div className="space-y-2">
              {(business?.departments || []).map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentSelect(dept)}
                  className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{dept.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{dept.estimatedWaitTime} min wait</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{dept.currentQueueSize}/{dept.maxQueueSize} in queue</span>
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: User Details */}
        {step === "details" && selectedDepartment && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => setStep('departments')} className="p-0 h-auto">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">{selectedDepartment.name}</span>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleDetailsSubmit(); }} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Full Name</label>
                <Input
                  required
                  placeholder="Enter your full name"
                  value={bookingData.customerName}
                  onChange={e => setBookingData(f => ({ ...f, customerName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <Input
                  required
                  placeholder="Enter your phone number"
                  value={bookingData.customerPhone}
                  onChange={e => setBookingData(f => ({ ...f, customerPhone: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Additional Notes (Optional)</label>
                <Textarea
                  placeholder="Any additional information or special requests..."
                  value={bookingData.notes}
                  onChange={e => setBookingData(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">
                Continue to Confirmation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && selectedDepartment && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => setStep('details')} className="p-0 h-auto">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">Confirm Booking</span>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h3 className="font-medium">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business:</span>
                  <span className="font-medium">{business?.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedDepartment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{date ? date.toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{time || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{bookingData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{bookingData.customerPhone}</span>
                </div>
                {bookingData.notes && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Notes:</span>
                    <span className="font-medium">{bookingData.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <Button className="w-full" onClick={handleConfirmBooking} disabled={isLoading}>
              {isLoading ? "Booking..." : "Confirm & Book"}
            </Button>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Booking Confirmed!</h3>
            <div className="text-center text-muted-foreground">
              Your booking for <span className="font-medium">{selectedDepartment?.name}</span> on <span className="font-medium">{date ? date.toLocaleDateString() : "N/A"}</span> at <span className="font-medium">{time || "N/A"}</span> is confirmed.
            </div>
            <Button className="mt-4" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// --- Named export for modal below ---
export { AdvanceBookingModal };