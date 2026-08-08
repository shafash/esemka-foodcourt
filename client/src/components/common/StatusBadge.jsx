import Badge from "./Badge";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  completed: { label: "Completed", variant: "info" },
  canceled: { label: "Canceled", variant: "danger" },
  upcoming: { label: "Upcoming", variant: "neutral" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: "neutral" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default StatusBadge;