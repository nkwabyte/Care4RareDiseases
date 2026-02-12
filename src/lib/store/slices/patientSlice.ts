import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface PatientState {
    assignedPatientIds: string[];
    selectedPatientId: string | null;
    currentPatient: any | null; // Typed loosely for now, should use Patient type
    isLoading: boolean;
    error: string | null;
}

const initialState: PatientState = {
    assignedPatientIds: [],
    selectedPatientId: null,
    currentPatient: null,
    isLoading: false,
    error: null,
};

import { getPatientsAction } from '@/lib/actions/patients';
import { getAllPatientsAction } from '@/lib/actions/database';

// ... imports

// Async thunk for fetching assigned patients
// Async thunk for fetching all patients (temporarily used for sidebar as requested)
export const fetchAssignedPatients = createAsyncThunk(
    'patient/fetchAssigned',
    async (_, { rejectWithValue }) => {
        try {
            // Using getAllPatientsAction to show all seeded patients in sidebar
            const result = await getAllPatientsAction();

            if (!result.success) {
                return rejectWithValue(result.error);
            }

            // Map full patient objects to IDs
            return result.patients?.map((p: any) => p.id) || [];
        } catch (error) {
            return rejectWithValue('Failed to fetch patients');
        }
    }
);

import { getPatientByIdAction } from '@/lib/actions/patients';

// Async thunk for fetching patient details
export const fetchPatientDetails = createAsyncThunk(
    'patient/fetchDetails',
    async (patientId: string, { rejectWithValue }) => {
        try {
            const result = await getPatientByIdAction(patientId);

            if (!result.success) {
                return rejectWithValue(result.error);
            }

            return result.patient;
        } catch (error) {
            return rejectWithValue('Failed to fetch patient details');
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
            })
            .addCase(fetchPatientDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPatientDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPatient = action.payload;
                state.error = null;
            })
            .addCase(fetchPatientDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedPatient, clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
