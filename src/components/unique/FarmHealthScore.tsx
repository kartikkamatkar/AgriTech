interface FarmHealthScoreProps {
  score: number;
  factors: Array<{ name: string; score: number; status: string }>;
}

const FarmHealthScore = ({ score, factors }: FarmHealthScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-agri-green';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      good: 'bg-agri-green-soft text-agri-green',
      moderate: 'bg-yellow-50 text-yellow-700',
      poor: 'bg-red-50 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.moderate;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Health Score</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E8E2D5"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#4A7C59"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score / 100) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {factors.map((factor, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{factor.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{factor.score}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusBadge(factor.status)}`}>
                {factor.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmHealthScore;
