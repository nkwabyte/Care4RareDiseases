import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getReportsAction, getReportByIdAction, generateReportAction } from '@/lib/actions/reports';

interface ReportsState {
    reports: any[];
    currentReport: any | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ReportsState = {
    reports: [],
    currentReport: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching all reports
export const fetchReports = createAsyncThunk(
    'reports/fetchReports',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getReportsAction();

            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to fetch reports');
            }

            return result.reports || [];
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

// Async thunk for fetching a specific report
export const fetchReportById = createAsyncThunk(
    'reports/fetchReportById',
    async (reportId: string, { rejectWithValue }) => {
        try {
            const result = await getReportByIdAction(reportId);

            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to fetch report');
            }

            return result.report;
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

// Async thunk for generating a new report
export const generateReport = createAsyncThunk(
    'reports/generateReport',
    async ({ patientId, patientName }: { patientId: string; patientName: string }, { rejectWithValue }) => {
        try {
            const result = await generateReportAction(patientId, patientName);

            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to generate report');
            }

            return result.reportId;
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentReport: (state) => {
            state.currentReport = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch reports
            .addCase(fetchReports.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.isLoading = false;
                state.reports = action.payload;
                state.error = null;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch report by ID
            .addCase(fetchReportById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReportById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentReport = action.payload;
                state.error = null;
            })
            .addCase(fetchReportById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Generate report
            .addCase(generateReport.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generateReport.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(generateReport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearCurrentReport } = reportsSlice.actions;
export default reportsSlice.reducer;
