interface MarketMoodProps {
  mood: string;
  confidence: number;
  recommendation: string;
  bestWindow: string;
}

const MarketMood = ({ mood, confidence, recommendation, bestWindow }: MarketMoodProps) => {
  const getMoodEmoji = (mood: string) => {
    const moods: { [key: string]: { emoji: string; text: string; color: string } } = {
      rising: { emoji: '📈', text: 'Rising', color: 'bg-green-50 text-green-700 border-green-200' },
      stable: { emoji: '➡️', text: 'Stable', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      falling: { emoji: '📉', text: 'Falling', color: 'bg-red-50 text-red-700 border-red-200' },
    };
    return moods[mood] || moods.stable;
  };

  const moodData = getMoodEmoji(mood);

  return (
    <div className="bg-gradient-to-br from-agri-beige to-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Mood</h3>
      
      <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${moodData.color} mb-4`}>
        <span className="text-4xl">{moodData.emoji}</span>
        <div>
          <div className="text-xl font-bold">{moodData.text}</div>
          <div className="text-sm opacity-80">Confidence: {confidence}%</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Recommendation</div>
          <div className="text-sm text-gray-900 font-medium">{recommendation}</div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Best Selling Window</div>
          <div className="text-sm font-bold text-agri-green">{bestWindow}</div>
        </div>
      </div>
    </div>
  );
};

export default MarketMood;
