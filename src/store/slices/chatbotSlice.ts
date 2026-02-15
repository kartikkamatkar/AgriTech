import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatSession } from '../../types';
import {
  sendMessage as sendMessageService,
  fetchSessions as fetchSessionsService,
  createNewSession as createNewSessionService,
  loadSession as loadSessionService,
  deleteSession as deleteSessionService
} from '../../services/chatbotService';

interface ChatbotState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  loading: boolean;
  error: string | null;
  isTyping: boolean;
}

const initialState: ChatbotState = {
  currentSession: null,
  sessions: [],
  loading: false,
  error: null,
  isTyping: false,
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (payload: { message: string; images?: File[] }) => {
    return await sendMessageService(payload.message, payload.images);
  }
);

export const fetchSessions = createAsyncThunk(
  'chatbot/fetchSessions',
  async () => {
    return await fetchSessionsService();
  }
);

export const createNewSession = createAsyncThunk(
  'chatbot/createNewSession',
  async () => {
    return await createNewSessionService();
  }
);

export const loadSession = createAsyncThunk(
  'chatbot/loadSession',
  async (sessionId: string) => {
    return await loadSessionService(sessionId);
  }
);

export const deleteSession = createAsyncThunk(
  'chatbot/deleteSession',
  async (sessionId: string) => {
    await deleteSessionService(sessionId);
    return sessionId;
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.currentSession) {
        state.currentSession.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        if (state.currentSession) {
          state.currentSession.messages.push(action.payload);
          state.currentSession.updatedAt = new Date().toISOString();
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        state.error = action.error.message || 'Failed to send message';
      });

    // Fetch sessions
    builder
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      });

    // Create new session
    builder
      .addCase(createNewSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.sessions.unshift(action.payload);
      });

    // Load session
    builder
      .addCase(loadSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load session';
      });

    // Delete session
    builder
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((s) => s.id !== action.payload);
        if (state.currentSession?.id === action.payload) {
          state.currentSession = null;
        }
      });
  },
});

export const { clearError, setIsTyping, addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;
