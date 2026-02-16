
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const InputGroup = ({
    label,
    error,
    required,
    helperText,
    children
}: {
    label: string;
    error?: string;
    required?: boolean;
    helperText?: string;
    children: React.ReactNode
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group">
            <div className="md:col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 cursor-pointer">
                    {label} {required && <span className="text-blue-500">*</span>}
                </label>
                <div className="relative">
                    {children}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center mt-2 text-red-500 text-sm animate-fadeIn">
                        <AlertCircle className="w-4 h-4 mr-1.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Context/Helper Text */}
                {helperText && !error && (
                    <div className="mt-2 text-xs text-gray-400 flex items-start">
                        <span className="inline-block mr-1.5 mt-0.5 text-gray-300">↳</span>
                        {helperText}
                    </div>
                )}
            </div>
        </div>
    );
};
