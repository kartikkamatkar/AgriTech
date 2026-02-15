import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCurrentWeather, fetchWeatherByCoords } from '../store/slices/weatherSlice';
import { fetchMarketData } from '../store/slices/marketSlice';
import { fetchSoilHealth } from '../store/slices/soilSlice';
import { updateSeasonalData } from '../store/slices/farmAnalyticsSlice';
import { setSelectedCity, setLocationCoordinates } from '../store/slices/locationSlice';
import { setMessage, clearMessage } from '../store/slices/messageSlice';
import LocationSelector from '../components/common/LocationSelector';
import RefreshButton from '../components/common/RefreshButton';

const Home = () => {
  const dispatch = useAppDispatch();
  
  // Get real data from Redux store
  const { current: weatherData, loading: weatherLoading } = useAppSelector((state) => state.weather);
  const { mood: marketMood, loading: marketLoading } = useAppSelector((state) => state.market);
  const { current: soilData, loading: soilLoading } = useAppSelector((state) => state.soil);
  const { seasonalData } = useAppSelector((state) => state.farmAnalytics);
  
  // Get selected city from global state (single source of truth)
  const { selectedCity } = useAppSelector((state) => state.location);
  
  // Get single status message from global state
  const { statusMessage, messageType } = useAppSelector((state) => state.message);
  
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Auto-hide message after 2.5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [statusMessage, dispatch]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        dispatch(fetchCurrentWeather(selectedCity)).unwrap(),
        dispatch(fetchMarketData()).unwrap(),
        dispatch(fetchSoilHealth({ location: selectedCity })).unwrap(),
      ]);
      dispatch(updateSeasonalData());
      setLastUpdated(new Date().toISOString());
      dispatch(setMessage({ message: 'Data refreshed successfully', type: 'success' }));
    } catch (error) {
      console.error('Error fetching data:', error);
      dispatch(setMessage({ message: 'Failed to refresh some data', type: 'error' }));
    }
  };

  useEffect(() => {
    // Fetch real-time data on component mount
    fetchAllData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchAllData();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, [selectedCity]);

  const handleCityChange = (city: string) => {
    // Update global city state (single source of truth)
    dispatch(setSelectedCity(city));
    
    // Fetch updated data for the new city
    dispatch(fetchCurrentWeather(city));
    dispatch(fetchSoilHealth({ location: city }));
    dispatch(fetchMarketData());
    dispatch(setMessage({ message: `Data updated for ${city}`, type: 'info' }));
  };

  const handleUseLocation = () => {
    if ('geolocation' in navigator) {
      dispatch(setMessage({ message: 'Getting your location...', type: 'info' }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Store coordinates in global state
          dispatch(setLocationCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }));
          
          // Fetch weather by coordinates
          dispatch(fetchWeatherByCoords({
            lat: position.coords.latitude, 
            lon: position.coords.longitude
          }));
          dispatch(setMessage({ message: 'Location detected successfully', type: 'success' }));
        },
        () => {
          dispatch(setMessage({ message: 'Unable to get your location', type: 'error' }));
        }
      );
    } else {
      dispatch(setMessage({ message: 'Geolocation not supported', type: 'error' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-beige to-white">
      {/* Fixed Status Message - Top Right */}
      {statusMessage && (
        <div 
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg border-2 text-sm font-medium shadow-lg animate-fade-in max-w-md ${
            messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            messageType === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="text-lg">
                {messageType === 'success' ? '✓' :
                 messageType === 'error' ? '✕' :
                 messageType === 'warning' ? '⚠' :
                 'ℹ'}
              </span>
              {statusMessage}
            </span>
            <button
              onClick={() => dispatch(clearMessage())}
              className="text-current opacity-60 hover:opacity-100 transition"
              aria-label="Clear message"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Season-Aware Greeting */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Top Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8 animate-slide-in-up">
            <LocationSelector
              currentCity={selectedCity}
              onCityChange={handleCityChange}
              onUseLocation={handleUseLocation}
            />
            <RefreshButton onRefresh={fetchAllData} lastUpdated={lastUpdated} />
          </div>

          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block bg-agri-green-soft text-agri-green px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {seasonalData.name} Season
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {seasonalData.greeting}
            </h1>
            <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
              Smart farming insights powered by real-time data
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Quick Farm Snapshot */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Weather Snapshot */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6 hover:shadow-md transition hover:border-agri-green transform hover:scale-105 duration-300 animate-slide-in-up">
              {weatherLoading && !weatherData ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agri-green"></div>
                </div>
              ) : weatherData ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl animate-bounce-slow">☀️</span>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Today's Weather</div>
                      <div className="text-2xl font-bold text-gray-900">{weatherData.temperature}°C</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium line-clamp-2">{weatherData.advice}</p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Data
                  </div>
                </>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  Weather data unavailable
                </div>
              )}
            </div>

            {/* Market Mood Snapshot */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6 hover:shadow-md transition hover:border-agri-green transform hover:scale-105 duration-300 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              {marketLoading && !marketMood ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agri-green"></div>
                </div>
              ) : marketMood ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl animate-bounce-slow">
                      {marketMood.overall === 'rising' ? '📈' : marketMood.overall === 'falling' ? '📉' : '➡️'}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Market Mood</div>
                      <div className={`text-2xl font-bold capitalize ${
                        marketMood.overall === 'rising' ? 'text-green-600' : 
                        marketMood.overall === 'falling' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {marketMood.overall}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold">
                    {marketMood.overall === 'rising' ? 'Good time to hold your harvest' : 
                     marketMood.overall === 'falling' ? 'Consider selling soon' : 
                     'Stable market conditions'}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Real-time Pricing
                  </div>
                </>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  Market data unavailable
                </div>
              )}
            </div>

            {/* Soil Health Snapshot */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6 hover:shadow-md transition hover:border-agri-green transform hover:scale-105 duration-300 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              {soilLoading && !soilData ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agri-green"></div>
                </div>
              ) : soilData ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl animate-bounce-slow">🌱</span>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Soil Health</div>
                      <div className="text-2xl font-bold text-gray-900">{soilData.status}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold line-clamp-2">{soilData.recommendation}</p>
                  <div className="mt-2 text-xs text-gray-500">pH: {soilData.ph} • Moisture: {soilData.moisture}%</div>
                </>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  Soil data unavailable
                </div>
              )}
            </div>
          </div>

          {/* Seasonal Insights */}
          <div className="bg-gradient-to-r from-agri-green-soft to-agri-beige rounded-xl p-6 mb-6 border-2 border-agri-green">
            <h3 className="text-lg font-bold text-agri-green mb-2">🌾 {seasonalData.name} Season Insights</h3>
            <p className="text-sm text-gray-800 font-medium mb-2">{seasonalData.weatherPattern}</p>
            <p className="text-sm text-gray-700">
              <strong>Irrigation:</strong> {seasonalData.irrigationAdvice}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-600">Recommended Crops:</span>
              {seasonalData.recommendedCrops.map((crop, idx) => (
                <span key={idx} className="text-xs bg-white text-agri-green px-2 py-1 rounded-full font-semibold">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Simple CTA Flow */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/dashboard" className="block group">
              <div className="bg-agri-green text-white rounded-xl shadow-sm p-8 hover:shadow-lg transition hover:bg-agri-green-light">
                <div className="text-3xl mb-3">🏡</div>
                <h3 className="text-2xl font-semibold mb-2">View Your Farm</h3>
                <p className="text-white font-medium mb-4">Complete dashboard with health score and insights</p>
                <div className="text-sm font-semibold group-hover:translate-x-2 transition-transform inline-block">
                  Go to Dashboard →
                </div>
              </div>
            </Link>

            <Link to="/market-insights" className="block group">
              <div className="bg-white border-2 border-agri-green text-agri-green rounded-xl shadow-sm p-8 hover:shadow-lg transition hover:bg-agri-green-soft">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-2xl font-semibold mb-2">Check Market Prices</h3>
                <p className="text-gray-800 font-semibold mb-4">Real-time market trends and selling recommendations</p>
                <div className="text-sm font-semibold group-hover:translate-x-2 transition-transform inline-block">
                  View Markets →
                </div>
              </div>
            </Link>
          </div>

          {/* Trust Builder */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-800 font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-agri-green text-xl">✓</span>
                <span>Real-time data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-agri-green text-xl">✓</span>
                <span>Simple & clear</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-agri-green text-xl">✓</span>
                <span>Built for farmers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
