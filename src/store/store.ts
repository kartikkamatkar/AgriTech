import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import marketReducer from './slices/marketSlice';
import authReducer from './slices/authSlice';
import cropReducer from './slices/cropSlice';
import soilReducer from './slices/soilSlice';
import farmAnalyticsReducer from './slices/farmAnalyticsSlice';
import locationReducer from './slices/locationSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    market: marketReducer,
    auth: authReducer,
    crop: cropReducer,
    soil: soilReducer,
    farmAnalytics: farmAnalyticsReducer,
    location: locationReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['market/setAutoRefreshInterval'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
