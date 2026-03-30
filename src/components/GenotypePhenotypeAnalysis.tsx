'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { generateGenotypePhenotypeAnalysis } from '@/lib/actions/gemini';
import ReactMarkdown from 'react-markdown';
import { Loader2, RefreshCw, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface GenotypePhenotypeAnalysisProps {
    patientData: any;
}

export function GenotypePhenotypeAnalysis({ patientData }: GenotypePhenotypeAnalysisProps) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateAnalysis = async () => {
        setLoading(true);
        try {
            const result = await generateGenotypePhenotypeAnalysis(patientData);
            if (result.success && result.analysis) {
                setAnalysis(result.analysis);
                toast.success('Genotype-Phenotype analysis generated successfully');
            } else {
                toast.error(result.error || 'Failed to generate analysis');
            }
        } catch (error) {
            toast.error('An error occurred while generating analysis');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Stethoscope className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-100">Genotype-Phenotype Correlation</h3>
                        <p className="text-sm text-slate-400">AI-driven analysis of variant impact on clinical presentation</p>
                    </div>
                </div>
                <Button
                    onClick={handleGenerateAnalysis}
                    disabled={loading}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {analysis ? 'Regenerate Analysis' : 'Generate Analysis'}
                        </>
                    )}
                </Button>
            </div>

            {analysis ? (
                <div className="prose prose-invert max-w-none bg-[#1a0f2e]/50 p-6 rounded-lg border border-purple-900/20">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                    <Stethoscope className="w-12 h-12 mb-4 text-slate-700" />
                    <p className="max-w-md text-center">
                        Generate a deep learning analysis connecting the specific genetic variants to the observed clinical phenotypes using Gemini 2.5 Pro.
                    </p>
                </div>
            )}
        </Card>
    );
}
