
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { LucideIcon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SelectableCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}

export const SelectableCard = ({
    icon: Icon,
    title,
    description,
    selected,
    onClick
}: SelectableCardProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ease-in-out w-full h-full text-left",
                selected
                    ? "border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-500"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
            )}
        >
            <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors",
                selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <h4 className={cn(
                "font-semibold text-gray-900 mb-1",
                selected ? "text-blue-900" : "text-gray-900"
            )}>{title}</h4>
            <p className="text-xs text-center text-gray-500 leading-relaxed">
                {description}
            </p>

            {/* Checkmark Indicator */}
            {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
};
