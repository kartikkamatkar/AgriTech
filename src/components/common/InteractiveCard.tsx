interface InteractiveCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
}

const InteractiveCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  onClick,
  isActive = false,
  children
}: InteractiveCardProps) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-blue-600'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border-2 p-6
        transition-all duration-300 transform
        ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}
        ${isActive 
          ? 'border-agri-green shadow-lg scale-105' 
          : 'border-agri-beige-dark hover:border-agri-green'
        }
        animate-slide-in-up
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">{icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <span className={`text-lg font-semibold ${trendColors[trend]}`}>
                  {trendIcons[trend]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {subtitle && (
        <p className="text-sm text-gray-700 font-medium mb-2">{subtitle}</p>
      )}
      
      {children}
    </div>
  );
};

export default InteractiveCard;
