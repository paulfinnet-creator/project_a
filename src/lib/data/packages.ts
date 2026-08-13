import { prisma } from "@/lib/prisma";

export function getActivePackages() {
  return prisma.tourPackage.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export function getPackageBySlug(slug: string) {
  return prisma.tourPackage.findUnique({ where: { slug } });
}

export function parseGallery(gallery: string): string[] {
  try {
    const parsed = JSON.parse(gallery);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
