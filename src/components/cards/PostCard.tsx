import { CommunityPost } from '../../types';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: CommunityPost;
  onLike?: (postId: string) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      pest: '🐛',
      disease: '🦠',
      soil: '🌱',
      irrigation: '💧',
      harvest: '🌾',
      equipment: '🚜',
      other: '❓',
    };
    return icons[category] || '📌';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      pest: 'bg-red-100 text-red-700',
      disease: 'bg-orange-100 text-orange-700',
      soil: 'bg-green-100 text-green-700',
      irrigation: 'bg-blue-100 text-blue-700',
      harvest: 'bg-yellow-100 text-yellow-700',
      equipment: 'bg-purple-100 text-purple-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-5 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-agri-green text-white flex items-center justify-center font-bold">
            {post.userName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{post.userName}</h4>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
          {getCategoryIcon(post.category)} {post.category}
        </span>
      </div>

      {/* Content */}
      <div 
        className="cursor-pointer"
        onClick={() => navigate(`/community/${post.id}`)}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-agri-green transition">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {post.description}
        </p>
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="flex gap-2 mb-3">
            {post.images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded"
              />
            ))}
            {post.images.length > 3 && (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-sm font-semibold text-gray-600">
                +{post.images.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            👁️ {post.views}
          </span>
          <span className="flex items-center gap-1">
            💬 {post.solutionCount} solutions
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(post.id);
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
            post.isLiked
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {post.isLiked ? '❤️' : '🤍'} {post.likes}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
