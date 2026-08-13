"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PackageFormState } from "@/lib/actions/admin-packages";
import type { TourPackage } from "@prisma/client";

const initialState: PackageFormState = {};

export type PackageFormDefaultValues = Omit<TourPackage, "price"> & { price: number };

export function PackageForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: PackageFormState, formData: FormData) => Promise<PackageFormState>;
  defaultValues?: PackageFormDefaultValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const gallery: string[] = defaultValues?.gallery ? JSON.parse(defaultValues.gallery) : [];

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={defaultValues?.title} required />
          {state.fieldErrors?.title && (
            <p className="text-sm text-destructive">{state.fieldErrors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="lagos-city-explorer"
            defaultValue={defaultValues?.slug}
            required
          />
          {state.fieldErrors?.slug && (
            <p className="text-sm text-destructive">{state.fieldErrors.slug}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          defaultValue={defaultValues?.summary}
          required
        />
        {state.fieldErrors?.summary && (
          <p className="text-sm text-destructive">{state.fieldErrors.summary}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          required
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-destructive">{state.fieldErrors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="itinerary">Itinerary (one line per day)</Label>
        <Textarea
          id="itinerary"
          name="itinerary"
          rows={5}
          placeholder={"Day 1: Arrival & orientation\nDay 2: ..."}
          defaultValue={defaultValues?.itinerary}
          required
        />
        {state.fieldErrors?.itinerary && (
          <p className="text-sm text-destructive">{state.fieldErrors.itinerary}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={defaultValues?.location} required />
          {state.fieldErrors?.location && (
            <p className="text-sm text-destructive">{state.fieldErrors.location}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationDays">Duration (days)</Label>
          <Input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            defaultValue={defaultValues?.durationDays}
            required
          />
          {state.fieldErrors?.durationDays && (
            <p className="text-sm text-destructive">{state.fieldErrors.durationDays}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxGroupSize">Max group size</Label>
          <Input
            id="maxGroupSize"
            name="maxGroupSize"
            type="number"
            min={1}
            defaultValue={defaultValues?.maxGroupSize}
            required
          />
          {state.fieldErrors?.maxGroupSize && (
            <p className="text-sm text-destructive">{state.fieldErrors.maxGroupSize}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price per person (USD)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={1}
          step="0.01"
          defaultValue={defaultValues ? Number(defaultValues.price) : undefined}
          required
        />
        {state.fieldErrors?.price && (
          <p className="text-sm text-destructive">{state.fieldErrors.price}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Cover image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={defaultValues?.imageUrl}
          required
        />
        {state.fieldErrors?.imageUrl && (
          <p className="text-sm text-destructive">{state.fieldErrors.imageUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gallery">Gallery image URLs (one per line)</Label>
        <Textarea id="gallery" name="gallery" rows={3} defaultValue={gallery.join("\n")} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={defaultValues?.isActive ?? true}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="isActive" className="font-normal">
          Published (visible to travelers)
        </Label>
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
