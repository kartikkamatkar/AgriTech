// Enhanced Crop Redux Slice - Real-time crop management
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  cropService, 
  CropData, 
  CropTimeline, 
  CareActivity,
  CropRecommendation 
} from '../../services/cropService';

interface CropState {
  crops: CropData[];
  selectedCrop: CropData | null;
  timeline: CropTimeline[];
  activities: CareActivity[];
  recommendations: CropRecommendation[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CropState = {
  crops: [],
  selectedCrop: null,
  timeline: [],
  activities: [],
  recommendations: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Add new crop
export const addCrop = createAsyncThunk(
  'crop/add',
  async ({ name, variety, area, sowingDate, location }: {
    name: string;
    variety: string;
    area: number;
    sowingDate: string;
    location?: string;
  }) => {
    const data = await cropService.addCrop(name, variety, area, sowingDate, location);
    return data;
  }
);

// Update crop data
export const updateCrop = createAsyncThunk(
  'crop/update',
  async (cropId: string) => {
    const data = await cropService.updateCrop(cropId);
    return data;
  }
);

// Fetch crop timeline
export const fetchCropTimeline = createAsyncThunk(
  'crop/fetchTimeline',
  async (cropId: string) => {
    const data = await cropService.getCropTimeline(cropId);
    return data;
  }
);

// Fetch upcoming activities
export const fetchCropActivities = createAsyncThunk(
  'crop/fetchActivities',
  async ({ cropId, daysAhead }: { cropId: string; daysAhead?: number }) => {
    const data = await cropService.getUpcomingActivities(cropId, daysAhead);
    return data;
  }
);

// Fetch seasonal recommendations
export const fetchCropRecommendations = createAsyncThunk(
  'crop/fetchRecommendations',
  async (location?: string) => {
    const data = await cropService.getSeasonalRecommendations(location);
    return data;
  }
);

// Load all crops
export const loadAllCrops = createAsyncThunk(
  'crop/loadAll',
  async () => {
    const data = cropService.getAllCrops();
    return data;
  }
);

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    selectCrop: (state, action: PayloadAction<CropData | null>) => {
      state.selectedCrop = action.payload;
    },
    removeCrop: (state, action: PayloadAction<string>) => {
      cropService.deleteCrop(action.payload);
      state.crops = state.crops.filter(c => c.id !== action.payload);
      if (state.selectedCrop?.id === action.payload) {
        state.selectedCrop = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add crop
      .addCase(addCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.crops.push(action.payload);
        state.selectedCrop = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add crop';
      })
      // Update crop
      .addCase(updateCrop.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCrop.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.crops.findIndex(c => c.id === action.payload!.id);
          if (index !== -1) {
            state.crops[index] = action.payload;
          }
          if (state.selectedCrop?.id === action.payload.id) {
            state.selectedCrop = action.payload;
          }
        }
      })
      .addCase(updateCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update crop';
      })
      // Fetch timeline
      .addCase(fetchCropTimeline.fulfilled, (state, action) => {
        state.timeline = action.payload;
      })
      // Fetch activities
      .addCase(fetchCropActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      })
      // Fetch recommendations
      .addCase(fetchCropRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCropRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchCropRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recommendations';
      })
      // Load all crops
      .addCase(loadAllCrops.fulfilled, (state, action) => {
        state.crops = action.payload;
      });
  },
});

export const { selectCrop, removeCrop, clearError } = cropSlice.actions;
export default cropSlice.reducer;
