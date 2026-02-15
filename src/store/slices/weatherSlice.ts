import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { weatherService, WeatherData, ForecastData } from '../../services/weatherService';

interface WeatherState {
  current: WeatherData | null;
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  city: string;
}

const initialState: WeatherState = {
  current: null,
  forecast: [],
  loading: false,
  error: null,
  lastUpdated: null,
  city: 'Delhi',
};

// Async thunk for fetching current weather
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city: string = 'Delhi') => {
    const data = await weatherService.getCurrentWeather(city);
    return data;
  }
);

// Async thunk for fetching weather by coordinates
export const fetchWeatherByCoords = createAsyncThunk(
  'weather/fetchByCoords',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const data = await weatherService.getWeatherByCoords(lat, lon);
    return data;
  }
);

// Async thunk for fetching forecast
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city: string = 'Delhi') => {
    const data = await weatherService.getForecast(city);
    return data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current weather
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      // Fetch weather by coords
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      // Fetch forecast
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch forecast data';
      });
  },
});

export const { setCity, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
