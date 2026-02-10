import { User, Users } from 'lucide-react';
import type { Calendar } from '../../services/board/calendar';

interface CalendarListItemProps {
  calendar: Calendar;
  isOwner: boolean;
  isRemoving: boolean;
  isLast: boolean;
  onManage: () => void;
  onRemove: () => void;
}

export default function CalendarListItem({
  calendar,
  isOwner,
  isRemoving,
  isLast,
  onManage,
  onRemove,
}: CalendarListItemProps) {
  return (
    <li key={calendar._id + '-row'}>
      <div className="flex items-center gap-3 py-3">
        <span className="text-white font-medium truncate flex-1">{calendar.name}</span>
        <div className="flex-shrink-0">
          {calendar.type === 'personal' ? (
            <User className="w-5 h-5 text-blue-300" strokeWidth={2} />
          ) : (
            <Users className="w-5 h-5 text-blue-300" strokeWidth={2} />
          )}
        </div>
        <span className="text-xs text-gray-400 uppercase">{calendar.type}</span>
        {isOwner ? (
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-150"
            onClick={onManage}
          >
            Manage
          </button>
        ) : (
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onRemove}
            disabled={isRemoving}
          >
            Remove
          </button>
        )}
      </div>
      {!isLast && (
        <div key={calendar._id + '-divider'} className="border-t border-blue-500/20 w-full mx-auto" />
      )}
    </li>
  );
}
