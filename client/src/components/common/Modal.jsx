import { useEffect } from "react";
import { FiX } from "react-icons/fi";

function Modal({ isOpen, onClose, title, children, footer, variant }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayClass = `modal-overlay${variant === "drawer" ? " modal-overlay--drawer" : ""}`;
  const modalClass = `modal${variant ? ` modal--${variant}` : ""}`;

  return (
    <div className={overlayClass} onClick={onClose}>
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className="modal__header">
            <h3 className="modal__title">{title}</h3>
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Tutup"
            >
              <FiX />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;