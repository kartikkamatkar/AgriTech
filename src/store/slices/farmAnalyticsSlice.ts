// Farm Analytics Redux Slice - Comprehensive farm intelligence
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  farmAnalyticsService, 
  FarmHealthScore, 
  YieldPrediction, 
  DailyInsight,
  SeasonalData 
} from '../../services/farmAnalyticsService';

interface FarmAnalyticsState {
  farmHealth: FarmHealthScore | null;
  yieldPrediction: YieldPrediction | null;
  dailyInsights: DailyInsight[];
  seasonalData: SeasonalData;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  location: string;
}

const initialState: FarmAnalyticsState = {
  farmHealth: null,
  yieldPrediction: null,
  dailyInsights: [],
  seasonalData: farmAnalyticsService.getCurrentSeasonalData(),
  loading: false,
  error: null,
  lastUpdated: null,
  location: 'Delhi',
};

// Fetch farm health score
export const fetchFarmHealth = createAsyncThunk(
  'farmAnalytics/fetchHealth',
  async ({ location, cropType }: { location?: string; cropType?: string }) => {
    const data = await farmAnalyticsService.getFarmHealth(location, cropType);
    return data;
  }
);

// Fetch yield prediction
export const fetchYieldPrediction = createAsyncThunk(
  'farmAnalytics/fetchYield',
  async ({ location, cropType, area }: { location?: string; cropType?: string; area?: number }) => {
    const data = await farmAnalyticsService.getYieldPrediction(location, cropType, area);
    return data;
  }
);

// Fetch daily insights
export const fetchDailyInsights = createAsyncThunk(
  'farmAnalytics/fetchInsights',
  async ({ location, cropType }: { location?: string; cropType?: string }) => {
    const data = await farmAnalyticsService.getDailyInsights(location, cropType);
    return data;
  }
);

// Fetch all farm analytics
export const fetchAllFarmAnalytics = createAsyncThunk(
  'farmAnalytics/fetchAll',
  async ({ location, cropType, area }: { location?: string; cropType?: string; area?: number }) => {
    const [health, yield_, insights] = await Promise.all([
      farmAnalyticsService.getFarmHealth(location, cropType),
      farmAnalyticsService.getYieldPrediction(location, cropType, area),
      farmAnalyticsService.getDailyInsights(location, cropType),
    ]);
    return { health, yield: yield_, insights };
  }
);

const farmAnalyticsSlice = createSlice({
  name: 'farmAnalytics',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    updateSeasonalData: (state) => {
      state.seasonalData = farmAnalyticsService.getCurrentSeasonalData();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch farm health
      .addCase(fetchFarmHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.farmHealth = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchFarmHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch farm health';
      })
      // Fetch yield prediction
      .addCase(fetchYieldPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYieldPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.yieldPrediction = action.payload;
      })
      .addCase(fetchYieldPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch yield prediction';
      })
      // Fetch daily insights
      .addCase(fetchDailyInsights.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDailyInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyInsights = action.payload;
      })
      .addCase(fetchDailyInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch daily insights';
      })
      // Fetch all analytics
      .addCase(fetchAllFarmAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFarmAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.farmHealth = action.payload.health;
        state.yieldPrediction = action.payload.yield;
        state.dailyInsights = action.payload.insights;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllFarmAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch farm analytics';
      });
  },
});

export const { setLocation, updateSeasonalData, clearError } = farmAnalyticsSlice.actions;
export default farmAnalyticsSlice.reducer;
