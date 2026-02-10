interface CalendarInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  disabled?: boolean;
}

export default function CalendarInfoSection({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  disabled = false,
}: CalendarInfoSectionProps) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Name <span className="text-red-400">*</span></span>
        <input
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Calendar name"
          required
          disabled={disabled}
        />
      </label>
      <label className="flex flex-col gap-1 mt-2">
        <span className="text-gray-300 font-medium">Description</span>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[60px]"
          placeholder="Optional description"
          disabled={disabled}
        />
      </label>
    </>
  );
}
