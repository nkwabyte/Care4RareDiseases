'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateReportAction } from '@/lib/actions/gemini';
import { Sparkles, Loader2 } from 'lucide-react';
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
        <div className="flex flex-col h-full space-y-6">
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Generate AI Analysis</h3>
                <p className="text-slate-400 max-w-md mb-8">
                    Process genomic data, clinical notes, and phenotype information to generate a comprehensive diagnostic report.
                </p>
                <Button
                    size="lg"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-900/20"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Report
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
