interface SwitchProps {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled?: boolean;
}

export default function Switch({ direction, onClick, disabled = false }: SwitchProps) {
    const isLeft = direction === 'left';
    const arrow = isLeft ? '<' : '>';
    const arrowLabel = isLeft ? 'Previous Month' : 'Next Month';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 self-stretch flex items-center justify-center px-2 text-4xl font-bold transition-all duration-200 active:scale-95 ${
                disabled 
                    ? 'hidden' 
                    : 'text-gray-400 hover:text-7xl hover:text-blue-400 cursor-pointer'
            }`}
            title={arrowLabel}
            aria-label={arrowLabel}
        >
            {arrow}
        </button>
    );
}