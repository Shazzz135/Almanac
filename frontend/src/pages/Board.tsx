import { useState } from 'react';
import Calendar from "../components/board/Calendar";
import Switch from "../components/board/Switch";

export default function Board() {
    const today = new Date();
    const [displayMonth, setDisplayMonth] = useState(today.getMonth());
    const [displayYear, setDisplayYear] = useState(today.getFullYear());

    const handlePreviousMonth = () => {
        setDisplayMonth(prev => {
            if (prev === 0) {
                setDisplayYear(year => year - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const handleNextMonth = () => {
        setDisplayMonth(prev => {
            if (prev === 11) {
                setDisplayYear(year => year + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    return (
        <div className="pt-4 flex items-stretch justify-center w-full gap-0">
            <Switch direction="left" onClick={handlePreviousMonth} />
            <Calendar displayMonth={displayMonth} displayYear={displayYear} />
            <Switch direction="right" onClick={handleNextMonth} />
        </div>
    );
}