import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { updatePackageAction } from "@/lib/actions/admin-packages";
import { getPackageByIdAdmin } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit Package" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params;
  const pkg = await getPackageByIdAdmin(id);
  if (!pkg) notFound();

  const boundAction = updatePackageAction.bind(null, pkg.id);
  const defaultValues = { ...pkg, price: Number(pkg.price) };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Edit Tour Package</h1>
      <div className="mt-6">
        <PackageForm action={boundAction} defaultValues={defaultValues} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
