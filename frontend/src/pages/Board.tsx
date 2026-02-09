import { useState } from 'react';
import Calendar from "../components/board/Calendar";
import Switch from "../components/board/Switch";

export default function Board() {
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

    return (
        <div className="pt-4 flex items-stretch justify-center w-full gap-0">
            <Switch direction="left" onClick={handlePreviousMonth} />
            <Calendar displayMonth={displayMonth} displayYear={displayYear} />
            <Switch direction="right" onClick={handleNextMonth} />
        </div>
    );
}