import { Badge, type BadgeProps } from "@/components/ui/badge";

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  PENDING_PAYMENT: { label: "Awaiting Payment", variant: "muted" },
  PAID: { label: "Paid", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  COMPLETED: { label: "Completed", variant: "default" },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
