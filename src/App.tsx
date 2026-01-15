import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PatientList } from './components/PatientList';
import { DiagnosticSummary } from './components/DiagnosticSummary';
import { PatientPhenotypes } from './components/PatientPhenotypes';
import { TopCandidateGenes } from './components/TopCandidateGenes';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { PatientDemographics } from './components/PatientDemographics';
import { ClinicalPhenotypes } from './components/ClinicalPhenotypes';
import { GenomicDataUpload } from './components/GenomicDataUpload';
import { DNAStructureVisualization } from './components/DNAStructureVisualization';
import { ClinicalNotes } from './components/ClinicalNotes';
import { CaseActivityHistory, Activity } from './components/CaseActivityHistory';
import { ReportsScreen } from './components/ReportsScreen';
import { DatabaseScreen } from './components/DatabaseScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { HelpScreen } from './components/HelpScreen';
import { NewPatientDialog } from './components/NewPatientDialog';
import { DetailedGeneticsReport } from './components/DetailedGeneticsReport';
import { PatientLikeMeComparison } from './components/PatientLikeMeComparison';
import { LoginScreen } from './components/LoginScreen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Download, ChevronDown, MessageCircle, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { PATIENTS } from './data/patientData';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useAssignedPatients } from './hooks/useAssignedPatients';

