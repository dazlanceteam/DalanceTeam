
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User,
    MapPin,
    Briefcase,
    Mail,
    Phone,
    Globe,
    Smile,
    Upload
} from 'lucide-react';

import { Header } from './ui/Header';
import { Sidebar } from './ui/Sidebar';
import { FormSection } from './ui/FormSection';
import { InputGroup } from './ui/InputGroup';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Zod Schema ---
const intakeSchema = z.object({
    // Block A: The Basics
    fullName: z.string().min(2, "Full Legal Name must be at least 2 characters."),
    displayName: z.string().min(2, "Display Name must be at least 2 characters."),
    dateOfBirth: z.string().optional(),
    genderPronouns: z.string().optional(),

    // Block B: Visual Identity
    headshot: z.any().refine((file) => file || true, "Professional Headshot is required."),

    // Block C: Location & Logistics
    cityCountry: z.string().min(1, "Current City & Country is required."),
    timeZone: z.string().min(1, "Time Zone is required."),
    physicalAddress: z.string().optional(),

    // Block D: Professional Persona
    jobTitle: z.string().min(1, "Primary Job Title is required."),
    oneLiner: z.string().max(60, "Must be 60 characters or less.").min(1, "The 'One-Liner' is required."),
    bio: z.string().max(3000, "Bio should be roughly 300 words.").optional(),
    yearsExperience: z.number().min(0, "Years of Experience must be positive."),

    // Block E: Contact Coordinates
    email: z.string().email("Invalid email address."),
    phoneNumber: z.string().regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),

    // Block F: Culture Check
    languages: z.string().optional(),
    mbti: z.string().optional(),
    ifIWereA: z.string().optional(),
});

type IntakeFormValues = z.infer<typeof intakeSchema>;

// --- Main Intake Form Component ---

interface IntakeFormProps {
    onNext: (data: IntakeFormValues) => void;
}

export default function IntakeForm({ onNext }: IntakeFormProps) {
    const [activeSection, setActiveSection] = useState('block-a');
    const [completionPercentage, setCompletionPercentage] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<IntakeFormValues>({
        resolver: zodResolver(intakeSchema),
        mode: 'onBlur',
        defaultValues: {
            yearsExperience: 0
        }
    });

    const formValues = watch();

    useEffect(() => {
        const requiredFields = [
            'fullName',
            'displayName',
            'headshot',
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
            const value = formValues[field];
            if (field === 'yearsExperience') {
                if (value !== undefined && value !== null && !isNaN(value)) filledCount++;
            } else {
                if (value && value.toString().trim().length > 0) filledCount++;
            }
        });

        const percent = Math.round((filledCount / requiredFields.length) * 100);
        setCompletionPercentage(percent);
    }, [formValues]);

    const onSubmit: SubmitHandler<IntakeFormValues> = (data) => {
        console.log("Form Data:", data);
        onNext(data);
    };

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['block-a', 'block-b', 'block-c', 'block-d', 'block-e', 'block-f'];

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
        { id: 'block-b', label: 'Visual Identity', icon: Smile },
        { id: 'block-c', label: 'Location & Logistics', icon: MapPin },
        { id: 'block-d', label: 'Professional Persona', icon: Briefcase },
        { id: 'block-e', label: 'Contact Coordinates', icon: Phone },
        { id: 'block-f', label: 'Culture Check', icon: Globe },
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

                            {/* Block B: Visual Identity */}
                            <FormSection id="block-b" title="Visual Identity" description="Your professional and cultural presence.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        label="Professional Headshot"
                                        required
                                        error={errors.headshot?.message?.toString()}
                                        helperText="Goes on the Agency Website. Clean background, good lighting. No selfies."
                                    >
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group-hover:border-blue-400">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                        <span>Upload a file</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    </InputGroup>

                                    <InputGroup
                                        label="Casual Photo"
                                        helperText="For internal culture. Show us your desk setup, pet, or hobby."
                                    >
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group-hover:border-blue-400">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="casual-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                        <span>Upload a file</span>
                                                        <input id="casual-upload" name="casual-upload" type="file" className="sr-only" />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
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

                            {/* Block F: Culture Check */}
                            <FormSection id="block-f" title="Culture Check" description="Let's get to know the real you.">
                                <div className="space-y-6">
                                    <InputGroup
                                        label="Languages Spoken"
                                        helperText="Useful if we get clients from specific regions."
                                    >
                                        <input
                                            {...register('languages')}
                                            type="text"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                                            placeholder="English, Spanish, French..."
                                        />
                                    </InputGroup>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup
                                            label="MBTI Type"
                                            helperText="Helps us understand how you prefer to work (e.g., INTJ)."
                                        >
                                            <input
                                                {...register('mbti')}
                                                type="text"
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                                                placeholder="e.g. ENFP"
                                            />
                                        </InputGroup>

                                        <InputGroup
                                            label="'If I were a...'"
                                            helperText="Fun question. Ex: 'If I were a code error, I'd be a 404'."
                                        >
                                            <input
                                                {...register('ifIWereA')}
                                                type="text"
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                                                placeholder="Your answer..."
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </FormSection>

                            {/* Submit Action */}
                            <div className="pt-8 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5"
                                >
                                    Save & Continue
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
