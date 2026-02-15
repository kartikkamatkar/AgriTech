import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import type { User, RegisterData } from '../../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpLoading: boolean;
  otpError: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!authService.getStoredToken(),
  user: authService.getStoredUser(),
  token: authService.getStoredToken(),
  loading: false,
  error: null,
  otpSent: false,
  otpLoading: false,
  otpError: null,
};

// Async thunks
export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (phone: string, { rejectWithValue }) => {
    try {
      // Use mock for now until backend is ready
      const response = await authService.mockRequestOtp(phone);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtpAndLogin = createAsyncThunk(
  'auth/verifyOtpAndLogin',
  async ({ phone, otp }: { phone: string; otp: string }, { rejectWithValue }) => {
    try {
      // Use mock for now until backend is ready
      const response = await authService.mockVerifyOtp(phone, otp);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerWithOtp = createAsyncThunk(
  'auth/registerWithOtp',
  async ({ data, otp }: { data: RegisterData; otp: string }, { rejectWithValue }) => {
    try {
      // Use mock for now until backend is ready
      const response = await authService.mockRegisterUser(data, otp);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.otpError = null;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpError = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Request OTP
    builder
      .addCase(requestOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
        state.otpSent = false;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.otpError = null;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
        state.otpSent = false;
      });

    // Verify OTP and Login
    builder
      .addCase(verifyOtpAndLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(verifyOtpAndLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register with OTP
    builder
      .addCase(registerWithOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(registerWithOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        authService.logout();
      });
  },
});

export const { logout, clearError, resetOtpState, updateProfile } = authSlice.actions;
export default authSlice.reducer;
