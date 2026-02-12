'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PatientList } from '@/components/PatientList';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveScreen, setActiveTab, setNewPatientDialogOpen } from '@/lib/store/slices/uiSlice';
import { fetchAssignedPatients, setSelectedPatient } from '@/lib/store/slices/patientSlice';
import { useRouter } from 'next/navigation';
import { PATIENTS } from '@/lib/data/patientData';
import { PatientDemographics } from '@/components/PatientDemographics';
import { ClinicalPhenotypes } from '@/components/ClinicalPhenotypes';
import { GenomicDataUpload } from '@/components/GenomicDataUpload';
import { DNAStructureVisualization } from '@/components/DNAStructureVisualization';
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
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useState } from 'react';
import { startAnalysis, updateAnalysisProgress, completeAnalysis } from '@/lib/store/slices/uiSlice';

export default function PatientsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedPatientId, assignedPatientIds } = useAppSelector((state) => state.patient);
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

    const patientData = selectedPatientId ? PATIENTS[selectedPatientId] : null;

    useEffect(() => {
        dispatch(fetchAssignedPatients());
    }, [dispatch]);

    const handleRunAnalysis = () => {
        dispatch(startAnalysis());

        const progressInterval = setInterval(() => {
            dispatch(updateAnalysisProgress(Math.min(analysisProgress + 0.8, 100)));
        }, 100);

        setTimeout(() => {
            clearInterval(progressInterval);
            dispatch(completeAnalysis());
        }, 12000);
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
                <div className="bg-card border-b border-border px-6 py-4">
                    <div className="grid grid-cols-3 items-center gap-6">
                        <h1 className="text-slate-100">{selectedPatientId}</h1>

                        <div className="flex justify-center">
                            <Tabs value={activeTab} onValueChange={(val) => dispatch(setActiveTab(val as any))} className="w-auto">
                                <TabsList className="bg-[#2d1b4e]">
                                    <TabsTrigger value="info" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">
                                        Patient Info
                                    </TabsTrigger>
                                    <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">
                                        Analysis Results
                                    </TabsTrigger>
                                    <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">
                                        Case Notes
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="flex justify-end">
                            {activeTab === 'info' && (
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 px-8"
                                    onClick={handleRunAnalysis}
                                    disabled={!patientData}
                                >
                                    Run Analysis
                                </Button>
                            )}
                            {activeTab === 'analysis' && (
                                <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                                    <Download size={18} />
                                    Download Report (PDF)
                                </Button>
                            )}
                            {activeTab === 'notes' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                                            <Download size={18} />
                                            Download Case Notes
                                            <ChevronDown size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Download size={16} className="mr-2" />
                                            Download as TXT
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Download size={16} className="mr-2" />
                                            Download as PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Download size={16} className="mr-2" />
                                            Download as DOCX
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>

                {!patientData ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                            <p className="mb-2">No data available for patient {selectedPatientId}</p>
                            <p>This patient has not completed analysis yet.</p>
                        </div>
                    </div>
                ) : (
                    <Tabs value={activeTab} className="flex-1 flex flex-col overflow-hidden">
                        <TabsContent value="info" className="flex-1 overflow-auto p-6 m-0">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-6">
                                    <PatientDemographics patient={patientData} />
                                    <ClinicalPhenotypes initialPhenotypes={patientData.phenotypes || []} />
                                </div>
                                <div className="space-y-6">
                                    <GenomicDataUpload genomicFile={patientData.genomicFile} />
                                    <DNAStructureVisualization variantInfo={patientData.variantInfo} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="analysis" className="flex-1 overflow-auto p-6 m-0">
                            <div className="space-y-6">
                                <div className="grid grid-cols-5 gap-6">
                                    <div className="col-span-2 space-y-6">
                                        <DiagnosticSummary />
                                        <PatientPhenotypes />
                                        <TopCandidateGenes />
                                    </div>
                                    <div className="col-span-3">
                                        <KnowledgeGraph graphData={patientData.knowledgeGraph} />
                                    </div>
                                </div>
                                <PatientLikeMeComparison gene={patientData.variantInfo?.gene} />
                                <DetailedGeneticsReport />
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="flex-1 overflow-auto p-6 m-0">
                            <div className="grid grid-cols-5 gap-6 h-full">
                                <div className="col-span-3">
                                    <ClinicalNotes initialNotes={patientData.clinicalNotes} onSaveNote={handleSaveNote} />
                                </div>
                                <div className="col-span-2">
                                    <CaseActivityHistory activities={activities} />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <NewPatientDialog
                open={newPatientDialogOpen}
                onOpenChange={(open) => dispatch(setNewPatientDialogOpen(open))}
                onCreatePatient={handleCreatePatient}
            />

            {isAnalysisRunning && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border border-border">
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-purple-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-2">Running AI Analysis</h3>
                                <p className="text-slate-500 mb-6">
                                    Analyzing genomic data and identifying rare disease candidates...
                                </p>
                            </div>

                            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${analysisProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-slate-600">{analysisProgress.toFixed(2)}% Complete</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
