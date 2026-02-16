
import { motion, AnimatePresence } from 'framer-motion';
import { Check, type LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ToolCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    isToggled: boolean;
    onToggle: (checked: boolean) => void;
    children?: React.ReactNode;
}

export const ToolCard = ({
    icon: Icon,
    title,
    description,
    isToggled,
    onToggle,
    children
}: ToolCardProps) => {
    return (
        <div className={cn(
            "border rounded-xl transition-all duration-300 overflow-hidden",
            isToggled
                ? "border-blue-200 bg-blue-50/30 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
        )}>
            <div className="p-6 md:p-8 flex items-start gap-6">
                {/* Icon */}
                <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isToggled ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                )}>
                    <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <h3 className={cn(
                            "text-lg font-bold transition-colors",
                            isToggled ? "text-blue-900" : "text-gray-900"
                        )}>
                            {title}
                        </h3>

                        {/* Toggle Switch */}
                        <button
                            type="button"
                            onClick={() => onToggle(!isToggled)}
                            className={cn(
                                "relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                isToggled ? "bg-green-500" : "bg-gray-200"
                            )}
                            role="switch"
                            aria-checked={isToggled}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center",
                                    isToggled ? "translate-x-6" : "translate-x-0"
                                )}
                            >
                                {isToggled && <Check className="w-4 h-4 text-green-600" />}
                            </span>
                        </button>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Expandable Input Section */}
            <AnimatePresence>
                {isToggled && children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 md:pl-[calc(2rem+1.5rem+3rem)]">
                            {/* Indent to align with text: padding-left + icon width + gap */}
                            <div className="pt-4 border-t border-blue-100/50">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
