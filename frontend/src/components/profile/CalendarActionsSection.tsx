interface CalendarActionsSectionProps {
  isCurrentUserOwner: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  onDeleteClick: () => void;
  onCancelClick: () => void;
}

export default function CalendarActionsSection({
  isCurrentUserOwner,
  isSubmitting,
  isDeleting,
  onDeleteClick,
  onCancelClick,
}: CalendarActionsSectionProps) {
  return (
    <div className="border-t border-gray-700 pt-4 flex gap-3 flex-shrink-0">
      {isCurrentUserOwner && (
        <button
          type="button"
          onClick={onDeleteClick}
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          disabled={isSubmitting || isDeleting}
        >
          Delete Calendar
        </button>
      )}
      <button
        type="button"
        onClick={onCancelClick}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        disabled={isSubmitting || isDeleting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        disabled={isSubmitting || isDeleting}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
