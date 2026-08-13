import { z } from "zod";

export const bookingSchema = z.object({
  packageId: z.string().min(1),
  travelDate: z
    .string()
    .min(1, "Select a travel date")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), "Enter a valid date")
    .refine((val) => new Date(val).getTime() > Date.now(), "Travel date must be in the future"),
  numberOfTravelers: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "At least 1 traveler is required"),
  travelerNotes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
