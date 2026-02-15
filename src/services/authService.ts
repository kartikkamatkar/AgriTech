import api from './api';

// Types
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'FARMER' | 'EXPERT' | 'ADMIN';
  location?: string;
  farmSize?: number;
  farmLocation?: string;
  crops?: string[];
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // seconds
}

export interface RegisterData {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  farmSize?: number;
  farmLocation?: string;
  crops?: string[];
  role?: 'FARMER' | 'EXPERT';
}

// API calls
export const requestOtp = async (phone: string): Promise<OtpResponse> => {
  try {
    const response = await api.post('/auth/request-otp', { phone });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOtp = async (phone: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invalid OTP');
  }
};

export const registerUser = async (data: RegisterData, otp: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', { ...data, otp });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user');
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

// Mock functions for development (remove when backend is ready)
export const mockRequestOtp = async (phone: string): Promise<OtpResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock OTP for ${phone}: 123456`);
      resolve({
        success: true,
        message: 'OTP sent successfully. Use 123456 for testing.',
        expiresIn: 300,
      });
    }, 1000);
  });
};

export const mockVerifyOtp = async (phone: string, otp: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') {
        const mockUser: User = {
          id: '1',
          name: 'Test User',
          phone,
          email: 'test@example.com',
          role: 'FARMER',
          location: 'Maharashtra',
          farmSize: 5,
          createdAt: new Date().toISOString(),
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        resolve({
          success: true,
          message: 'Login successful',
          token: mockToken,
          user: mockUser,
        });
      } else {
        reject(new Error('Invalid OTP. Use 123456 for testing.'));
      }
    }, 1000);
  });
};

export const mockRegisterUser = async (data: RegisterData, otp: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') {
        const mockUser: User = {
          id: Date.now().toString(),
          name: data.name,
          phone: data.phone,
          email: data.email,
          role: data.role || 'FARMER',
          location: data.location,
          farmSize: data.farmSize,
          farmLocation: data.farmLocation,
          crops: data.crops,
          createdAt: new Date().toISOString(),
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        resolve({
          success: true,
          message: 'Registration successful',
          token: mockToken,
          user: mockUser,
        });
      } else {
        reject(new Error('Invalid OTP. Use 123456 for testing.'));
      }
    }, 1000);
  });
};
