import Modal from '../ui/Modal';

interface RemoveCalendarModalProps {
  open: boolean;
  calendarName: string;
  isRemoving: boolean;
  error: string | null;
  success: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function RemoveCalendarModal({
  open,
  calendarName,
  isRemoving,
  error,
  success,
  onClose,
  onConfirm,
}: RemoveCalendarModalProps) {
  return (
    <Modal open={open} disableClickOutside>
      <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 max-w-md">
        <h3 className={`text-xl font-bold mb-4 ${success ? 'text-green-400' : 'text-red-400'}`}>
          {success ? 'Calendar Removed' : 'Remove Calendar'}
        </h3>
        {success && (
          <div className="mb-4 p-3 bg-green-600/20 border border-green-500/50 rounded text-green-300 text-sm">
            ✓ Successfully removed from {calendarName}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
        {!success && (
          <p className="text-gray-300 mb-6">
            Are you sure you want to remove yourself from <strong>{calendarName}</strong>? You will lose access to this calendar.
          </p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isRemoving}
          >
            {success ? 'OK' : error ? 'Close' : 'Cancel'}
          </button>
          {!success && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onConfirm}
              disabled={isRemoving || !!error}
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
