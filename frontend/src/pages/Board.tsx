import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import { useCalendar } from '../hooks/board/useCalendar';
import { createCalendar } from '../services/board/calendar';
import Calendar from "../components/board/Calendar";
import Switch from "../components/board/Switch";
import CreateCalendarForm from '../components/board/CreateCalendarForm';
import Modal from '../components/ui/Modal';

export default function Board() {
    const { isAuthenticated, isLoading } = useAuth();
    const { calendars, isLoading: calLoading, refreshCalendars } = useCalendar();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const today = new Date();
    const [{ displayMonth, displayYear }, setDisplay] = useState({
        displayMonth: today.getMonth(),
        displayYear: today.getFullYear(),
    });

    const handlePreviousMonth = () => {
        setDisplay(prev => {
            if (prev.displayMonth === 0) {
                return {
                    displayMonth: 11,
                    displayYear: prev.displayYear - 1,
                };
            }
            return {
                displayMonth: prev.displayMonth - 1,
                displayYear: prev.displayYear,
            };
        });
    };

    const handleNextMonth = () => {
        setDisplay(prev => {
            if (prev.displayMonth === 11) {
                return {
                    displayMonth: 0,
                    displayYear: prev.displayYear + 1,
                };
            }
            return {
                displayMonth: prev.displayMonth + 1,
                displayYear: prev.displayYear,
            };
        });
    };

    const handleCreateCalendar = async (data: { name: string; description: string }) => {
        try {
            await createCalendar(data.name, data.description);
            await refreshCalendars();
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            console.error('[Board] Failed to create calendar:', errorMsg);
            throw err;
        }
    };

    // Redirect to landing page if not authenticated (check only after auth loading is complete)
    if (!isLoading && !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Return early if auth is still loading or not authenticated yet
    if (isLoading || !isAuthenticated) {
        return null;
    }

    // If calendars are still loading, show only the calendar (no switches during loading)
    if (calLoading) {
        return (
            <div className="pt-4 flex items-stretch justify-center w-full">
                <Calendar displayMonth={displayMonth} displayYear={displayYear} />
            </div>
        );
    }

    // Show create calendar prompt if no calendars found
    if (calendars.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-3xl font-bold text-blue-100">No Calendars Yet</h2>
                    <p className="text-gray-300 text-lg">Create your first calendar to get started</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Calendar
                    </button>
                </div>

                {/* Create Calendar Modal */}
                <Modal open={showCreateModal} disableClickOutside>
                    <CreateCalendarForm
                        onSubmit={handleCreateCalendar}
                        isLoading={false}
                        onCancel={() => setShowCreateModal(false)}
                    />
                </Modal>
            </div>
        );
    }

    // Calendars loaded and found - show with switches
    return (
        <div className="pt-4 flex items-stretch justify-center w-full gap-0">
            <Switch direction="left" onClick={handlePreviousMonth} />
            <Calendar displayMonth={displayMonth} displayYear={displayYear} />
            <Switch direction="right" onClick={handleNextMonth} />
        </div>
    );
}