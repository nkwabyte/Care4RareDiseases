'use client';

import { useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/layout';
import {
    PatientList,
    DiagnosticSummary,
    PatientPhenotypes,
    ClinicalNotes,
    CaseActivityHistory,
    Activity,
    NewPatientDialog,
    PatientDemographics,
    ClinicalPhenotypes,
} from '@/components/patients';
import {
    TopCandidateGenes,
    KnowledgeGraph,
    PatientLikeMeComparison,
    DetailedGeneticsReport,
    AIReportGenerator,
    DNAStructureVisualization,
    GenotypePhenotypeAnalysis,
    GenotypePhenotypeUpload,
} from '@/components/genetics';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveScreen, setActiveTab, setNewPatientDialogOpen } from '@/lib/store/slices/uiSlice';
import { fetchAssignedPatients, setSelectedPatient, fetchPatientDetails } from '@/lib/store/slices/patientSlice';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { EvidenceWeave, LifecycleStrip } from '@/components/patients/Evidence';
import { phenotypeFit } from '@/lib/evidence';

const SEX_LABEL: Record<string, string> = { male: 'Male', female: 'Female', other: 'Other' };
import { toast } from 'sonner';
import { useState } from 'react';
import { AnalysisRun } from '@/components/patients/AnalysisRun';

export default function PatientsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedPatientId, assignedPatientIds, currentPatient } = useAppSelector((state) => state.patient);
    const { activeTab, newPatientDialogOpen } = useAppSelector((state) => state.ui);
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

    const [caseListKey, setCaseListKey] = useState(0);
    const canRunAnalysis = doctor?.role === 'admin' || doctor?.role === 'clinician';
    const handleAnalysisCompleted = useCallback(() => {
        if (selectedPatientId) dispatch(fetchPatientDetails(selectedPatientId));
        setCaseListKey((k) => k + 1);
    }, [dispatch, selectedPatientId]);

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
            <Sidebar />

            <PatientList
                refreshKey={caseListKey}
                selectedPatientId={selectedPatientId || ''}
                onPatientSelect={(id) => dispatch(setSelectedPatient(id))}
                onNewPatient={() => dispatch(setNewPatientDialogOpen(true))}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs value={activeTab} onValueChange={(val) => dispatch(setActiveTab(val as any))} className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-card border-b border-border px-9 pt-5 pb-4 shrink-0 space-y-4">
                        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
                            <h1 className="text-[30px] leading-none font-bold tracking-[-0.01em] text-foreground">
                                {selectedPatientId ?? 'No case selected'}
                            </h1>
                            {patientData && (
                                <p className="text-muted-foreground pb-0.5">
                                    {SEX_LABEL[patientData.sex] ?? patientData.sex} · {patientData.age} {patientData.age === 1 ? 'year' : 'years'}
                                    {patientData.assignedClinician ? ` · ${patientData.assignedClinician}` : ''}
                                </p>
                            )}
                            <TabsList className="ml-auto">
                                <TabsTrigger value="info">Patient</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                <TabsTrigger value="notes">Case notes</TabsTrigger>
                            </TabsList>
                        </div>

                        {patientData && (
                            <>
                                <EvidenceWeave
                                    fit={phenotypeFit(patientData.phenotypes, patientData.variantInfo?.affectedPhenotypes)}
                                    classification={patientData.variantInfo?.pathogenicity ?? null}
                                    gene={patientData.variantInfo?.gene ?? null}
                                    status={patientData.status}
                                />
                                <LifecycleStrip status={patientData.status} />
                            </>
                        )}

                        <NewPatientDialog
                            open={newPatientDialogOpen}
                            onOpenChange={(open) => dispatch(setNewPatientDialogOpen(open))}
                            onCreatePatient={handleCreatePatient}
                        />
                    </header>

                    {patientData ? (
                        <>
                            <TabsContent value="analysis" className="flex-1 overflow-auto p-6 m-0 focus-visible:ring-0 focus-visible:outline-none">
                                <div className="space-y-8 max-w-7xl mx-auto pb-10">
                                    {/* AI Report Generator Section */}
                                    <AIReportGenerator patientId={selectedPatientId || ''} patientData={patientData} />

                                    <div className="border-t border-border pt-8">
                                        <h2 className="mb-6 text-[13px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                                            Detailed analysis data
                                        </h2>
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
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                                        <DNAStructureVisualization variantInfo={patientData.variantInfo} />
                                        <ClinicalPhenotypes
                                            initialPhenotypes={patientData.phenotypes}
                                            knownFeatures={patientData.variantInfo?.affectedPhenotypes}
                                            gene={patientData.variantInfo?.gene}
                                            action={
                                                <AnalysisRun
                                                    key={patientData.id}
                                                    patientId={patientData.id}
                                                    canRun={canRunAnalysis}
                                                    onCompleted={handleAnalysisCompleted}
                                                    onViewResults={() => dispatch(setActiveTab('analysis'))}
                                                />
                                            }
                                        />
                                        <PatientDemographics patient={patientData} />
                                        <GenotypePhenotypeUpload patientId={patientData.id} />
                                    </div>
                                </div>
                            </TabsContent>
                        </>
                    ) : (
                        <div className="flex-1 grid place-items-center p-12">
                            <div className="max-w-md text-center">
                                <h2 className="text-xl font-semibold text-foreground mb-2">Choose a case to begin</h2>
                                <p className="text-muted-foreground">
                                    Pick a case from the list to see its variant, phenotype fit, analysis and clinical notes.
                                </p>
                            </div>
                        </div>
                    )}
                </Tabs>

            </div>
        </>
    );
}
