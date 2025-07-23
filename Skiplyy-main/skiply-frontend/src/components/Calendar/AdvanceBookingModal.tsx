import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { queueAPI } from "@/lib/api";
import type { Business } from "@/lib/types";

interface AdvanceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  time: string | null;
  business: Business;
}

export const AdvanceBookingModal: React.FC<AdvanceBookingModalProps> = ({
  isOpen,
  onClose,
  date,
  time,
  business,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!date || !time) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Compute startTime and endTime
      const [hour, minute] = time.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + 30 * 60000);
      await queueAPI.bookSlot(business._id, start.toISOString(), end.toISOString(), business.departments[0]?.name || "", name, phone, notes);
      toast.success("Advance booking successful!");
      onClose();
    } catch (err: any) {
      toast.error("Booking failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <div className="font-medium text-lg">
            {date.toLocaleDateString()} at {time}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 