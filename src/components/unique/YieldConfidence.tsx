interface YieldConfidenceProps {
  level: string;
  percentage: number;
  factors: Array<{ name: string; impact: string }>;
}

const YieldConfidence = ({ level, percentage, factors }: YieldConfidenceProps) => {
  const getImpactIcon = (impact: string) => {
    const icons = {
      positive: { icon: '✓', color: 'text-green-600 bg-green-50' },
      neutral: { icon: '~', color: 'text-yellow-600 bg-yellow-50' },
      negative: { icon: '✕', color: 'text-red-600 bg-red-50' },
    };
    return icons[impact as keyof typeof icons] || icons.neutral;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Confidence</h3>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-agri-green mb-2">{percentage}%</div>
        <div className="text-sm text-gray-700 font-medium">Confidence Level: <span className="font-bold text-gray-900">{level}</span></div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-agri-green to-agri-green-light h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Contributing Factors</div>
        {factors.map((factor, index) => {
          const impactStyle = getImpactIcon(factor.impact);
          return (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-800">{factor.name}</span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${impactStyle.color} ${impactStyle.color}`}>
                {impactStyle.icon}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YieldConfidence;
