import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layout
import { FormLayout } from './layouts/FormLayout';

// Lazy loaded page components
const IntakeForm = lazy(() => import('./components/IntakeForm'));
const DigitalPresenceForm = lazy(() => import('./components/DigitalPresenceForm'));
const ProfessionalFinancialForm = lazy(() => import('./components/ProfessionalFinancialForm'));

// Fallback loader
const PageLoader = () => (
    <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <FormLayout />,
        errorElement: <Navigate to="/basicinfo" replace />,
        children: [
            {
                index: true,
                element: <Navigate to="/basicinfo" replace />,
            },
            {
                path: 'basicinfo',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <IntakeForm />
                    </Suspense>
                ),
            },
            {
                path: 'requirements',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <DigitalPresenceForm />
                    </Suspense>
                ),
            },
            {
                path: 'finish',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProfessionalFinancialForm />
                    </Suspense>
                ),
            }
        ],
    },
    {
        path: '*',
        element: <Navigate to="/basicinfo" replace />,
    }
]);
