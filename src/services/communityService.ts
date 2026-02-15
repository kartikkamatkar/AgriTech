import { 
  CommunityPost, 
  PostSolution, 
  CreatePostPayload, 
  CreateSolutionPayload 
} from '../types';
import api from './api';

const API_BASE = '/api/community';

export const fetchPosts = async (filter?: { category?: string; search?: string }): Promise<CommunityPost[]> => {
  try {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.search) params.append('search', filter.search);
    
    const response = await api.get(`${API_BASE}/posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return mock data for development
    return mockPosts;
  }
};

export const fetchPostById = async (postId: string): Promise<CommunityPost> => {
  try {
    const response = await api.get(`${API_BASE}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    // Return mock data for development
    return mockPosts.find(p => p.id === postId) || mockPosts[0];
  }
};

export const createPost = async (payload: CreatePostPayload): Promise<CommunityPost> => {
  try {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('category', payload.category);
    
    if (payload.tags) {
      formData.append('tags', JSON.stringify(payload.tags));
    }
    
    if (payload.images) {
      payload.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post(`${API_BASE}/posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const fetchSolutions = async (postId: string): Promise<PostSolution[]> => {
  try {
    const response = await api.get(`${API_BASE}/posts/${postId}/solutions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solutions:', error);
    // Return mock data for development
    return mockSolutions;
  }
};

export const createSolution = async (payload: CreateSolutionPayload): Promise<PostSolution> => {
  try {
    const formData = new FormData();
    formData.append('content', payload.content);
    
    if (payload.images) {
      payload.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post(`${API_BASE}/posts/${payload.postId}/solutions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating solution:', error);
    throw error;
  }
};

export const likePost = async (postId: string): Promise<{ postId: string; likes: number; isLiked: boolean }> => {
  try {
    const response = await api.post(`${API_BASE}/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    // Return mock response
    return { postId, likes: Math.floor(Math.random() * 100), isLiked: true };
  }
};

export const likeSolution = async (solutionId: string): Promise<{ solutionId: string; likes: number; isLiked: boolean }> => {
  try {
    const response = await api.post(`${API_BASE}/solutions/${solutionId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking solution:', error);
    // Return mock response
    return { solutionId, likes: Math.floor(Math.random() * 50), isLiked: true };
  }
};

// Mock data for development
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Rajesh Kumar',
    title: 'Yellow leaves on tomato plants - What could be the issue?',
    description: 'My tomato plants have been showing yellow leaves for the past week. I water them regularly and they get good sunlight. What could be causing this?',
    images: [],
    category: 'disease',
    tags: ['tomato', 'yellow-leaves', 'plant-health'],
    createdAt: '2026-02-10T10:30:00Z',
    updatedAt: '2026-02-10T10:30:00Z',
    views: 234,
    likes: 12,
    isLiked: false,
    solutionCount: 5,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Priya Sharma',
    title: 'Best irrigation system for wheat farming',
    description: 'I have 10 acres of land and planning to grow wheat. What irrigation system would be most cost-effective and efficient?',
    images: [],
    category: 'irrigation',
    tags: ['wheat', 'irrigation', 'farming'],
    createdAt: '2026-02-12T14:20:00Z',
    updatedAt: '2026-02-12T14:20:00Z',
    views: 156,
    likes: 8,
    isLiked: false,
    solutionCount: 3,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Amit Patel',
    title: 'Pest control for cotton crop',
    description: 'I am noticing small insects on my cotton plants. They seem to be damaging the leaves. Any organic pest control solutions?',
    images: [],
    category: 'pest',
    tags: ['cotton', 'pest-control', 'organic'],
    createdAt: '2026-02-14T09:15:00Z',
    updatedAt: '2026-02-14T09:15:00Z',
    views: 189,
    likes: 15,
    isLiked: false,
    solutionCount: 7,
  },
];

const mockSolutions: PostSolution[] = [
  {
    id: 'sol1',
    postId: '1',
    userId: 'expert1',
    userName: 'Dr. Suresh Agri Expert',
    content: 'Yellow leaves on tomato plants often indicate nitrogen deficiency. Try adding organic compost or nitrogen-rich fertilizer. Also check if the soil pH is between 6.0-6.8, which is ideal for tomatoes.',
    images: [],
    createdAt: '2026-02-11T08:45:00Z',
    updatedAt: '2026-02-11T08:45:00Z',
    likes: 8,
    isLiked: false,
    isAccepted: true,
  },
  {
    id: 'sol2',
    postId: '1',
    userId: 'farmer2',
    userName: 'Vikram Singh',
    content: 'I had the same issue last season. It could also be overwatering. Make sure the soil drains well and reduce watering frequency.',
    images: [],
    createdAt: '2026-02-11T10:30:00Z',
    updatedAt: '2026-02-11T10:30:00Z',
    likes: 5,
    isLiked: false,
    isAccepted: false,
  },
];
