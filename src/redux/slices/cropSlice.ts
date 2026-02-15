import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CropState {
  crops: Array<{
    id: string;
    name: string;
    status: string;
    area: number;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: CropState = {
  crops: [],
  loading: false,
  error: null,
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setCrops: (state, action: PayloadAction<Array<{ id: string; name: string; status: string; area: number }>>) => {
      state.crops = action.payload;
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

export const { setCrops, setLoading, setError } = cropSlice.actions;
export default cropSlice.reducer;
