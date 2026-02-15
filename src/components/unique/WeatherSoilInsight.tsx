interface WeatherSoilInsightProps {
  weather: {
    temperature: number;
    humidity: number;
    rainfall: string;
    advice: string;
    mood: string;
  };
  soil: {
    status: string;
    ph: number;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    recommendation: string;
  };
}

const WeatherSoilInsight = ({ weather, soil }: WeatherSoilInsightProps) => {
  const getMoodIcon = (mood: string) => {
    const moods: { [key: string]: string } = {
      favorable: '☀️',
      moderate: '⛅',
      unfavorable: '🌧️',
    };
    return moods[mood] || '🌤️';
  };

  const getSoilStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Good: 'bg-green-50 border-green-200 text-green-800',
      'Needs Care': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'Attention Required': 'bg-red-50 border-red-200 text-red-800',
    };
    return colors[status] || colors['Good'];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather & Soil Insight</h3>
      
      {/* Weather Section */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{getMoodIcon(weather.mood)}</span>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-2xl font-bold text-gray-900">{weather.temperature}°C</span>
                <span className="text-sm text-gray-700 font-medium ml-2">{weather.humidity}% humidity</span>
              </div>
            </div>
            <div className="text-sm text-gray-700 font-medium mb-2">
              💧 {weather.rainfall}
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <div className="text-sm text-blue-900 font-medium">{weather.advice}</div>
        </div>
      </div>

      {/* Soil Section */}
      <div>
        <div className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold mb-3 ${getSoilStatusColor(soil.status)}`}>
          {soil.status}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <div className="text-xs text-gray-600 font-semibold">pH Level</div>
            <div className="text-sm font-bold text-gray-900">{soil.ph}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <div className="text-xs text-gray-600 font-semibold">Nitrogen</div>
            <div className="text-sm font-bold text-gray-900">{soil.nitrogen}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <div className="text-xs text-gray-600 font-semibold">Phosphorus</div>
            <div className="text-sm font-bold text-gray-900">{soil.phosphorus}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <div className="text-xs text-gray-600 font-semibold">Potassium</div>
            <div className="text-sm font-bold text-gray-900">{soil.potassium}</div>
          </div>
        </div>
        
        <div className="bg-agri-green-soft border-l-4 border-agri-green p-3 rounded">
          <div className="text-sm text-agri-green font-medium">{soil.recommendation}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSoilInsight;
