import type { Metadata } from "next";
import { PackageForm } from "@/components/admin/package-form";
import { createPackageAction } from "@/lib/actions/admin-packages";

export const metadata: Metadata = { title: "New Package" };

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">New Tour Package</h1>
      <div className="mt-6">
        <PackageForm action={createPackageAction} submitLabel="Create Package" />
      </div>
    </div>
  );
}
