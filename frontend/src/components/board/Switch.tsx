interface SwitchProps {
    direction: 'left' | 'right';
    onClick: () => void;
}

export default function Switch({ direction, onClick }: SwitchProps) {
    const isLeft = direction === 'left';
    const arrow = isLeft ? '<' : '>';
    const arrowLabel = isLeft ? 'Previous Month' : 'Next Month';

    return (
        <button
            onClick={onClick}
            className="flex-1 self-stretch flex items-center justify-center px-2 text-4xl font-bold text-gray-400 hover:text-7xl hover:text-blue-400 transition-all duration-200 active:scale-95 cursor-pointer"
            title={arrowLabel}
            aria-label={arrowLabel}
        >
            {arrow}
        </button>
    );
}