import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

export const Modal = ({ onClose, isOpen, children }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldHandleClose = useRef(true);

  useEffect(() => {
    if (!isOpen) return;

    const focusableSelector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Auto-focus the first focusable element
    const timer = setTimeout(() => {
      const modal = contentRef.current;
      const firstFocusable = modal?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }

      if (e.key === 'Tab') {
        const focusables = contentRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
        if (!focusables || focusables.length === 0) return;

        const focusableArray = Array.from(focusables);
        const first = focusableArray[0];
        const last = focusableArray[focusableArray.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    const handlePopState = () => {
      shouldHandleClose.current = false;
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    window.history.pushState({ modal: true }, '');

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);

      if (shouldHandleClose.current) {
        window.history.back();
      } else {
        shouldHandleClose.current = true;
      }
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal( 
    <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick} aria-modal="true" role="dialog">
      <div ref={contentRef} className="modal-content box1 p-4">
        {children}
      </div>
    </div>,
    document.body
  );
};
