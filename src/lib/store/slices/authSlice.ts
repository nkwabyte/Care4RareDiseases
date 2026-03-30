import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginAction, logoutAction, getSessionAction, type AuthUser } from '@/lib/actions/auth';

interface Doctor {
    id: number;
    email: string;
    name: string;
    specialty?: string;
}

interface AuthState {
    doctor: Doctor | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    doctor: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const result = await loginAction(email, password);

            if (!result.success) {
                return rejectWithValue(result.error || 'Login failed');
            }

            return result.user as Doctor;
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const result = await logoutAction();

        if (!result.success) {
            return rejectWithValue('Logout failed');
        }

        return null;
    } catch (error) {
        return rejectWithValue('Network error');
    }
});

// Async thunk for checking session
export const checkSession = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
    try {
        const result = await getSessionAction();

        if (!result.success) {
            return rejectWithValue('Not authenticated');
        }

        return result.user as Doctor;
    } catch (error) {
        return rejectWithValue('Network error');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<Doctor>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.doctor = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.doctor = null;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.doctor = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state) => {
                state.isLoading = false;
            })
            // Check session
            .addCase(checkSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkSession.fulfilled, (state, action: PayloadAction<Doctor>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.doctor = action.payload;
                state.error = null;
            })
            .addCase(checkSession.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.doctor = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
