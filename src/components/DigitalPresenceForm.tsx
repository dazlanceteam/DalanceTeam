import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import {
    MessageCircle, // WhatsApp
    MessageSquare, // Discord
    Github,
    Trello, // Jira alt
    GitBranch, // Git
    Server, // Node.js
    Cpu // Antigravity (AI)
} from 'lucide-react';
import { Header } from './ui/Header';
import { ToolCard } from './ui/ToolCard';

// --- Zod Schema ---

// Helper for conditional validation
const toolSchema = (valueSchema: z.ZodTypeAny) =>
    z.object({
        enabled: z.boolean(),
        value: valueSchema.optional(),
    }).superRefine((data, ctx) => {
        if (data.enabled) {
            const result = valueSchema.safeParse(data.value);
            if (!result.success) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Required when enabled",
                    path: ['value']
                });
            }
        }
    });

// Specific schemas
const checklistSchema = z.object({
    // Section 1
    whatsapp: toolSchema(z.string().min(5, "Invalid phone number")),
    discord: toolSchema(z.string().min(2, "Username required")),
    github: toolSchema(z.string().url("Must be a valid URL")),
    jira: toolSchema(z.string().email("Invalid email")),

    // Section 2
    git: z.object({
        enabled: z.boolean(),
        confirmed: z.boolean().optional() // validation logic below
    }).superRefine((data, ctx) => {
        if (data.enabled && !data.confirmed) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "You must confirm installation",
                path: ['confirmed']
            });
        }
    }),
    node: z.object({
        enabled: z.boolean(),
        confirmed: z.boolean().optional()
    }).superRefine((data, ctx) => {
        if (data.enabled && !data.confirmed) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "You must confirm installation",
                path: ['confirmed']
            });
        }
    }),
    antigravity: toolSchema(z.string().email("Invalid email or format")),
});

type ChecklistValues = z.infer<typeof checklistSchema>;

interface DigitalPresenceFormProps {
    onBack: () => void;
    onSubmit: (data: ChecklistValues) => void;
}

