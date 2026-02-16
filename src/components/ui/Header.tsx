
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import logo from '../../assets/dazlance-logo.svg';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Header = ({ title, subtitle }: { title: string; subtitle: React.ReactNode }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <img
                            src={logo}
                            alt="Dazlance Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h1>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {subtitle}
                    </div>
                </div>
            </div>
        </header>
    );
};
