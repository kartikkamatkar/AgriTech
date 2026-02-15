import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeatherState {
  data: null | {
    temperature: number;
    humidity: number;
    condition: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action: PayloadAction<{ temperature: number; humidity: number; condition: string }>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setWeatherData, setLoading, setError } = weatherSlice.actions;
export default weatherSlice.reducer;
