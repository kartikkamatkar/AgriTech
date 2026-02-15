// Soil Health Redux Slice - Real-time soil data management
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { soilService, SoilHealthData, SoilAnalysis } from '../../services/soilService';

interface SoilState {
  current: SoilHealthData | null;
  analysis: SoilAnalysis | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  location: string;
  cropType?: string;
}

const initialState: SoilState = {
  current: null,
  analysis: null,
  loading: false,
  error: null,
  lastUpdated: null,
  location: 'Delhi',
};

// Fetch current soil health
export const fetchSoilHealth = createAsyncThunk(
  'soil/fetchHealth',
  async ({ location, cropType }: { location?: string; cropType?: string }) => {
    const data = await soilService.getSoilHealth(location, cropType);
    return data;
  }
);

// Fetch comprehensive soil analysis
export const fetchSoilAnalysis = createAsyncThunk(
  'soil/fetchAnalysis',
  async ({ location, cropType }: { location?: string; cropType?: string }) => {
    const data = await soilService.getSoilAnalysis(location, cropType);
    return data;
  }
);

const soilSlice = createSlice({
  name: 'soil',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setCropType: (state, action: PayloadAction<string | undefined>) => {
      state.cropType = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch soil health
      .addCase(fetchSoilHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSoilHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSoilHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch soil health data';
      })
      // Fetch soil analysis
      .addCase(fetchSoilAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSoilAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSoilAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch soil analysis';
      });
  },
});

export const { setLocation, setCropType, clearError } = soilSlice.actions;
export default soilSlice.reducer;
