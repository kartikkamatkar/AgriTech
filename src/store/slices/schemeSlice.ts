import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GovernmentScheme, SchemeFilter } from '../../types';
import {
  fetchSchemes as fetchSchemesService,
  fetchSchemeById as fetchSchemeByIdService,
  fetchStates as fetchStatesService,
  incrementSchemeView as incrementSchemeViewService
} from '../../services/schemeService';

interface SchemeState {
  schemes: GovernmentScheme[];
  currentScheme: GovernmentScheme | null;
  loading: boolean;
  error: string | null;
  filter: SchemeFilter;
  categories: string[];
  states: string[];
}

const initialState: SchemeState = {
  schemes: [],
  currentScheme: null,
  loading: false,
  error: null,
  filter: { isActive: true },
  categories: ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other'],
  states: [],
};

// Async thunks
export const fetchSchemes = createAsyncThunk(
  'scheme/fetchSchemes',
  async (filter?: SchemeFilter) => {
    return await fetchSchemesService(filter);
  }
);

export const fetchSchemeById = createAsyncThunk(
  'scheme/fetchSchemeById',
  async (schemeId: string) => {
    return await fetchSchemeByIdService(schemeId);
  }
);

export const fetchStates = createAsyncThunk(
  'scheme/fetchStates',
  async () => {
    return await fetchStatesService();
  }
);

export const incrementSchemeView = createAsyncThunk(
  'scheme/incrementSchemeView',
  async (schemeId: string) => {
    return await incrementSchemeViewService(schemeId);
  }
);

const schemeSlice = createSlice({
  name: 'scheme',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<SchemeFilter>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearFilter: (state) => {
      state.filter = { isActive: true };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentScheme: (state) => {
      state.currentScheme = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch schemes
    builder
      .addCase(fetchSchemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schemes';
      });

    // Fetch scheme by ID
    builder
      .addCase(fetchSchemeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchemeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentScheme = action.payload;
      })
      .addCase(fetchSchemeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch scheme';
      });

    // Fetch states
    builder
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload;
      });

    // Increment scheme view
    builder
      .addCase(incrementSchemeView.fulfilled, (state, action) => {
        const scheme = state.schemes.find((s) => s.id === action.payload.schemeId);
        if (scheme) {
          scheme.views = action.payload.views;
        }
        if (state.currentScheme && state.currentScheme.id === action.payload.schemeId) {
          state.currentScheme.views = action.payload.views;
        }
      });
  },
});

export const { setFilter, clearFilter, clearError, clearCurrentScheme } = schemeSlice.actions;
export default schemeSlice.reducer;
