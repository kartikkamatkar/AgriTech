export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Weather {
  temperature: number;
  humidity: number;
  condition: string;
  location: string;
}

export interface Crop {
  id: string;
  name: string;
  status: string;
  area: number;
  plantedDate: string;
  expectedHarvest: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  price: number;
  change: number;
  unit: string;
}

export interface SoilHealth {
  id: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
}

// Community Forum Types
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  images?: string[];
  category: 'pest' | 'disease' | 'soil' | 'irrigation' | 'harvest' | 'equipment' | 'other';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  solutionCount: number;
}

export interface PostSolution {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked?: boolean;
  isAccepted?: boolean;
}

export interface CreatePostPayload {
  title: string;
  description: string;
  images?: File[];
  category: string;
  tags?: string[];
}

export interface CreateSolutionPayload {
  postId: string;
  content: string;
  images?: File[];
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  images?: string[];
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Government Schemes Types
export interface GovernmentScheme {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'other';
  state?: string;
  applicationDeadline?: string;
  applicationLink?: string;
  documents: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  publishedDate: string;
  isActive: boolean;
  views: number;
  imageUrl?: string;
}

export interface SchemeFilter {
  category?: string;
  state?: string;
  isActive?: boolean;
  search?: string;
}
