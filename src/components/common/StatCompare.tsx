interface StatCompareProps {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  icon?: string;
}

const StatCompare = ({ label, current, previous, unit = '', icon = '📊' }: StatCompareProps) => {
  const difference = current - previous;
  const percentChange = previous !== 0 ? ((difference / previous) * 100).toFixed(1) : 0;
  const isPositive = difference > 0;
  const isNeutral = difference === 0;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-agri-green transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
          isNeutral ? 'bg-blue-100 text-blue-600' :
          isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {isNeutral ? '→' : isPositive ? '↗' : '↘'} {Math.abs(Number(percentChange))}%
        </div>
      </div>
      
      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        {label}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {current}{unit}
        </span>
      </div>
      
      <div className="text-xs text-gray-600 mt-1">
        vs {previous}{unit} last period
      </div>
    </div>
  );
};

export default StatCompare;
