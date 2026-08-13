"use client";

import { useActionState, useMemo, useState } from "react";
import { createBookingAction, type BookingFormState } from "@/lib/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

const initialState: BookingFormState = {};

export function BookingForm({
  packageId,
  pricePerPerson,
  maxGroupSize,
}: {
  packageId: string;
  pricePerPerson: number;
  maxGroupSize: number;
}) {
  const [state, formAction, pending] = useActionState(createBookingAction, initialState);
  const [travelers, setTravelers] = useState(1);

  const total = useMemo(() => pricePerPerson * travelers, [pricePerPerson, travelers]);
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="packageId" value={packageId} />

      <div className="space-y-2">
        <Label htmlFor="travelDate">Travel date</Label>
        <Input id="travelDate" name="travelDate" type="date" min={minDate} required />
        {state.fieldErrors?.travelDate && (
          <p className="text-sm text-destructive">{state.fieldErrors.travelDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfTravelers">Number of travelers</Label>
        <Input
          id="numberOfTravelers"
          name="numberOfTravelers"
          type="number"
          min={1}
          max={maxGroupSize}
          required
          value={travelers}
          onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
        />
        <p className="text-xs text-muted-foreground">Maximum {maxGroupSize} per booking.</p>
        {state.fieldErrors?.numberOfTravelers && (
          <p className="text-sm text-destructive">{state.fieldErrors.numberOfTravelers}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="travelerNotes">Notes (optional)</Label>
        <Textarea
          id="travelerNotes"
          name="travelerNotes"
          rows={3}
          placeholder="Dietary needs, arrival flight details, special requests..."
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {formatCurrency(pricePerPerson)} × {travelers} traveler{travelers > 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between font-display text-xl font-bold text-foreground">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating booking..." : "Continue to Payment"}
      </Button>
    </form>
  );
}
