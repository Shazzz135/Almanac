import { useState } from 'react';

interface CreateCalendarFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function CreateCalendarForm({ onSubmit, onCancel, isLoading = false }: CreateCalendarFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError(null);
    
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      setSuccessMessage('✓ Calendar "' + name + '" created successfully');
      setTimeout(() => {
        setSuccessMessage(null);
        setName('');
        setDescription('');
        if (onCancel) onCancel();
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Create Calendar</h2>
      {successMessage && <div className="p-3 bg-green-900/20 border border-green-500 text-green-300 rounded text-sm">{successMessage}</div>}
      {error && <div className="p-3 bg-red-900/20 border border-red-500 text-red-300 rounded text-sm">{error}</div>}
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Name <span className="text-red-400">*</span></span>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Calendar name"
          required
          disabled={isLoading}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Description</span>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[60px]"
          placeholder="Optional description"
          disabled={isLoading}
        />
      </label>
      <div className="flex gap-2 mt-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>Cancel</button>
        )}
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
