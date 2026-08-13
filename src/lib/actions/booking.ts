"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation/booking";

export type BookingFormState = {
  fieldErrors?: Record<string, string>;
  error?: string;
};

export async function createBookingAction(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const raw = {
    packageId: String(formData.get("packageId") ?? ""),
    travelDate: String(formData.get("travelDate") ?? ""),
    numberOfTravelers: formData.get("numberOfTravelers"),
    travelerNotes: String(formData.get("travelerNotes") ?? "") || undefined,
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const pkg = await prisma.tourPackage.findUnique({ where: { id: parsed.data.packageId } });
  if (!pkg || !pkg.isActive) {
    return { error: "This tour package is no longer available." };
  }

  if (parsed.data.numberOfTravelers > pkg.maxGroupSize) {
    return {
      fieldErrors: {
        numberOfTravelers: `This tour allows a maximum of ${pkg.maxGroupSize} travelers.`,
      },
    };
  }

  const totalAmount = Number(pkg.price) * parsed.data.numberOfTravelers;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      packageId: pkg.id,
      travelDate: new Date(parsed.data.travelDate),
      numberOfTravelers: parsed.data.numberOfTravelers,
      travelerNotes: parsed.data.travelerNotes,
      totalAmount,
      status: "PENDING_PAYMENT",
    },
  });

  redirect(`/booking/${booking.id}/payment`);
}
