"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateBookingStatusAction } from "@/lib/actions/admin-bookings";

const STATUS_OPTIONS = [
  { value: "PENDING_PAYMENT", label: "Awaiting Payment" },
  { value: "PAID", label: "Paid" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function BookingStatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    startTransition(async () => {
      try {
        await updateBookingStatusAction(bookingId, next);
        toast.success("Booking status updated");
      } catch {
        toast.error("Failed to update status");
        setStatus(currentStatus);
      }
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
