import React from 'react';

interface UseModalFormLayoutProps {
  title: string;
  children: React.ReactNode;
  error?: string | null;
  onCancel?: () => void;
  onSubmitText?: string;
  onCancelText?: string;
  onSubmit?: (e: React.FormEvent) => void;
  actions?: React.ReactNode;
}

/**
 * Provides a consistent modal form layout for forms like CreateCalendar and InviteUser.
 * Usage: Wrap your form fields in <ModalFormLayout> and pass title, error, actions, etc.
 */
export function useModalFormLayout() {
  return function ModalFormLayout({
    title,
    children,
    error,
    onCancel,
    onSubmitText = 'Submit',
    onCancelText = 'Cancel',
    onSubmit,
    actions,
  }: UseModalFormLayoutProps) {
    return (
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-2 text-center">{title}</h2>
        {children}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {actions ? (
          <div className="flex gap-2 mt-2 justify-end">{actions}</div>
        ) : (
          <div className="flex gap-2 mt-2 justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition-all"
              >
                {onCancelText}
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition-all"
            >
              {onSubmitText}
            </button>
          </div>
        )}
      </form>
    );
  };
}
