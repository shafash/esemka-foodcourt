import { FiInbox } from "react-icons/fi";
import Button from "./Button";

function EmptyState({
  icon,
  title = "Belum ada data",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon || <FiInbox size={22} />}</span>
      <h4 className="empty-state__title">{title}</h4>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
