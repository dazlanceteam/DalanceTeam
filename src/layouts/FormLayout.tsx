import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';

// Define the shape of our global form state
export type GlobalFormData = {
    // We can loosely type it or build a strict interface if needed
    [key: string]: any;
};

export type FormContextType = {
    formData: GlobalFormData;
    updateFormData: (newData: Partial<GlobalFormData>) => void;
    sessionId: string;
};

export function FormLayout() {
    const [formData, setFormData] = useState<GlobalFormData>({});
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        // Keep the session consistent across page reloads during the form submission
        let storedSessionId = sessionStorage.getItem('dazlance_form_session_id');
        if (!storedSessionId) {
            storedSessionId = crypto.randomUUID();
            sessionStorage.setItem('dazlance_form_session_id', storedSessionId);
        }
        setSessionId(storedSessionId);
    }, []);

    // Function to merge incoming data with the existing state
    const updateFormData = useCallback((newData: Partial<GlobalFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    }, []);

    // Prevent rendering outlet if sessionId hasn't generated yet
    if (!sessionId) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* 
        The top-level container for all form views.
        Using Outlet to render the nested route components (Intake, DigitalPresence, etc) 
        and passing the state via context so they can all read/write to it.
      */}
            <div className="w-full relative flex-1">
                <Outlet context={{ formData, updateFormData, sessionId } satisfies FormContextType} />
            </div>
        </div>
    );
}
