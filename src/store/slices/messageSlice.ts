import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MessageType = 'info' | 'success' | 'warning' | 'error';

interface MessageState {
  statusMessage: string | null;
  messageType: MessageType;
}

const initialState: MessageState = {
  statusMessage: null,
  messageType: 'info',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (
      state,
      action: PayloadAction<{ message: string; type: MessageType }>
    ) => {
      // New message always replaces the old one
      state.statusMessage = action.payload.message;
      state.messageType = action.payload.type;
    },
    
    clearMessage: (state) => {
      state.statusMessage = null;
      state.messageType = 'info';
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;

export default messageSlice.reducer;
