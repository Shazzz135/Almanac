import { useState } from 'react';

interface CreateCalendarFormProps {
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel?: () => void;
}

export default function CreateCalendarForm({ onSubmit, onCancel }: CreateCalendarFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Create Calendar</h2>
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Name <span className="text-red-400">*</span></span>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Calendar name"
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Description</span>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[60px]"
          placeholder="Optional description"
        />
      </label>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="flex gap-2 mt-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition-all">Cancel</button>
        )}
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition-all">Create</button>
      </div>
    </form>
  );
}
