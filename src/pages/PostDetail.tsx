import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchPostById,
  fetchSolutions,
  likePost,
  likeSolution,
  createSolution,
  clearCurrentPost,
} from '../store/slices/communitySlice';
import SolutionCard from '../components/cards/SolutionCard';
import Loader from '../components/common/Loader';
import { CreateSolutionPayload } from '../types';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentPost, solutions, loading } = useSelector((state: RootState) => state.community);

  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [solutionContent, setSolutionContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
      dispatch(fetchSolutions(postId));
    }

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, postId]);

  const handleLikePost = () => {
    if (currentPost) {
      dispatch(likePost(currentPost.id));
    }
  };

  const handleLikeSolution = (solutionId: string) => {
    dispatch(likeSolution(solutionId));
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    const payload: CreateSolutionPayload = {
      postId,
      content: solutionContent,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    };

    await dispatch(createSolution(payload));
    setSolutionContent('');
    setSelectedImages([]);
    setShowSolutionForm(false);
  };

  if (loading && !currentPost) {
    return <Loader />;
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-agri-beige-soft py-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post not found</h2>
          <button
            onClick={() => navigate('/community')}
            className="text-agri-green hover:underline"
          >
            ← Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agri-beige-soft py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="text-agri-green hover:underline mb-4 flex items-center gap-2"
        >
          ← Back to Community
        </button>

        {/* Post */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-agri-green text-white flex items-center justify-center font-bold text-lg">
                {currentPost.userName.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{currentPost.userName}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-agri-green-soft text-agri-green rounded-full text-sm font-semibold">
              {currentPost.category}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{currentPost.title}</h1>
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{currentPost.description}</p>

          {/* Images */}
          {currentPost.images && currentPost.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {currentPost.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentPost.tags.map((tag, idx) => (
                <span key={idx} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-gray-600">
              <span>👁️ {currentPost.views} views</span>
              <span>💬 {currentPost.solutionCount} solutions</span>
            </div>
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPost.isLiked
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {currentPost.isLiked ? '❤️' : '🤍'} {currentPost.likes}
            </button>
          </div>
        </div>

        {/* Solutions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Solutions ({solutions.length})
            </h2>
            <button
              onClick={() => setShowSolutionForm(!showSolutionForm)}
              className="px-4 py-2 bg-agri-green text-white rounded-lg hover:bg-green-700 transition"
            >
              {showSolutionForm ? 'Cancel' : '💡 Share Solution'}
            </button>
          </div>

          {/* Solution Form */}
          {showSolutionForm && (
            <form onSubmit={handleSubmitSolution} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <textarea
                required
                rows={4}
                value={solutionContent}
                onChange={(e) => setSolutionContent(e.target.value)}
                placeholder="Share your solution here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green mb-3"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
              />
              <button
                type="submit"
                className="w-full bg-agri-green text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Post Solution
              </button>
            </form>
          )}

          {/* Solutions List */}
          <div className="space-y-4">
            {solutions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No solutions yet. Be the first to help! 🌟
              </p>
            ) : (
              solutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  onLike={handleLikeSolution}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
