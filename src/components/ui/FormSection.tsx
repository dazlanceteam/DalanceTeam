
import React from 'react';

export const FormSection = ({
    id,
    title,
    description,
    children
}: {
    id: string;
    title: string;
    description?: string;
    children: React.ReactNode
}) => {
    return (
        <div id={id} className="scroll-mt-24 mb-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="p-8 space-y-8">
                {children}
            </div>
        </div>
    );
};
