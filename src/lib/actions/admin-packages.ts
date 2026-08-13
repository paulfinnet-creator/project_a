"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validation/package";

export type PackageFormState = {
  fieldErrors?: Record<string, string>;
  error?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

function parseFormData(formData: FormData) {
  const galleryRaw = String(formData.get("gallery") ?? "");
  const gallery = galleryRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return packageSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    itinerary: String(formData.get("itinerary") ?? ""),
    location: String(formData.get("location") ?? ""),
    durationDays: formData.get("durationDays"),
    price: formData.get("price"),
    maxGroupSize: formData.get("maxGroupSize"),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    gallery: JSON.stringify(gallery),
    isActive: formData.get("isActive") === "on",
  });
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function createPackageAction(
  _prevState: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  await requireAdmin();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const existing = await prisma.tourPackage.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { fieldErrors: { slug: "A package with this slug already exists" } };
  }

  await prisma.tourPackage.create({ data: parsed.data });

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  redirect("/admin/packages");
}

export async function updatePackageAction(
  packageId: string,
  _prevState: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  await requireAdmin();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const existing = await prisma.tourPackage.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== packageId) {
    return { fieldErrors: { slug: "A package with this slug already exists" } };
  }

  await prisma.tourPackage.update({ where: { id: packageId }, data: parsed.data });

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${parsed.data.slug}`);
  redirect("/admin/packages");
}

export async function togglePackageActiveAction(packageId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.tourPackage.update({ where: { id: packageId }, data: { isActive } });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
}

export async function deletePackageAction(packageId: string) {
  await requireAdmin();

  const bookingCount = await prisma.booking.count({ where: { packageId } });
  if (bookingCount > 0) {
    throw new Error("Cannot delete a package that has bookings. Deactivate it instead.");
  }

  await prisma.tourPackage.delete({ where: { id: packageId } });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
}