export default function DigitalPresenceForm({ onBack, onSubmit }: DigitalPresenceFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ChecklistValues>({
        resolver: zodResolver(checklistSchema),
        defaultValues: {
            whatsapp: { enabled: false, value: '' },
            discord: { enabled: false, value: '' },
            github: { enabled: false, value: '' },
            jira: { enabled: false, value: '' },
            git: { enabled: false, confirmed: false },
            node: { enabled: false, confirmed: false },
            antigravity: { enabled: false, value: '' },
        }
    });

    const handleFormSubmit: SubmitHandler<ChecklistValues> = (data) => {
        // Warning if any section is disabled
        const tools = ['whatsapp', 'discord', 'github', 'jira', 'git', 'node', 'antigravity'] as const;
        const disabledTools = tools.filter(t => !data[t].enabled);

        if (disabledTools.length > 0) {
            toast('Note: You skipped some tools. You must set these up to work with us.', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 4000
            });
        } else {
            toast.success("All systems go! 🚀");
        }

        // Allow submission anyway (per prompt logic "If toggle OFF, input is optional")
        // The validation only enforced input IF enabled.
        // So we just proceed.
        onSubmit(data);
    };

    return (
        <div className="min-h-screen bg-gray-50/30 text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
            <Toaster position="bottom-right" />
            <Header
                title="Team Onboarding"
                subtitle={<span>Agency Intake <span className="mx-2 text-gray-300">/</span> Digital Presence</span>}
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

                {/* Intro */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Digital Toolkit Setup</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        We don't use many tools, but the ones we use are vital. toggle the ones you are ready to set up.
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">

                    {/* Section 1: Communication & Accounts */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Communication & Accounts</h3>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">How We Stay Connected</span>
                        </div>

                        {/* 1. WhatsApp */}
                        <Controller
                            control={control}
                            name="whatsapp"
                            render={({ field }) => (
                                <ToolCard
                                    icon={MessageCircle}
                                    title="WhatsApp"
                                    description="We use WhatsApp groups for quick updates. It is faster than email. If a server goes down or a client needs a quick fix, we message here."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Your WhatsApp Number (with Country Code) <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            placeholder="+1 555 000 0000"
                                            value={field.value?.value || ''}
                                            onChange={(e) => field.onChange({ ...field.value, value: e.target.value })}
                                        />
                                        {errors.whatsapp?.value && <p className="text-sm text-red-500">{errors.whatsapp.value.message}</p>}
                                    </div>
                                </ToolCard>
                            )}
                        />

                        {/* 2. Discord */}
                        <Controller
                            control={control}
                            name="discord"
                            render={({ field }) => (
                                <ToolCard
                                    icon={MessageSquare}
                                    title="Discord"
                                    description="This is our virtual office. We make all official announcements here. You will join voice channels to hang out with the team or share your screen."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Your Discord Username <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            placeholder="username#1234"
                                            value={field.value?.value || ''}
                                            onChange={(e) => field.onChange({ ...field.value, value: e.target.value })}
                                        />
                                        {errors.discord?.value && <p className="text-sm text-red-500">{errors.discord.value.message}</p>}
                                    </div>
                                </ToolCard>
                            )}
                        />

                        {/* 3. GitHub */}
                        <Controller
                            control={control}
                            name="github"
                            render={({ field }) => (
                                <ToolCard
                                    icon={Github}
                                    title="GitHub"
                                    description="This is where we keep our code. You need a GitHub account so we can give you access to our projects. You will 'push' your code here every day."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Your GitHub Profile Link <span className="text-red-500">*</span></label>
                                        <input
                                            type="url"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            placeholder="https://github.com/username"
                                            value={field.value?.value || ''}
                                            onChange={(e) => field.onChange({ ...field.value, value: e.target.value })}
                                        />
                                        {errors.github?.value && <p className="text-sm text-red-500">{errors.github.value.message}</p>}
                                    </div>
                                </ToolCard>
                            )}
                        />

                        {/* 4. Jira */}
                        <Controller
                            control={control}
                            name="jira"
                            render={({ field }) => (
                                <ToolCard
                                    icon={Trello}
                                    title="Jira"
                                    description="We manage our tasks here. You will see exactly what you need to do, check your deadlines, and move cards to 'Done' when you finish work."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">The Email you use for Jira/Atlassian <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            placeholder="name@company.com"
                                            value={field.value.value || ''}
                                            onChange={(e) => field.onChange({ ...field.value, value: e.target.value })}
                                        />
                                        {errors.jira?.value && <p className="text-sm text-red-500">{errors.jira.value.message}</p>}
                                    </div>
                                </ToolCard>
                            )}
                        />
                    </div>

                    {/* Section 2: Software & Hardware Essentials */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Software & Hardware Essentials</h3>
                            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">The Engine Room</span>
                        </div>

                        {/* 5. Git (Software) */}
                        <Controller
                            control={control}
                            name="git"
                            render={({ field }) => (
                                <ToolCard
                                    icon={GitBranch}
                                    title="Git (Software)"
                                    description="Git is a tool that tracks changes in your code. You must install this on your computer to run commands like 'git clone' or 'git push'."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="git-confirm"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={field.value.confirmed || false}
                                                onChange={(e) => field.onChange({ ...field.value, confirmed: e.target.checked })}
                                            />
                                        </div>
                                        <div className="text-sm">
                                            <label htmlFor="git-confirm" className="font-medium text-gray-700 cursor-pointer">
                                                I confirm I have installed Git version 2.0+ on my machine <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                    </div>
                                    {errors.git?.confirmed && <p className="mt-2 text-sm text-red-500">{errors.git.confirmed.message}</p>}
                                </ToolCard>
                            )}
                        />

                        {/* 6. Node.js */}
                        <Controller
                            control={control}
                            name="node"
                            render={({ field }) => (
                                <ToolCard
                                    icon={Server}
                                    title="Node.js"
                                    description="Since we use React, we need Node.js to run the environment. It is the engine that powers our frontend websites."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="node-confirm"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={field.value.confirmed || false}
                                                onChange={(e) => field.onChange({ ...field.value, confirmed: e.target.checked })}
                                            />
                                        </div>
                                        <div className="text-sm">
                                            <label htmlFor="node-confirm" className="font-medium text-gray-700 cursor-pointer">
                                                I confirm I have installed the latest LTS version of Node.js <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                    </div>
                                    {errors.node?.confirmed && <p className="mt-2 text-sm text-red-500">{errors.node.confirmed.message}</p>}
                                </ToolCard>
                            )}
                        />

                        {/* 7. Google Antigravity */}
                        <Controller
                            control={control}
                            name="antigravity"
                            render={({ field }) => (
                                <ToolCard
                                    icon={Cpu}
                                    title="Google Antigravity (IDE/AI Tool)"
                                    description="We build fast using AI Agents. Google Antigravity is the tool we use to collaborate with AI. You need this setup to sync with our workflow."
                                    isToggled={field.value.enabled}
                                    onToggle={(checked) => field.onChange({ ...field.value, enabled: checked })}
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Your Google Antigravity Account Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            placeholder="name@company.com"
                                            value={field.value.value || ''}
                                            onChange={(e) => field.onChange({ ...field.value, value: e.target.value })}
                                        />
                                        {errors.antigravity?.value && <p className="text-sm text-red-500">{errors.antigravity.value.message}</p>}
                                    </div>
                                </ToolCard>
                            )}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-10 border-t border-gray-100">
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
                            Complete Setup
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
