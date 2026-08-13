"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { togglePackageActiveAction, deletePackageAction } from "@/lib/actions/admin-packages";

export function PackageRowActions({
  packageId,
  isActive,
  hasBookings,
}: {
  packageId: string;
  isActive: boolean;
  hasBookings: boolean;
}) {
  const [active, setActive] = useState(isActive);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    const next = !active;
    setActive(next);
    startTransition(async () => {
      try {
        await togglePackageActiveAction(packageId, next);
      } catch {
        toast.error("Failed to update package");
        setActive(!next);
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deletePackageAction(packageId);
        toast.success("Package deleted");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete package");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/packages/${packageId}/edit`}>Edit</Link>
      </Button>
      <Button size="sm" variant="ghost" onClick={handleToggle} disabled={isPending}>
        {active ? "Deactivate" : "Activate"}
      </Button>
      {!hasBookings && (
        <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isPending}>
          Delete
        </Button>
      )}
    </div>
  );
}
