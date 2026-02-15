import { GovernmentScheme } from '../../types';

interface SchemeCardProps {
  scheme: GovernmentScheme;
  onClick: () => void;
}

const SchemeCard = ({ scheme, onClick }: SchemeCardProps) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      subsidy: '💰',
      loan: '🏦',
      insurance: '🛡️',
      training: '📚',
      equipment: '🚜',
      other: '📋',
    };
    return icons[category] || '📋';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      subsidy: 'bg-green-100 text-green-700',
      loan: 'bg-blue-100 text-blue-700',
      insurance: 'bg-purple-100 text-purple-700',
      training: 'bg-orange-100 text-orange-700',
      equipment: 'bg-yellow-100 text-yellow-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const isDeadlineNear = () => {
    if (!scheme.applicationDeadline) return false;
    const deadline = new Date(scheme.applicationDeadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-5 border border-gray-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(scheme.category)}`}>
          {getCategoryIcon(scheme.category)} {scheme.category.toUpperCase()}
        </span>
        {!scheme.isActive && (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            Inactive
          </span>
        )}
        {scheme.isActive && isDeadlineNear() && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold animate-pulse">
            ⏰ Deadline Soon
          </span>
        )}
      </div>

      {/* Image */}
      {scheme.imageUrl && (
        <img
          src={scheme.imageUrl}
          alt={scheme.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      {/* Title & Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-agri-green transition">
        {scheme.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {scheme.description}
      </p>

      {/* Benefits Preview */}
      {scheme.benefits.length > 0 && (
        <div className="mb-3">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <p className="line-clamp-1">{scheme.benefits[0]}</p>
          </div>
          {scheme.benefits.length > 1 && (
            <p className="text-xs text-gray-500 ml-5">
              +{scheme.benefits.length - 1} more benefits
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
        <div className="text-gray-500">
          <span>👁️ {scheme.views} views</span>
          {scheme.state && (
            <span className="ml-3">📍 {scheme.state}</span>
          )}
        </div>
        {scheme.applicationDeadline && scheme.isActive && (
          <span className="text-orange-600 font-semibold">
            Deadline: {new Date(scheme.applicationDeadline).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default SchemeCard;
