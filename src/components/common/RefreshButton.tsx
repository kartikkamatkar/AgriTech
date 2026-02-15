import { useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  lastUpdated?: string | null;
}

const RefreshButton = ({ onRefresh, lastUpdated }: RefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-center gap-3">
      {lastUpdated && (
        <span className="text-xs text-gray-600 font-medium">
          Updated {getTimeAgo(lastUpdated)}
        </span>
      )}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`flex items-center gap-2 px-4 py-2 bg-agri-green text-white rounded-lg hover:bg-agri-green-light transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
          isRefreshing ? 'animate-pulse' : ''
        }`}
      >
        <span className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`}>
          🔄
        </span>
        <span className="font-semibold">
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </span>
      </button>
    </div>
  );
};

export default RefreshButton;
