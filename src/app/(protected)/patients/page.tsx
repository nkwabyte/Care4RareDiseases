'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PatientList } from '@/components/PatientList';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveScreen, setActiveTab, setNewPatientDialogOpen } from '@/lib/store/slices/uiSlice';
import { fetchAssignedPatients, setSelectedPatient, fetchPatientDetails } from '@/lib/store/slices/patientSlice';
import { useRouter } from 'next/navigation';
import { DiagnosticSummary } from '@/components/DiagnosticSummary';
import { PatientPhenotypes } from '@/components/PatientPhenotypes';
import { TopCandidateGenes } from '@/components/TopCandidateGenes';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { PatientLikeMeComparison } from '@/components/PatientLikeMeComparison';
import { DetailedGeneticsReport } from '@/components/DetailedGeneticsReport';
import { ClinicalNotes } from '@/components/ClinicalNotes';
import { CaseActivityHistory, Activity } from '@/components/CaseActivityHistory';
import { NewPatientDialog } from '@/components/NewPatientDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { startAnalysis, updateAnalysisProgress, completeAnalysis } from '@/lib/store/slices/uiSlice';
import { AIReportGenerator } from '@/components/AIReportGenerator';
import { PatientDemographics } from '@/components/PatientDemographics';
import { ClinicalPhenotypes } from '@/components/ClinicalPhenotypes';
import { DNAStructureVisualization } from '@/components/DNAStructureVisualization';
import { GenotypePhenotypeAnalysis } from '@/components/GenotypePhenotypeAnalysis';
import { GenotypePhenotypeUpload } from '@/components/GenotypePhenotypeUpload';

