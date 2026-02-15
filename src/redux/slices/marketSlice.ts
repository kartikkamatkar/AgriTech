import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MarketState {
  prices: Array<{
    id: string;
    crop: string;
    price: number;
    change: number;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  prices: [],
  loading: false,
  error: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarketPrices: (state, action: PayloadAction<Array<{ id: string; crop: string; price: number; change: number }>>) => {
      state.prices = action.payload;
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

export const { setMarketPrices, setLoading, setError } = marketSlice.actions;
export default marketSlice.reducer;
