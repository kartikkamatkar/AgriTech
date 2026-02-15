import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CommunityPost, PostSolution, CreatePostPayload, CreateSolutionPayload } from '../../types';
import { 
  fetchPosts as fetchPostsService,
  fetchPostById as fetchPostByIdService,
  createPost as createPostService,
  fetchSolutions as fetchSolutionsService,
  createSolution as createSolutionService,
  likePost as likePostService,
  likeSolution as likeSolutionService
} from '../../services/communityService';

interface CommunityState {
  posts: CommunityPost[];
  currentPost: CommunityPost | null;
  solutions: PostSolution[];
  loading: boolean;
  error: string | null;
  filter: {
    category?: string;
    search?: string;
  };
}

const initialState: CommunityState = {
  posts: [],
  currentPost: null,
  solutions: [],
  loading: false,
  error: null,
  filter: {},
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async (filter?: { category?: string; search?: string }) => {
    return await fetchPostsService(filter);
  }
);

export const fetchPostById = createAsyncThunk(
  'community/fetchPostById',
  async (postId: string) => {
    return await fetchPostByIdService(postId);
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (payload: CreatePostPayload) => {
    return await createPostService(payload);
  }
);

export const fetchSolutions = createAsyncThunk(
  'community/fetchSolutions',
  async (postId: string) => {
    return await fetchSolutionsService(postId);
  }
);

export const createSolution = createAsyncThunk(
  'community/createSolution',
  async (payload: CreateSolutionPayload) => {
    return await createSolutionService(payload);
  }
);

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId: string) => {
    return await likePostService(postId);
  }
);

export const likeSolution = createAsyncThunk(
  'community/likeSolution',
  async (solutionId: string) => {
    return await likeSolutionService(solutionId);
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ category?: string; search?: string }>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.solutions = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      });

    // Fetch post by ID
    builder
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch post';
      });

    // Create post
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      });

    // Fetch solutions
    builder
      .addCase(fetchSolutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutions.fulfilled, (state, action) => {
        state.loading = false;
        state.solutions = action.payload;
      })
      .addCase(fetchSolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch solutions';
      });

    // Create solution
    builder
      .addCase(createSolution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSolution.fulfilled, (state, action) => {
        state.loading = false;
        state.solutions.push(action.payload);
        if (state.currentPost) {
          state.currentPost.solutionCount += 1;
        }
      })
      .addCase(createSolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create solution';
      });

    // Like post
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.likes = action.payload.likes;
          post.isLiked = action.payload.isLiked;
        }
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.likes = action.payload.likes;
          state.currentPost.isLiked = action.payload.isLiked;
        }
      });

    // Like solution
    builder
      .addCase(likeSolution.fulfilled, (state, action) => {
        const solution = state.solutions.find((s) => s.id === action.payload.solutionId);
        if (solution) {
          solution.likes = action.payload.likes;
          solution.isLiked = action.payload.isLiked;
        }
      });
  },
});

export const { setFilter, clearError, clearCurrentPost } = communitySlice.actions;
export default communitySlice.reducer;
