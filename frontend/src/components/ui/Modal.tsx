
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  children: ReactNode;
  disableClickOutside?: boolean;
  onClose?: () => void;
}

function getBoardPortalRoot() {
  let el = document.getElementById('board-modal-root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'board-modal-root';
    document.body.appendChild(el);
  }
  return el;
}

export default function Modal({ open, children, disableClickOutside, onClose }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  // Use a portal to render modal inside board page layer
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
      onClick={disableClickOutside ? undefined : onClose}
    >
      <div
        className="bg-transparent w-full max-w-lg mx-auto flex flex-col justify-center items-center min-h-[200px]"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    getBoardPortalRoot()
  );
}
