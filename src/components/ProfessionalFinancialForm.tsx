import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    Briefcase,
    Clock,
    Calendar,
    Layers,
    Code,
    Globe,
    Building,
    Bitcoin
} from 'lucide-react';
import { Header } from './ui/Header';
import { SelectableCard } from './ui/SelectableCard';
import { InputGroup } from './ui/InputGroup';

// --- Utils ---
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// --- Zod Schema ---

const WORK_CAPACITY_OPTIONS = ['full-time', 'part-time', 'project-based'] as const;
const EXPERIENCE_LEVEL_OPTIONS = ['junior', 'mid-level', 'senior'] as const;
const CRYPTO_NETWORK_OPTIONS = ['TRC20', 'ERC20', 'BEP20'] as const;

// Base schema for shared fields
const baseSchema = z.object({
    // Section 1
    workCapacity: z.enum(WORK_CAPACITY_OPTIONS as unknown as [string, ...string[]], {
        errorMap: () => ({ message: "Please select your work capacity." })
    }),
    timeZone: z.string().min(1, "Time zone is required."),
    startDate: z.string().min(1, "Start date is required."),

    // Section 2
    primarySkills: z.array(z.string()).min(1, "Select at least one skill."),
    experienceLevel: z.enum(EXPERIENCE_LEVEL_OPTIONS as unknown as [string, ...string[]], {
        errorMap: () => ({ message: "Please select your experience level." })
    }),
    portfolioUrl: z.string().url("Must be a valid URL."),

    // Tax Declaration
    taxDeclaration: z.boolean().refine(val => val === true, {
        message: "You must acknowledge tax responsibility."
    }),
});

// Banking variations
const bankSchema = z.object({
    paymentMethod: z.literal('bank'),
    bankName: z.string().min(1, "Bank Name is required."),
    accountNumber: z.string().min(1, "Account Number is required."),
    branchCode: z.string().min(1, "Branch Code is required."),
    accountHolderName: z.string().min(1, "Account Holder Name is required."),
});

const wiseSchema = z.object({
    paymentMethod: z.literal('wise'),
    wiseEmail: z.string().email("Valid Wise Email is required."),
});

const cryptoSchema = z.object({
    paymentMethod: z.literal('crypto'),
    network: z.enum(CRYPTO_NETWORK_OPTIONS as unknown as [string, ...string[]], {
        errorMap: () => ({ message: "Select a network." })
    }),
    walletAddress: z.string().min(1, "Wallet Address is required."),
});

// Combined Schema
const profileSchema = z.intersection(
    baseSchema,
    z.discriminatedUnion('paymentMethod', [bankSchema, wiseSchema, cryptoSchema])
);

type ProfileValues = z.infer<typeof profileSchema>;

// --- Constants ---
const SKILL_OPTIONS = [
    'React.js', 'Next.js', 'Node.js', 'React Native', 'Python/Django', 'WordPress', 'Shopify'
];

interface ProfessionalFinancialFormProps {
    onBack: () => void;
    onSubmit: (data: ProfileValues) => void;
}

