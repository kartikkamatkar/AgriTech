import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { marketService, CropPrice, MarketMoodData, PriceHistory, MarketData } from '../../services/marketService';

interface MarketState {
  prices: CropPrice[];
  mood: MarketMoodData | null;
  priceHistory: PriceHistory[];
  nearbyMarkets: MarketData['nearbyMarkets'];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  autoRefreshInterval: number | null;
}

const initialState: MarketState = {
  prices: [],
  mood: null,
  priceHistory: [],
  nearbyMarkets: [],
  loading: false,
  error: null,
  lastUpdated: null,
  autoRefreshInterval: null,
};

// Async thunk for fetching complete market data
export const fetchMarketData = createAsyncThunk(
  'market/fetchData',
  async () => {
    const data = await marketService.getMarketData();
    return data;
  }
);

// Async thunk for fetching current prices only
export const fetchCurrentPrices = createAsyncThunk(
  'market/fetchPrices',
  async () => {
    const prices = await marketService.getCurrentPrices();
    return prices;
  }
);

// Async thunk for fetching price history
export const fetchPriceHistory = createAsyncThunk(
  'market/fetchHistory',
  async (crop: string = 'Wheat') => {
    const history = await marketService.getPriceHistory(crop);
    return history;
  }
);

// Async thunk for fetching nearby markets
export const fetchNearbyMarkets = createAsyncThunk(
  'market/fetchNearby',
  async (location: string = 'Delhi') => {
    const markets = await marketService.getNearbyMarkets(location);
    return markets;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setAutoRefreshInterval: (state, action: PayloadAction<number | null>) => {
      state.autoRefreshInterval = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch complete market data
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload.prices;
        state.mood = action.payload.mood;
        state.priceHistory = action.payload.priceHistory;
        state.nearbyMarkets = action.payload.nearbyMarkets;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market data';
      })
      // Fetch current prices
      .addCase(fetchCurrentPrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCurrentPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch prices';
      })
      // Fetch price history
      .addCase(fetchPriceHistory.fulfilled, (state, action) => {
        state.priceHistory = action.payload;
      })
      // Fetch nearby markets
      .addCase(fetchNearbyMarkets.fulfilled, (state, action) => {
        state.nearbyMarkets = action.payload;
      });
  },
});

export const { setAutoRefreshInterval, clearError } = marketSlice.actions;
export default marketSlice.reducer;
