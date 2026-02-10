import Modal from '../ui/Modal';

interface DeleteCalendarModalProps {
  open: boolean;
  calendarName: string;
  isDeleting: boolean;
  deleteError: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteCalendarModal({
  open,
  calendarName,
  isDeleting,
  deleteError,
  onClose,
  onConfirm,
}: DeleteCalendarModalProps) {
  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Modal open={open}>
      <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-red-400 mb-3">Delete Calendar</h3>
        
        {deleteError ? (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded text-red-300 text-sm">
            {deleteError}
          </div>
        ) : isDeleting ? (
          <p className="text-gray-300 mb-4">Deleting calendar...</p>
        ) : (
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete <span className="font-semibold text-white">{calendarName}</span>? This will delete the calendar and all its members. This action cannot be undone.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
