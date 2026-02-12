import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllPatientsAction, getPatientStatsAction } from '@/lib/actions/database';

interface DatabaseState {
    patients: any[];
    stats: {
        total: number;
        pending: number;
        ready: number;
        reviewed: number;
    } | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: DatabaseState = {
    patients: [],
    stats: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching all patients
export const fetchAllPatients = createAsyncThunk(
    'database/fetchAllPatients',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getAllPatientsAction();

            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to fetch patients');
            }

            return result.patients || [];
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

// Async thunk for fetching patient stats
export const fetchPatientStats = createAsyncThunk(
    'database/fetchPatientStats',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getPatientStatsAction();

            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to fetch stats');
            }

            return result.stats;
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

const databaseSlice = createSlice({
    name: 'database',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all patients
            .addCase(fetchAllPatients.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllPatients.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.isLoading = false;
                state.patients = action.payload;
                state.error = null;
            })
            .addCase(fetchAllPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch patient stats
            .addCase(fetchPatientStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPatientStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
                state.error = null;
            })
            .addCase(fetchPatientStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = databaseSlice.actions;
export default databaseSlice.reducer;
