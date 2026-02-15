import { PostSolution } from '../../types';

interface SolutionCardProps {
  solution: PostSolution;
  onLike?: (solutionId: string) => void;
}

const SolutionCard = ({ solution, onLike }: SolutionCardProps) => {
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
    <div className={`bg-white rounded-lg p-5 border ${solution.isAccepted ? 'border-green-500 border-2 bg-green-50' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-agri-green text-white flex items-center justify-center font-bold">
            {solution.userName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              {solution.userName}
              {solution.isAccepted && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  ✓ Accepted Solution
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-500">{formatDate(solution.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={() => onLike?.(solution.id)}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
            solution.isLiked
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {solution.isLiked ? '❤️' : '🤍'} {solution.likes}
        </button>
      </div>

      {/* Content */}
      <div className="text-gray-700 whitespace-pre-wrap">{solution.content}</div>

      {/* Images */}
      {solution.images && solution.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {solution.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              className="w-32 h-32 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionCard;
