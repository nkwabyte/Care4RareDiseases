'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateReportAction } from '@/lib/actions/gemini';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIReportGeneratorProps {
    patientId: string;
    patientData?: any;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

import { setCurrentReport, clearChat } from '@/lib/store/slices/patientSlice';
import { useAppDispatch } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';

export function AIReportGenerator({ patientId, patientData }: AIReportGeneratorProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = async () => {
        if (!patientId) return;

        setIsGenerating(true);
        dispatch(clearChat());

        try {
            const result = await generateReportAction(patientId);

            if (result.success && result.report) {
                dispatch(setCurrentReport(result.report));
                toast.success('Analysis complete', {
                    description: 'Genomic report generated successfully. Redirecting...',
                });

                // Redirect to the report page
                router.push(`/patients/${patientId}/report`);
            } else {
                toast.error('Generation failed', {
                    description: result.error || 'Failed to generate report.',
                });
            }
        } catch (error) {
            toast.error('Error', {
                description: 'An unexpected error occurred.',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section className="bg-card border border-border p-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-1">Generate diagnostic report</h2>
                <p className="text-muted-foreground max-w-[65ch]">
                    Drafts a report from this case’s variant, phenotypes and clinical notes. The draft is decision
                    support and must be reviewed by the responsible clinician.
                </p>
            </div>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="h-11 px-5">
                {isGenerating ? (
                    <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Generating report…
                    </>
                ) : (
                    <>
                        <FileText className="size-4" aria-hidden />
                        Generate report
                    </>
                )}
            </Button>
        </section>
    );
}
