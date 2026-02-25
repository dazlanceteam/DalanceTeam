
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User,
    MapPin,
    Briefcase,
    Mail,
    Phone
} from 'lucide-react';

import { Header } from './ui/Header';
import { Sidebar } from './ui/Sidebar';
import { FormSection } from './ui/FormSection';
import { InputGroup } from './ui/InputGroup';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useNavigate, useOutletContext } from 'react-router-dom';
import type { FormContextType } from '../layouts/FormLayout';
import { useSupabaseForm } from '../hooks/useSupabaseForm';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Zod Schema ---
const intakeSchema = z.object({
    // Basics
    fullName: z.string().min(2, "We need your full legal name for contracts."),
    displayName: z.string().min(2, "What should we call you on Slack?"),
    dateOfBirth: z.string().optional(),
    genderPronouns: z.string().optional(),

    // Location
    cityCountry: z.string().min(2, "Where are you based?"),
    timeZone: z.string().min(1, "Time zone is crucial for syncs."),
    physicalAddress: z.string().optional(),

    // Professional persona
    jobTitle: z.string().min(2, "What's your main title?"),
    oneLiner: z.string().min(5, "Give us a quick punchy tagline."),
    bio: z.string().optional(),
    yearsExperience: z.number().min(0, "Years of experience must be 0 or more."),

    // Contact
    email: z.string().email("We need a valid email to invite you to tools."),
    phoneNumber: z.string().min(5, "We need a phone number just in case."),
});

type IntakeFormValues = z.infer<typeof intakeSchema>;

// --- Main Intake Form Component ---