export default function ProfessionalFinancialForm({ onBack, onSubmit }: ProfessionalFinancialFormProps) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            primarySkills: [],
            taxDeclaration: false,
            // Default to bank to avoid discrimination issues initially or handle empty state?
            // Zod discriminated union needs the discriminator to be present.
            // Let's set a default or handle 'undefined' carefully in UI but Zod needs a valid one for valid submission.
            paymentMethod: 'bank',
        }
    });

    const paymentMethod = watch('paymentMethod');
    const selectedSkills = watch('primarySkills') || [];
    const experienceLevel = watch('experienceLevel');

    const handleSkillToggle = (skill: string) => {
        const current = selectedSkills;
        if (current.includes(skill)) {
            setValue('primarySkills', current.filter(s => s !== skill));
        } else {
            setValue('primarySkills', [...current, skill]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
            <Header
                title="Team Dazlance"
                subtitle={<span>Agency Intake <span className="mx-2 text-gray-300">/</span> Professional & Financial</span>}
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Final Step: The Details</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        We need to know how you work and, most importantly, how to pay you.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                    {/* Section 1: Availability */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Your Schedule
                            </h3>
                        </div>
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Work Capacity */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Work Capacity</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Controller
                                        control={control}
                                        name="workCapacity"
                                        render={({ field }) => (
                                            <>
                                                <SelectableCard
                                                    icon={Briefcase}
                                                    title="Full Time"
                                                    description="40h/week"
                                                    selected={field.value === 'full-time'}
                                                    onClick={() => field.onChange('full-time')}
                                                />
                                                <SelectableCard
                                                    icon={Layers}
                                                    title="Part Time"
                                                    description="20h/week"
                                                    selected={field.value === 'part-time'}
                                                    onClick={() => field.onChange('part-time')}
                                                />
                                                <SelectableCard
                                                    icon={Code}
                                                    title="Project Based"
                                                    description="Ticket-by-ticket"
                                                    selected={field.value === 'project-based'}
                                                    onClick={() => field.onChange('project-based')}
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                                {errors.workCapacity && <p className="text-sm text-red-500">{errors.workCapacity.message}</p>}
                                <p className="text-xs text-gray-500">This helps us plan our sprints and resource allocation.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Time Zone */}
                                <InputGroup
                                    label="Preferred Time Zone"
                                    helperText="We try to overlap meetings. Which time zone do you actually work in?"
                                    error={errors.timeZone?.message}
                                >
                                    <select
                                        {...control.register('timeZone')}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                                    >
                                        <option value="">Select Time Zone...</option>
                                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                                        <option value="UTC+0">GMT/UTC (UTC+0)</option>
                                        <option value="UTC+1">Central European Time (UTC+1)</option>
                                        <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
                                        <option value="UTC+8">China Standard Time (UTC+8)</option>
                                    </select>
                                </InputGroup>

                                {/* Start Date */}
                                <InputGroup
                                    label="Start Date"
                                    helperText="When is the earliest you can pick up your first ticket?"
                                    error={errors.startDate?.message}
                                >
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            {...control.register('startDate')}
                                            className="block w-full rounded-lg border border-gray-300 pl-10 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </InputGroup>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Technical Arsenal */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Code className="w-5 h-5 text-indigo-600" />
                                What can you build?
                            </h3>
                        </div>
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Skills */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Primary Skill Stack <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-2">
                                    {SKILL_OPTIONS.map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => handleSkillToggle(skill)}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                                selectedSkills.includes(skill)
                                                    ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            )}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                                {errors.primarySkills && <p className="text-sm text-red-500">{errors.primarySkills.message}</p>}
                                <p className="text-xs text-gray-500">Select the tools you are confident using in production today.</p>
                            </div>

                            {/* Experience Level */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Experience Level <span className="text-red-500">*</span></label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {['junior', 'mid-level', 'senior'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setValue('experienceLevel', level as any)}
                                            className={cn(
                                                "flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all",
                                                experienceLevel === level
                                                    ? "bg-white text-gray-900 shadow-sm pointer-events-none"
                                                    : "text-gray-500 hover:text-gray-700"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                                {errors.experienceLevel && <p className="text-sm text-red-500">{errors.experienceLevel.message}</p>}
                                <p className="text-xs text-gray-500">Be honest. Junior = Needs guidance. Senior = Can architect solutions alone.</p>
                            </div>

                            {/* Portfolio */}
                            <InputGroup
                                label="Portfolio / Proof of Work"
                                helperText="Link to your best GitHub repo or live project. We look at code quality, not just the UI."
                                error={errors.portfolioUrl?.message}
                            >
                                <input
                                    type="url"
                                    {...control.register('portfolioUrl')}
                                    placeholder="https://github.com/your-best-work"
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                />
                            </InputGroup>
                        </div>
                    </div>

                    {/* Section 3: Banking */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Bitcoin className="w-5 h-5 text-green-600" />
                                Getting Paid
                            </h3>
                        </div>
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Payment Method */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Controller
                                        control={control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <>
                                                <SelectableCard
                                                    icon={Building}
                                                    title="Local Bank"
                                                    description="Direct Transfer"
                                                    selected={field.value === 'bank'}
                                                    onClick={() => {
                                                        field.onChange('bank');
                                                        // Clear other fields or handle via defaultValues/reset if needed strictly,
                                                        // but Zod handles submitting only valid data for the union discriminator.
                                                    }}
                                                />
                                                <SelectableCard
                                                    icon={Globe}
                                                    title="Wise"
                                                    description="TransferWise"
                                                    selected={field.value === 'wise'}
                                                    onClick={() => field.onChange('wise')}
                                                />
                                                <SelectableCard
                                                    icon={Bitcoin}
                                                    title="Crypto"
                                                    description="USDT"
                                                    selected={field.value === 'crypto'}
                                                    onClick={() => field.onChange('crypto')}
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">We process payments on the 1st of every month. Choose your preferred channel.</p>
                            </div>

                            {/* Dynamic Fields */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 animate-fadeIn">
                                {paymentMethod === 'bank' && (
                                    <div className="space-y-4">
                                        <InputGroup label="Bank Name" required error={(errors as any).bankName?.message}>
                                            <input {...control.register('bankName')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                        </InputGroup>
                                        <InputGroup label="Account Number" required helperText="Double check this. Reversals are impossible." error={(errors as any).accountNumber?.message}>
                                            <input {...control.register('accountNumber')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                        </InputGroup>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputGroup label="Branch Code / IFSC" required error={(errors as any).branchCode?.message}>
                                                <input {...control.register('branchCode')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                            </InputGroup>
                                            <InputGroup label="Account Holder Name" required error={(errors as any).accountHolderName?.message}>
                                                <input {...control.register('accountHolderName')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm" />
                                            </InputGroup>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'wise' && (
                                    <div className="space-y-4">
                                        <InputGroup label="Wise Email Address" required helperText="The email connected to your Wise account." error={(errors as any).wiseEmail?.message}>
                                            <input type="email" {...control.register('wiseEmail')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm" placeholder="you@example.com" />
                                        </InputGroup>
                                    </div>
                                )}

                                {paymentMethod === 'crypto' && (
                                    <div className="space-y-4">
                                        <InputGroup label="Network" required error={(errors as any).network?.message}>
                                            <select {...control.register('network')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white">
                                                <option value="">Select Network...</option>
                                                <option value="TRC20">TRC20 (Tron)</option>
                                                <option value="ERC20">ERC20 (Ethereum)</option>
                                                <option value="BEP20">BEP20 (BSC)</option>
                                            </select>
                                        </InputGroup>
                                        <InputGroup label="Wallet Address" required helperText="Ensure the network matches the address." error={(errors as any).walletAddress?.message}>
                                            <input {...control.register('walletAddress')} className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm font-mono" placeholder="0x..." />
                                        </InputGroup>
                                    </div>
                                )}
                            </div>

                            {/* Tax Declaration */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="tax-declaration"
                                        type="checkbox"
                                        {...control.register('taxDeclaration')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="tax-declaration" className="font-medium text-gray-700">I understand I am responsible for my own local taxes as an independent contractor.</label>
                                    <p className="text-gray-500">Dazlance does not withhold taxes for remote contractors.</p>
                                    {errors.taxDeclaration && <p className="text-red-500 mt-1">{errors.taxDeclaration.message}</p>}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex justify-center rounded-lg border border-gray-200 bg-white py-3 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5"
                        >
                            Complete Profile
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
