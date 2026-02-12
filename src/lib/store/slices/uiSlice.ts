import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Screen = 'dashboard' | 'patients' | 'reports' | 'database' | 'settings' | 'help';
type Tab = 'info' | 'analysis' | 'notes';

interface UIState {
    activeScreen: Screen;
    activeTab: Tab;
    newPatientDialogOpen: boolean;
    isAnalysisRunning: boolean;
    analysisProgress: number;
    showAiUnavailable: boolean;
}

const initialState: UIState = {
    activeScreen: 'dashboard',
    activeTab: 'info',
    newPatientDialogOpen: false,
    isAnalysisRunning: false,
    analysisProgress: 0,
    showAiUnavailable: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveScreen: (state, action: PayloadAction<Screen>) => {
            state.activeScreen = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<Tab>) => {
            state.activeTab = action.payload;
        },
        setNewPatientDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.newPatientDialogOpen = action.payload;
        },
        startAnalysis: (state) => {
            state.isAnalysisRunning = true;
            state.analysisProgress = 0;
        },
        updateAnalysisProgress: (state, action: PayloadAction<number>) => {
            state.analysisProgress = action.payload;
        },
        completeAnalysis: (state) => {
            state.isAnalysisRunning = false;
            state.analysisProgress = 0;
            state.activeTab = 'analysis';
        },
        setShowAiUnavailable: (state, action: PayloadAction<boolean>) => {
            state.showAiUnavailable = action.payload;
        },
    },
});

export const {
    setActiveScreen,
    setActiveTab,
    setNewPatientDialogOpen,
    startAnalysis,
    updateAnalysisProgress,
    completeAnalysis,
    setShowAiUnavailable,
} = uiSlice.actions;

export default uiSlice.reducer;
