const WeatherCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Weather</h3>
      <div className="space-y-2">
        <p className="text-gray-600">Loading weather data...</p>
      </div>
    </div>
  );
};

export default WeatherCard;