export default function IntakeForm() {
    const [activeSection, setActiveSection] = useState('block-a');
    const [completionPercentage, setCompletionPercentage] = useState(0);

    // Routing & State hooks
    const navigate = useNavigate();
    const { formData, updateFormData, sessionId } = useOutletContext<FormContextType>();
    const { fetchLatestEntry, saveEntry, isLoading } = useSupabaseForm('Dazlance_basic_Info');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<IntakeFormValues>({
        resolver: zodResolver(intakeSchema),
        mode: 'onBlur',
        defaultValues: {
            ...formData, // Initialize with any returning data from global state
            yearsExperience: formData.yearsExperience || 0
        }
    });

    const formValues = watch();

    // Fetch existing data from Supabase on mount
    useEffect(() => {
        if (sessionId) {
            fetchLatestEntry(sessionId).then((dbData) => {
                if (dbData) {
                    const mappedData = {
                        fullName: dbData.Full_name || '',
                        displayName: dbData.Display_name || '',
                        dateOfBirth: dbData.DOB || '',
                        genderPronouns: dbData.Gender || '',
                        cityCountry: dbData.City || '',
                        timeZone: dbData.Time_zone || '',
                        physicalAddress: dbData.Address || '',
                        jobTitle: dbData.Job_title || '',
                        oneLiner: dbData.Tag_line || '',
                        bio: dbData.Bio || '',
                        yearsExperience: dbData.Experience || 0,
                        email: dbData.Email || '',
                        phoneNumber: dbData.Phone_number || ''
                    };
                    reset(mappedData);
                    updateFormData(mappedData);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, fetchLatestEntry, reset]);

    useEffect(() => {
        const requiredFields = [
            'fullName',
            'displayName',
            'cityCountry',
            'timeZone',
            'jobTitle',
            'oneLiner',
            'yearsExperience',
            'email',
            'phoneNumber'
        ] as const;

        let filledCount = 0;
        requiredFields.forEach(field => {
            const value = formValues[field as keyof typeof formValues];
            if (field === 'yearsExperience') {
                if (value !== undefined && value !== null && !isNaN(value as number)) filledCount++;
            } else {
                if (value && value.toString().trim().length > 0) filledCount++;
            }
        });

        const percent = Math.round((filledCount / requiredFields.length) * 100);
        setCompletionPercentage(percent);
    }, [formValues]);

    const onSubmit: SubmitHandler<IntakeFormValues> = async (data) => {
        // 1. Save local form data to the global FormLayout context
        updateFormData(data);

        // 2. Map frontend payload to database schema
        const payload = {
            Full_name: data.fullName,
            Display_name: data.displayName,
            DOB: data.dateOfBirth || null,
            Gender: data.genderPronouns || null,
            City: data.cityCountry,
            Time_zone: data.timeZone,
            Address: data.physicalAddress || null,
            Job_title: data.jobTitle,
            Tag_line: data.oneLiner,
            Bio: data.bio || null,
            Experience: data.yearsExperience,
            Email: data.email,
            Phone_number: data.phoneNumber
        };

        // 3. Save to Supabase (insert-only approach)
        const success = await saveEntry(sessionId, payload);

        // 4. Navigate to step 2 automatically if successful
        if (success) {
            navigate('/requirements');
        } else {
            alert('Failed to save to database. Check console for details.');
        }
    };

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['block-a', 'block-c', 'block-d', 'block-e'];

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'block-a', label: 'The Basics', icon: User },
        { id: 'block-c', label: 'Location & Logistics', icon: MapPin },
        { id: 'block-d', label: 'Professional Persona', icon: Briefcase },
        { id: 'block-e', label: 'Contact Coordinates', icon: Phone },
    ];

    return (
        <div className="min-h-screen bg-gray-50/30 text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-900">

            <Header
                title="Team Dazlance"
                subtitle={<span>Agency Intake <span className="mx-2 text-gray-300">/</span> Personal Identity</span>}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    <Sidebar
                        navItems={navItems}
                        activeSection={activeSection}
                        scrollToSection={scrollToSection}
                        completionPercentage={completionPercentage}
                    />

                    {/* Form Content */}
                    <div className="flex-1 min-w-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {isLoading && (
                                <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Syncing with database...
                                </div>
                            )}

                            {/* Block A: The Basics */}
                            <FormSection id="block-a" title="The Basics" description="Legal identification and display preferences.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        label="Full Legal Name"
                                        required
                                        error={errors.fullName?.message}
                                        helperText="Used strictly for contracts, NDAs, and invoices. This will not be public."
                                    >
                                        <input
                                            {...register('fullName')}
                                            type="text"
                                            className={cn(
                                                "block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                errors.fullName && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                            )}
                                            placeholder="e.g. Jonathan Doe"
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="Display Name"
                                        required
                                        error={errors.displayName?.message}
                                        helperText="What should we call you on Slack & Discord? (e.g., 'Dave' instead of 'David')."
                                    >
                                        <input
                                            {...register('displayName')}
                                            type="text"
                                            className={cn(
                                                "block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                errors.displayName && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                            )}
                                            placeholder="e.g. Jon"
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="Date of Birth"
                                        helperText="So we can send you a cake or a shoutout. Year is optional."
                                    >
                                        <input
                                            {...register('dateOfBirth')}
                                            type="date"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all text-gray-500"
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="Gender / Pronouns"
                                        helperText="Helps us address you correctly in meetings and announcements."
                                    >
                                        <select
                                            {...register('genderPronouns')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                                        >
                                            <option value="">Select...</option>
                                            <option value="he/him">He/Him</option>
                                            <option value="she/her">She/Her</option>
                                            <option value="they/them">They/Them</option>
                                            <option value="other">Prefer not to say / Other</option>
                                        </select>
                                    </InputGroup>
                                </div>
                            </FormSection>

                            {/* Block C: Location & Logistics */}
                            <FormSection id="block-c" title="Location & Logistics" description="Where you are in the world.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        label="Current City & Country"
                                        required
                                        error={errors.cityCountry?.message}
                                        helperText="We need this to know your public holidays and legal jurisdiction."
                                    >
                                        <input
                                            {...register('cityCountry')}
                                            type="text"
                                            className={cn(
                                                "block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                errors.cityCountry && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                            )}
                                            placeholder="e.g. London, UK"
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="Time Zone"
                                        required
                                        error={errors.timeZone?.message}
                                        helperText="Vital for scheduling 'All Hands' meetings."
                                    >
                                        <select
                                            {...register('timeZone')}
                                            className={cn(
                                                "block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                errors.timeZone && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                            )}
                                        >
                                            <option value="">Select Time Zone...</option>
                                            <option value="UTC-8">UTC-08:00 (Pacific Time)</option>
                                            <option value="UTC-5">UTC-05:00 (Eastern Time)</option>
                                            <option value="UTC+0">UTC+00:00 (GMT)</option>
                                            <option value="UTC+1">UTC+01:00 (CET)</option>
                                            <option value="UTC+5:30">UTC+05:30 (IST)</option>
                                        </select>
                                    </InputGroup>

                                    <div className="md:col-span-2">
                                        <InputGroup
                                            label="Physical Address"
                                            helperText="Only fill this if you want us to ship you company swag or hardware."
                                        >
                                            <textarea
                                                {...register('physicalAddress')}
                                                rows={3}
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                                                placeholder="Street address, apartment, city, zip code..."
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </FormSection>

                            {/* Block D: Professional Persona */}
                            <FormSection id="block-d" title="Professional Persona" description="How you appear to clients and the team.">
                                <div className="space-y-6">
                                    <InputGroup
                                        label="Primary Job Title"
                                        required
                                        error={errors.jobTitle?.message}
                                        helperText="Your official title on the website (e.g., Senior React Native Engineer)."
                                    >
                                        <input
                                            {...register('jobTitle')}
                                            type="text"
                                            className={cn(
                                                "block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                errors.jobTitle && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                            )}
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="The 'One-Liner'"
                                        required
                                        error={errors.oneLiner?.message}
                                        helperText="A punchy tagline under your name. Ex: 'Pixel perfectionist'."
                                    >
                                        <input
                                            {...register('oneLiner')}
                                            type="text"
                                            className={cn(
                                                "block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                errors.oneLiner && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                            )}
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="Professional Bio"
                                        helperText="Your story. Talk about your philosophy. This replaces a cover letter."
                                    >
                                        <textarea
                                            {...register('bio')}
                                            rows={5}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                                            placeholder="I started coding when..."
                                        />
                                    </InputGroup>

                                    <InputGroup
                                        label="Years of Experience"
                                        required
                                        error={errors.yearsExperience?.message}
                                        helperText="Helps us assign the right difficulty of tasks."
                                    >
                                        <div className="flex items-center space-x-4">
                                            <input
                                                {...register('yearsExperience', { valueAsNumber: true })}
                                                type="number"
                                                min="0"
                                                className={cn(
                                                    "block w-24 rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                    errors.yearsExperience && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                                )}
                                            />
                                            <span className="text-sm text-gray-500">Years</span>
                                        </div>
                                    </InputGroup>
                                </div>
                            </FormSection>

                            {/* Block E: Contact Coordinates */}
                            <FormSection id="block-e" title="Contact Coordinates" description="How we can reach you.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        label="Personal Email"
                                        required
                                        error={errors.email?.message}
                                        helperText="For secure login details and contract invites."
                                    >
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className={cn(
                                                    "block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                    errors.email && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                                )}
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </InputGroup>

                                    <InputGroup
                                        label="Phone Number"
                                        required
                                        error={errors.phoneNumber?.message}
                                        helperText="Strictly for emergencies. We won't spam you."
                                    >
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                {...register('phoneNumber')}
                                                type="tel"
                                                className={cn(
                                                    "block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all",
                                                    errors.phoneNumber && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                                                )}
                                                placeholder="+1 (555) 987-6543"
                                            />
                                        </div>
                                    </InputGroup>
                                </div>
                            </FormSection>

                            {/* Submit Action */}
                            <div className="pt-8 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "inline-flex justify-center rounded-lg border border-transparent py-3 px-8 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform",
                                        isLoading
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 focus:ring-blue-500"
                                    )}
                                >
                                    {isLoading ? 'Saving...' : 'Save & Continue'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
