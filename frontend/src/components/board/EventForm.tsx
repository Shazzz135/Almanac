import React, { useState, useRef, useEffect } from 'react';

interface EventFormProps {
  defaultDate: Date;
  onCancel: () => void;
  onSubmit: (event: {
    title: string;
    description: string;
    color: string;
    location: string;
    start: string;
    end: string;
    allDay: boolean;
  }) => void;
}


interface ColorDropdownProps {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ colors, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex items-center justify-between px-2 py-1 rounded border border-gray-600 min-w-[44px] w-full transition-colors"
        style={{ backgroundColor: value }}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="sr-only">Selected color</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L8 8L14 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 left-0 bg-[#232c3b] border border-gray-600 rounded shadow-lg p-2 flex flex-wrap gap-2 min-w-[120px]" role="listbox">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-7 h-7 rounded border-2 ${value === c ? 'border-blue-500' : 'border-white'} focus:outline-none`}
              style={{ backgroundColor: c }}
              aria-selected={value === c}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventForm: React.FC<EventFormProps> = ({ defaultDate, onCancel, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const COLORS = [
    '#e11d48', // red
    '#f59e42', // orange
    '#fbbf24', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#2563eb', // blue
    '#6366f1', // indigo
    '#a21caf', // violet
    '#f472b6', // pink
    '#64748b', // slate gray
    '#9ca3af', // light gray
    '#374151'  // dark gray
  ];
  const [color, setColor] = useState(COLORS[0]);
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [start, setStart] = useState(() => {
    const startStr = defaultDate.toISOString().slice(0, 16);
    console.log('[EventForm] Initializing start:', startStr);
    return startStr;
  });
  const [end, setEnd] = useState(() => {
    // Set end time to 1 hour after start time
    const endDate = new Date(defaultDate);
    endDate.setHours(endDate.getHours() + 1);
    const endStr = endDate.toISOString().slice(0, 16);
    console.log('[EventForm] Initializing end (start + 1hr):', endStr);
    return endStr;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const eventData = { title, description, color, location, start, end, allDay };
    console.log('[EventForm] Submitting event:', eventData);
    console.log('[EventForm] Start parsed:', new Date(start));
    console.log('[EventForm] End parsed:', new Date(end));
    console.log('[EventForm] End > Start?', new Date(end) > new Date(start));
    console.log('[EventForm] All Day?', allDay);
    onSubmit(eventData);
  }

  return (
    <form className="flex flex-col gap-3 p-2" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <label className="flex flex-col gap-1 text-blue-200 flex-1">
          Title
          <input className="rounded p-2 bg-[#232c3b] text-blue-100 w-full" value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1 text-blue-200 min-w-[90px]">
          <span className="text-xs mb-0.5">Color</span>
          <ColorDropdown
            colors={COLORS}
            value={color}
            onChange={setColor}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-blue-200">
        Description
        <textarea className="rounded p-2 bg-[#232c3b] text-blue-100 resize-none" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
      </label>
      <label className="flex flex-col gap-1 text-blue-200">
        Location
        <input className="rounded p-2 bg-[#232c3b] text-blue-100" value={location} onChange={e => setLocation(e.target.value)} />
      </label>
      <div className="flex flex-col gap-1 mt-1">
        <label className="flex items-center gap-2 mb-1 cursor-pointer select-none">
          <span className="text-blue-200 text-xs">All Day</span>
          <span className="relative inline-block w-10 h-5 align-middle">
            <input
              type="checkbox"
              checked={allDay}
              onChange={() => {
                setAllDay(!allDay);
                if (!allDay) {
                  // When enabling all day, set start to start of day and end to end of day
                  setStart(defaultDate.toISOString().slice(0, 10) + 'T00:00');
                  setEnd(defaultDate.toISOString().slice(0, 10) + 'T23:59');
                }
              }}
              className="sr-only peer"
            />
            <span className="block bg-gray-600 rounded-full h-5 w-10 transition peer-checked:bg-blue-600"></span>
            <span className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
          </span>
        </label>
        {!allDay && (
          <div className="flex items-center gap-3">
            <label className="flex flex-col gap-1 text-blue-200 flex-1 min-w-[80px]">
              Start
              <input
                type="time"
                className="rounded p-1 bg-[#232c3b] text-blue-100 text-sm"
                value={start.slice(11, 16)}
                onChange={e => setStart(start.slice(0, 10) + 'T' + e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-blue-200 flex-1 min-w-[80px]">
              End
              <input
                type="time"
                className="rounded p-1 bg-[#232c3b] text-blue-100 text-sm"
                value={end.slice(11, 16)}
                onChange={e => setEnd(end.slice(0, 10) + 'T' + e.target.value)}
                required
              />
            </label>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button type="button" className="flex-1 py-2 rounded bg-gray-600 text-white hover:bg-gray-700" onClick={onCancel}>Cancel</button>
        <button type="submit" className="flex-1 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create</button>
      </div>
    </form>
  );
};

export default EventForm;
