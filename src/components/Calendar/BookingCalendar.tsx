import React, { useState, useMemo } from "react";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TimeSlot, Department } from "../../types";
import { cn } from "../../lib/utils";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  timeSlots: TimeSlot[];
  departments: Department[];
  selectedDepartment?: string;
  onTimeSlotSelect?: (slot: TimeSlot) => void;
  selectedTimeSlot?: TimeSlot;
  businessHours?: {
    start: string;
    end: string;
  };
  maxAdvanceDays?: number;
  className?: string;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateSelect,
  timeSlots,
  departments,
  selectedDepartment,
  onTimeSlotSelect,
  selectedTimeSlot,
  businessHours = { start: "09:00", end: "17:00" },
  maxAdvanceDays = 30,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate time slots for the selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDepartment) return [];

    const dateString = format(selectedDate, "yyyy-MM-dd");
    const daySlots = timeSlots.filter(
      (slot) =>
        slot.date === dateString && slot.departmentId === selectedDepartment,
    );

    // If no specific slots, generate default slots based on business hours
    if (daySlots.length === 0) {
      const defaultSlots: TimeSlot[] = [];
      const startHour = parseInt(businessHours.start.split(":")[0]);
      const endHour = parseInt(businessHours.end.split(":")[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          defaultSlots.push({
            id: `${dateString}-${timeString}`,
            time: timeString,
            date: dateString,
            available: true,
            capacity: 10,
            booked: Math.floor(Math.random() * 5), // Mock data
            departmentId: selectedDepartment,
            businessId: "current-business",
          });
        }
      }
      return defaultSlots;
    }

    return daySlots;
  }, [selectedDate, selectedDepartment, timeSlots, businessHours]);

  // Check if a date has available slots
  const getDateStatus = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const daySlots = timeSlots.filter((slot) => slot.date === dateString);

    if (daySlots.length === 0) return "available";

    const availableSlots = daySlots.filter(
      (slot) => slot.available && slot.booked < slot.capacity,
    );
    const busySlots = daySlots.filter(
      (slot) => slot.available && slot.booked >= slot.capacity * 0.8,
    );
    const fullSlots = daySlots.filter(
      (slot) => !slot.available || slot.booked >= slot.capacity,
    );

    if (fullSlots.length === daySlots.length) return "full";
    if (busySlots.length > availableSlots.length) return "busy";
    return "available";
  };

  // Disable dates that are in the past or beyond max advance days
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, maxAdvanceDays);
    return isBefore(date, today) || isBefore(maxDate, date);
  };

  const getTimeSlotStatus = (slot: TimeSlot) => {
    if (!slot.available) return "unavailable";
    if (slot.booked >= slot.capacity) return "full";
    if (slot.booked >= slot.capacity * 0.8) return "busy";
    return "available";
  };

  const getTimeSlotIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "busy":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "full":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border-0"
            classNames={{
              day_selected:
                "bg-gradient-primary text-white hover:bg-gradient-primary hover:text-white",
              day_today: "bg-gradient-accent text-white",
              day: cn(
                "h-9 w-9 p-0 font-normal transition-all hover:bg-accent",
                selectedDate &&
                  isSameDay(selectedDate, new Date()) &&
                  "bg-gradient-primary text-white",
              ),
            }}
            modifiers={{
              available: (date) =>
                !isDateDisabled(date) && getDateStatus(date) === "available",
              busy: (date) =>
                !isDateDisabled(date) && getDateStatus(date) === "busy",
              full: (date) =>
                !isDateDisabled(date) && getDateStatus(date) === "full",
            }}
            modifiersClassNames={{
              available: "calendar-day available",
              busy: "calendar-day busy",
              full: "calendar-day full",
            }}
          />

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-success"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-secondary"></div>
              <span>Busy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive"></div>
              <span>Full</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      {selectedDate && selectedDepartment && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Time Slots
              <Badge variant="outline" className="ml-auto">
                {format(selectedDate, "EEEE, MMM d")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableTimeSlots.map((slot) => {
                const status = getTimeSlotStatus(slot);
                const isSelected = selectedTimeSlot?.id === slot.id;

                return (
                  <Button
                    key={slot.id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center gap-1 h-auto py-3 transition-all duration-200",
                      isSelected && "bg-gradient-primary border-0 text-white",
                      status === "available" &&
                        !isSelected &&
                        "hover:bg-gradient-success/10 hover:border-green-300",
                      status === "busy" &&
                        !isSelected &&
                        "hover:bg-gradient-secondary/10 hover:border-yellow-300",
                      status === "full" && "opacity-50 cursor-not-allowed",
                    )}
                    disabled={status === "full" || status === "unavailable"}
                    onClick={() => onTimeSlotSelect?.(slot)}
                  >
                    <div className="flex items-center gap-1">
                      {getTimeSlotIcon(status)}
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Users className="w-3 h-3" />
                      <span>{slot.capacity - slot.booked} left</span>
                    </div>
                  </Button>
                );
              })}
            </div>

            {availableTimeSlots.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No time slots available for this date</p>
                <p className="text-sm">Please select a different date</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
