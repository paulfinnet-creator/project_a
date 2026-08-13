import { z } from "zod";

export const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  itinerary: z.string().min(10, "Add at least one itinerary line"),
  location: z.string().min(2, "Location is required"),
  durationDays: z.coerce.number().int().min(1, "Must be at least 1 day"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  maxGroupSize: z.coerce.number().int().min(1, "Must be at least 1"),
  imageUrl: z.string().url("Enter a valid image URL"),
  gallery: z.string(),
  isActive: z.boolean(),
});

export type PackageInput = z.infer<typeof packageSchema>;
