import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchPosts, likePost, setFilter, createPost } from '../store/slices/communitySlice';
import PostCard from '../components/cards/PostCard';
import Loader from '../components/common/Loader';
import { CreatePostPayload } from '../types';

const Community = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, filter } = useSelector((state: RootState) => state.community);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    tags: '',
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchPosts(filter));
  }, [dispatch, filter]);

  const handleLike = (postId: string) => {
    dispatch(likePost(postId));
  };

  const handleFilterCategory = (category: string) => {
    dispatch(setFilter({ 
      ...filter, 
      category: filter.category === category ? undefined : category 
    }));
  };

  const handleSearch = () => {
    dispatch(setFilter({ ...filter, search: searchQuery }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: CreatePostPayload = {
      title: createFormData.title,
      description: createFormData.description,
      category: createFormData.category,
      images: selectedImages.length > 0 ? selectedImages : undefined,
      tags: createFormData.tags ? createFormData.tags.split(',').map(t => t.trim()) : undefined,
    };

    await dispatch(createPost(payload));
    setShowCreateModal(false);
    setCreateFormData({ title: '', description: '', category: 'other', tags: '' });
    setSelectedImages([]);
  };

  const categories = [
    { id: 'pest', label: 'Pest Control', icon: '🐛' },
    { id: 'disease', label: 'Disease', icon: '🦠' },
    { id: 'soil', label: 'Soil', icon: '🌱' },
    { id: 'irrigation', label: 'Irrigation', icon: '💧' },
    { id: 'harvest', label: 'Harvest', icon: '🌾' },
    { id: 'equipment', label: 'Equipment', icon: '🚜' },
    { id: 'other', label: 'Other', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-agri-beige-soft py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Community Forum</h1>
          <p className="text-gray-600">
            Share your farming problems and get solutions from fellow farmers and experts 🤝
          </p>
        </div>

        {/* Search and Create */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-agri-green text-white rounded-lg hover:bg-green-700 transition"
            >
              Search
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-agri-green text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              ➕ Ask Question
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter.category === cat.id
                    ? 'bg-agri-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No posts found. Be the first to ask a question!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))
            )}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Ask a Question</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={createFormData.title}
                      onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                      placeholder="e.g., Yellow leaves on tomato plants"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={createFormData.description}
                      onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                      placeholder="Describe your problem in detail..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={createFormData.category}
                      onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={createFormData.tags}
                      onChange={(e) => setCreateFormData({ ...createFormData, tags: e.target.value })}
                      placeholder="e.g., tomato, yellow-leaves, disease"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Images (optional)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {selectedImages.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedImages.length} image(s) selected
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-agri-green text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Post Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
