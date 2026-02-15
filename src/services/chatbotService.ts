import { ChatMessage, ChatSession } from '../types';
import api from './api';

const API_BASE = '/api/chatbot';

export const sendMessage = async (message: string, images?: File[]): Promise<ChatMessage> => {
  try {
    const formData = new FormData();
    formData.append('message', message);
    
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post(`${API_BASE}/message`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    // Return mock response for development
    return generateMockResponse(message);
  }
};

export const fetchSessions = async (): Promise<ChatSession[]> => {
  try {
    const response = await api.get(`${API_BASE}/sessions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

export const createNewSession = async (): Promise<ChatSession> => {
  try {
    const response = await api.post(`${API_BASE}/sessions`);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    // Return mock session
    return {
      id: `session-${Date.now()}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

export const loadSession = async (sessionId: string): Promise<ChatSession> => {
  try {
    const response = await api.get(`${API_BASE}/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading session:', error);
    throw error;
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    await api.delete(`${API_BASE}/sessions/${sessionId}`);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// Mock response generator for development
const generateMockResponse = (_userMessage: string): ChatMessage => {
  const responses = [
    'Based on your query, I recommend checking the soil moisture levels and ensuring proper drainage.',
    'For pest control, consider using neem oil as an organic solution. It\'s effective against many common pests.',
    'The symptoms you described could indicate a nitrogen deficiency. Try adding organic compost to your soil.',
    'Weather conditions play a crucial role. Make sure to check the forecast and adjust irrigation accordingly.',
    'Consider crop rotation to improve soil health and reduce pest issues naturally.',
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: randomResponse,
    timestamp: new Date().toISOString(),
  };
};
