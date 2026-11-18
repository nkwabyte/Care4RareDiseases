import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Screen = 'dashboard' | 'patients' | 'reports' | 'database' | 'settings' | 'help';
type Tab = 'info' | 'analysis' | 'notes';

interface UIState {
    activeScreen: Screen;
    activeTab: Tab;
    newPatientDialogOpen: boolean;
    showAiUnavailable: boolean;
}

const initialState: UIState = {
    activeScreen: 'dashboard',
    activeTab: 'info',
    newPatientDialogOpen: false,
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
        setShowAiUnavailable: (state, action: PayloadAction<boolean>) => {
            state.showAiUnavailable = action.payload;
        },
    },
});

export const {
    setActiveScreen,
    setActiveTab,
    setNewPatientDialogOpen,
    setShowAiUnavailable,
} = uiSlice.actions;

export default uiSlice.reducer;
