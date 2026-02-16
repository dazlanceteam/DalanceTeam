
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { LucideIcon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface SidebarProps {
    navItems: NavItem[];
    activeSection: string;
    scrollToSection: (id: string) => void;
    completionPercentage: number;
}

export const Sidebar = ({
    navItems,
    activeSection,
    scrollToSection,
    completionPercentage
}: SidebarProps) => {
    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
                <div className="uppercase text-xs font-bold text-gray-400 tracking-wider mb-4 px-3">
                    Sections
                </div>
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            type="button" // Explicitly type button to prevent form submission
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={cn(
                                "w-full flex items-center group px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
                                isActive
                                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn(
                                "flex-shrink-0 w-5 h-5 mr-3 transition-colors",
                                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                            )} />
                            <span className="truncate">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            )}
                        </button>
                    );
                })}

                {/* Progress Indicator */}
                <div className="mt-8 px-3">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-medium text-gray-500">Completion</span>
                        <span className="text-xs font-bold text-blue-600">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};