function AppContent() {
  const { session, doctor, isLoading, login } = useAuth();
  const { assignedPatientIds, isLoading: patientsLoading } = useAssignedPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('info');
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'patients' | 'reports' | 'database' | 'settings' | 'help'>('dashboard');
  const [newPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showAiUnavailable, setShowAiUnavailable] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      timestamp: 'Today, 10:15 AM',
      description: `${doctor?.name || 'Doctor'} added a new clinical note.`,
      icon: FileText,
      color: 'purple',
    },
    {
      id: 2,
      timestamp: 'Yesterday, 4:30 PM',
      description: 'Report downloaded.',
      icon: FileText,
      color: 'slate',
    },
    {
      id: 3,
      timestamp: 'Yesterday, 4:28 PM',
      description: 'Analysis results viewed.',
      icon: FileText,
      color: 'slate',
    },
  ]);
  
  const patientData = PATIENTS[selectedPatientId];

  // Set initial selected patient when assigned patients load
  useEffect(() => {
    if (!patientsLoading && assignedPatientIds.length > 0 && !selectedPatientId) {
      setSelectedPatientId(assignedPatientIds[0]);
    }
  }, [assignedPatientIds, patientsLoading, selectedPatientId]);

  // Reset to Patient Info tab when patient changes
  useEffect(() => {
    setActiveTab('info');
  }, [selectedPatientId]);

  // Auto-dismiss AI unavailable notification after 4 seconds
  useEffect(() => {
    if (showAiUnavailable) {
      const timer = setTimeout(() => {
        setShowAiUnavailable(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAiUnavailable]);

  const handlePatientClickFromDatabase = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveScreen('patients');
    setActiveTab('info');
  };

  const handleCreatePatient = (patientData: any) => {
    // In a real application, this would make an API call to create the patient
    console.log('Creating new patient:', patientData);
    alert(`Patient ${patientData.patientId} created successfully!`);
    // Optionally switch to the new patient (would need to be added to PATIENTS data)
  };

  const handleRunAnalysis = () => {
    setIsAnalysisRunning(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.8;
      });
    }, 100);
    
    // After 12 seconds, complete analysis and switch to results tab
    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setTimeout(() => {
        setIsAnalysisRunning(false);
        setActiveTab('analysis');
        setAnalysisProgress(0);
      }, 500);
    }, 12000);
  };

  const handleSaveNote = (note: string) => {
    // Create new activity for the saved note
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    const newActivity: Activity = {
      id: Date.now(),
      timestamp: `Today, ${timeString}`,
      description: `${doctor?.name || 'Doctor'} added a new clinical note.`,
      icon: FileText,
      color: 'purple',
    };
    
    // Add new activity to the top
    setActivities(prev => [newActivity, ...prev]);
    
    // Show success toast
    toast.success('Note saved successfully', {
      description: 'Your clinical note has been saved to the patient record.',
    });
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!session) {
    return <LoginScreen onLoginSuccess={login} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <Sidebar activeItem={activeScreen} onItemClick={(itemId) => setActiveScreen(itemId as 'dashboard' | 'patients' | 'reports' | 'database' | 'settings' | 'help')} />
      
      {/* Conditionally render different screens */}
      {activeScreen === 'dashboard' ? (
        <DashboardScreen onNavigateToPatients={() => setActiveScreen('patients')} />
      ) : activeScreen === 'reports' ? (
        <ReportsScreen />
      ) : activeScreen === 'database' ? (
        <DatabaseScreen onPatientClick={handlePatientClickFromDatabase} />
      ) : activeScreen === 'settings' ? (
        <SettingsScreen />
      ) : activeScreen === 'help' ? (
        <HelpScreen />
      ) : (
        <>
          {/* Patient List Sub-menu */}
          <PatientList 
            selectedPatientId={selectedPatientId} 
            onPatientSelect={setSelectedPatientId}
            onNewPatient={() => setNewPatientDialogOpen(true)}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <div className="bg-card border-b border-border px-6 py-4">
              <div className="grid grid-cols-3 items-center gap-6">
                {/* Left: Patient Name */}
                <h1 className="text-slate-100">{selectedPatientId}</h1>
                
                {/* Center: Tabs */}
                <div className="flex justify-center">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                    <TabsList className="bg-[#2d1b4e]">
                      <TabsTrigger value="info" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">Patient Info</TabsTrigger>
                      <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">Analysis Results</TabsTrigger>
                      <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">Case Notes</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Right: Action Buttons */}
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
            
            {/* Tab Content */}
            {!patientData ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <p className="mb-2">No data available for patient {selectedPatientId}</p>
                  <p>This patient has not completed analysis yet.</p>
                </div>
              </div>
            ) : (
              <Tabs value={activeTab} className="flex-1 flex flex-col overflow-hidden">
                {/* Patient Info Tab */}
                <TabsContent value="info" className="flex-1 overflow-auto p-6 m-0">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <PatientDemographics patient={patientData} />
                      <ClinicalPhenotypes initialPhenotypes={patientData.phenotypes || []} />
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-6">
                      <GenomicDataUpload genomicFile={patientData.genomicFile} />
                      <DNAStructureVisualization variantInfo={patientData.variantInfo} />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Analysis Results Tab */}
                <TabsContent value="analysis" className="flex-1 overflow-auto p-6 m-0">
                  <div className="space-y-6">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-5 gap-6">
                      {/* Left Column (40%) */}
                      <div className="col-span-2 space-y-6">
                        <DiagnosticSummary />
                        <PatientPhenotypes />
                        <TopCandidateGenes />
                      </div>
                      
                      {/* Right Column (60%) */}
                      <div className="col-span-3">
                        <KnowledgeGraph graphData={patientData.knowledgeGraph} />
                      </div>
                    </div>
                    
                    {/* PatientsLikeMe Database Comparison */}
                    <PatientLikeMeComparison gene={patientData.variantInfo?.gene} />
                    
                    {/* Full Width Genetics Report */}
                    <DetailedGeneticsReport />
                  </div>
                </TabsContent>
                
                {/* Case Notes Tab */}
                <TabsContent value="notes" className="flex-1 overflow-auto p-6 m-0">
                  <div className="grid grid-cols-5 gap-6 h-full">
                    {/* Left Column (60%) */}
                    <div className="col-span-3">
                      <ClinicalNotes 
                        initialNotes={patientData.clinicalNotes} 
                        onSaveNote={handleSaveNote}
                      />
                    </div>
                    
                    {/* Right Column (40%) */}
                    <div className="col-span-2">
                      <CaseActivityHistory activities={activities} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </>
      )}

      {/* New Patient Dialog */}
      <NewPatientDialog
        open={newPatientDialogOpen}
        onOpenChange={setNewPatientDialogOpen}
        onCreatePatient={handleCreatePatient}
      />

      {/* Analysis Loading Overlay */}
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
              
              {/* Progress Bar */}
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

      {/* Floating Action Button - AI Chat */}
      <button
        onClick={() => setShowAiUnavailable(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group z-40"
        aria-label="Chat with AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-slate-900 text-white px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          AI Assistant
        </span>
      </button>

      {/* AI Unavailable Notification */}
      {showAiUnavailable && (
        <div className="fixed bottom-24 right-8 bg-[#1a0f2e] border border-purple-900/20 rounded-lg shadow-xl p-4 max-w-xs z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-100 mb-1">AI Assistant</p>
              <p className="text-slate-300">This feature is currently in development and not available yet.</p>
            </div>
            <button
              onClick={() => setShowAiUnavailable(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
