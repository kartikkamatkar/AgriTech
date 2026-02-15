import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Storage key for persistence
const STORAGE_KEY = 'agrii_selected_city';

interface LocationState {
  selectedCity: string;
  locationCoordinates: {
    lat: number | null;
    lon: number | null;
  } | null;
  lastUpdatedTimestamp: string | null;
}

// Load persisted city from localStorage or use default
const loadPersistedCity = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch (error) {
    console.error('Failed to load city from localStorage:', error);
  }
  // Fallback to environment variable or default
  return import.meta.env.VITE_DEFAULT_CITY || 'Delhi';
};

// Initial state with rehydration from localStorage
const initialState: LocationState = {
  selectedCity: loadPersistedCity(),
  locationCoordinates: null,
  lastUpdatedTimestamp: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
      state.lastUpdatedTimestamp = new Date().toISOString();
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, action.payload);
      } catch (error) {
        console.error('Failed to persist city to localStorage:', error);
      }
    },
    
    setLocationCoordinates: (
      state,
      action: PayloadAction<{ lat: number; lon: number }>
    ) => {
      state.locationCoordinates = action.payload;
      state.lastUpdatedTimestamp = new Date().toISOString();
    },
    
    clearLocationCoordinates: (state) => {
      state.locationCoordinates = null;
    },
    
    resetLocation: (state) => {
      const defaultCity = import.meta.env.VITE_DEFAULT_CITY || 'Delhi';
      state.selectedCity = defaultCity;
      state.locationCoordinates = null;
      state.lastUpdatedTimestamp = null;
      
      // Clear from localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear city from localStorage:', error);
      }
    },
  },
});

export const {
  setSelectedCity,
  setLocationCoordinates,
  clearLocationCoordinates,
  resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