export default function PatientsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedPatientId, assignedPatientIds, currentPatient } = useAppSelector((state) => state.patient);
    const { activeTab, newPatientDialogOpen, isAnalysisRunning, analysisProgress } = useAppSelector((state) => state.ui);
    const { doctor } = useAppSelector((state) => state.auth);

    const [activities, setActivities] = useState<Activity[]>([
        {
            id: 1,
            timestamp: 'Today, 10:15 AM',
            description: `${doctor?.name || 'Doctor'} added a new clinical note.`,
            icon: FileText,
            color: 'purple',
        },
    ]);

    const patientData = currentPatient;

    useEffect(() => {
        dispatch(fetchAssignedPatients());
    }, [dispatch]);

    useEffect(() => {
        if (selectedPatientId) {
            dispatch(fetchPatientDetails(selectedPatientId));
        }
    }, [dispatch, selectedPatientId]);

    const handleRunAnalysis = () => {
        dispatch(startAnalysis());

        let progress = 0;
        const totalDuration = 3000; // 3 seconds
        const intervalTime = 50;
        const steps = totalDuration / intervalTime;
        const increment = 100 / steps;

        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            dispatch(updateAnalysisProgress(progress));
        }, intervalTime);

        setTimeout(() => {
            clearInterval(progressInterval);
            dispatch(updateAnalysisProgress(100)); // Ensure it hits 100%
            setTimeout(() => { // Small delay to see 100%
                dispatch(completeAnalysis());
                dispatch(setActiveTab('analysis'));
            }, 500);
        }, totalDuration);
    };

    const handleSaveNote = (note: string) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const newActivity: Activity = {
            id: Date.now(),
            timestamp: `Today, ${timeString}`,
            description: `${doctor?.name || 'Doctor'} added a new clinical note.`,
            icon: FileText,
            color: 'purple',
        };

        setActivities(prev => [newActivity, ...prev]);
        toast.success('Note saved successfully', {
            description: 'Your clinical note has been saved to the patient record.',
        });
    };

    const handleCreatePatient = (patientData: any) => {
        console.log('Creating new patient:', patientData);
        alert(`Patient ${patientData.patientId} created successfully!`);
    };

    return (
        <>
            <Sidebar
                activeItem="patients"
                onItemClick={(itemId) => {
                    dispatch(setActiveScreen(itemId as any));
                    router.push(`/${itemId}`);
                }}
            />

            <PatientList
                selectedPatientId={selectedPatientId || ''}
                onPatientSelect={(id) => dispatch(setSelectedPatient(id))}
                onNewPatient={() => dispatch(setNewPatientDialogOpen(true))}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs value={activeTab} onValueChange={(val) => dispatch(setActiveTab(val as any))} className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-card border-b border-border px-6 py-4 shrink-0">
                        <div className="grid grid-cols-3 items-center gap-6">
                            <h1 className="text-slate-100 font-bold text-xl">{selectedPatientId}</h1>

                            <div className="flex justify-center">
                                <TabsList className="bg-[#1a0f2e] p-1 border border-purple-900/20 rounded-lg">
                                    <TabsTrigger
                                        value="info"
                                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 transition-all px-6"
                                    >
                                        Patient Info
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="analysis"
                                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 transition-all px-6"
                                    >
                                        Analysis Results
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="notes"
                                        className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 transition-all px-6"
                                    >
                                        Case Notes
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex justify-end gap-3">
                                <NewPatientDialog
                                    open={newPatientDialogOpen}
                                    onOpenChange={(open) => dispatch(setNewPatientDialogOpen(open))}
                                    onCreatePatient={handleCreatePatient}
                                />
                            </div>
                        </div>
                    </div>

                    {patientData ? (
                        <>
                            <TabsContent value="analysis" className="flex-1 overflow-auto p-6 m-0 focus-visible:ring-0 focus-visible:outline-none">
                                <div className="space-y-8 max-w-7xl mx-auto pb-10">
                                    {/* AI Report Generator Section */}
                                    <AIReportGenerator patientId={selectedPatientId || ''} patientData={patientData} />

                                    <div className="border-t border-purple-900/20 pt-8">
                                        <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                            Detailed Analysis Data
                                        </h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                            <div className="lg:col-span-2 space-y-6">
                                                <DiagnosticSummary />
                                                <PatientPhenotypes />
                                                <TopCandidateGenes />
                                            </div>
                                            <div className="lg:col-span-3 space-y-6">
                                                <KnowledgeGraph graphData={patientData.knowledgeGraph} />
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <GenotypePhenotypeAnalysis patientData={patientData} />
                                        </div>
                                        <div className="mt-6 space-y-6">
                                            <PatientLikeMeComparison gene={patientData.variantInfo?.gene} />
                                            <DetailedGeneticsReport />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notes" className="flex-1 overflow-auto p-6 m-0 focus-visible:ring-0 focus-visible:outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full max-w-7xl mx-auto">
                                    <div className="lg:col-span-3 h-full">
                                        <ClinicalNotes initialNotes={patientData.clinicalNotes} onSaveNote={handleSaveNote} />
                                    </div>
                                    <div className="lg:col-span-2 h-full">
                                        <CaseActivityHistory activities={activities} />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="info" className="flex-1 overflow-auto p-6 m-0 focus-visible:ring-0 focus-visible:outline-none">
                                <div className="max-w-7xl mx-auto pb-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <PatientDemographics patient={patientData} />
                                            <DNAStructureVisualization variantInfo={patientData.variantInfo} />
                                        </div>
                                        <div className="space-y-6">
                                            <GenotypePhenotypeUpload />
                                            <ClinicalPhenotypes initialPhenotypes={patientData.phenotypes} />

                                            <Button
                                                onClick={handleRunAnalysis}
                                                className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 py-6"
                                            >
                                                <Play className="w-5 h-5 mr-2 fill-current" />
                                                Run Analysis
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                            <div className="mb-4 p-6 bg-slate-900/50 rounded-full border border-slate-800">
                                <FileText className="w-12 h-12 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-medium text-slate-300 mb-2">No Patient Selected</h3>
                            <p className="max-w-md text-center text-slate-400">
                                Select a patient from the sidebar list to view their detailed analysis, medical history, and clinical notes.
                            </p>
                        </div>
                    )}
                </Tabs>

                {isAnalysisRunning && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-purple-500/20">
                            <div className="text-center">
                                <div className="mb-8 relative">
                                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <svg className="w-10 h-10 text-purple-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Running Advanced Analysis</h3>
                                    <p className="text-slate-400">
                                        Processing genomic sequences and identifying rare disease patterns...
                                    </p>
                                </div>

                                <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                                    <div
                                        className="bg-linear-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${analysisProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-mono text-slate-500">
                                    <span>PROCESSING</span>
                                    <span>{analysisProgress.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
