"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function PaymentStatusPoller({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.bookingStatus === "PAID") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          router.push(`/booking/${bookingId}/confirmation`);
          router.refresh();
        }
      } catch {
        // transient network error — next poll will retry
      }
    }

    intervalRef.current = setInterval(poll, 4000);
    poll();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [bookingId, router]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
      Waiting for payment confirmation...
    </div>
  );
}
