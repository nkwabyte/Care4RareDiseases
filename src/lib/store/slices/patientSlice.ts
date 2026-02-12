import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface PatientState {
    assignedPatientIds: string[];
    selectedPatientId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PatientState = {
    assignedPatientIds: [],
    selectedPatientId: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching assigned patients
export const fetchAssignedPatients = createAsyncThunk(
    'patient/fetchAssigned',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/patients');

            if (!response.ok) {
                return rejectWithValue('Failed to fetch patients');
            }

            const data = await response.json();
            return data.patients.map((p: { id: string }) => p.id);
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setSelectedPatient: (state, action: PayloadAction<string>) => {
            state.selectedPatientId = action.payload;
        },
        clearSelectedPatient: (state) => {
            state.selectedPatientId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignedPatients.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAssignedPatients.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.isLoading = false;
                state.assignedPatientIds = action.payload;
                state.error = null;

                // Set first patient as selected if none selected
                if (!state.selectedPatientId && action.payload.length > 0) {
                    state.selectedPatientId = action.payload[0];
                }
            })
            .addCase(fetchAssignedPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedPatient, clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
