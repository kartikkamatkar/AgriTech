import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCurrentWeather } from '../store/slices/weatherSlice';
import { fetchSoilHealth } from '../store/slices/soilSlice';
import { fetchAllFarmAnalytics } from '../store/slices/farmAnalyticsSlice';
import { setMessage } from '../store/slices/messageSlice';
import FarmHealthScore from '../components/unique/FarmHealthScore';
import WeatherSoilInsight from '../components/unique/WeatherSoilInsight';
import YieldConfidence from '../components/unique/YieldConfidence';
import DailyTipCard from '../components/unique/DailyTipCard';
import RefreshButton from '../components/common/RefreshButton';
import ExportButton from '../components/common/ExportButton';
import StatCompare from '../components/common/StatCompare';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  
  // Get real-time data from Redux store
  const { current: weatherData, loading: weatherLoading } = useAppSelector((state) => state.weather);
  const { current: soilData, loading: soilLoading } = useAppSelector((state) => state.soil);
  const { 
    farmHealth, 
    yieldPrediction, 
    dailyInsights, 
    loading: analyticsLoading 
  } = useAppSelector((state) => state.farmAnalytics);
  
  // Get selected city from global state (single source of truth)
  const { selectedCity } = useAppSelector((state) => state.location);
  
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      // Fetch all real-time data in parallel using global city
      await Promise.all([
        dispatch(fetchCurrentWeather(selectedCity)).unwrap(),
        dispatch(fetchSoilHealth({ location: selectedCity })).unwrap(),
        dispatch(fetchAllFarmAnalytics({ location: selectedCity })).unwrap(),
      ]);
      setLastUpdated(new Date().toISOString());
      dispatch(setMessage({ message: 'Dashboard data refreshed', type: 'success' }));
    } catch (error) {
      console.error('Error fetching data:', error);
      dispatch(setMessage({ message: 'Failed to refresh some data', type: 'error' }));
    }
  };

  useEffect(() => {
    // Initial fetch of all real data
    fetchAllData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchAllData();
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedCity]); // Re-fetch when global city changes

  // Get today's top priority insight
  const todaysTip = dailyInsights.length > 0 
    ? `${dailyInsights[0].title}: ${dailyInsights[0].action}`
    : 'Check back for daily farming insights!';

  // Calculate loading state
  const isLoading = weatherLoading || soilLoading || analyticsLoading;

  // Prepare export data
  const dashboardData = {
    farmHealth: farmHealth ? {
      overallScore: farmHealth.overallScore,
      factors: farmHealth.factors,
      trend: farmHealth.trend,
    } : null,
    weather: weatherData,
    soil: soilData,
    yieldPrediction: yieldPrediction,
    dailyInsights: dailyInsights,
    lastUpdated: lastUpdated || new Date().toISOString()
  };

  // Previous values for comparison (in real app, store these in state/localStorage)
  const previousScores = {
    farmHealth: 75,
    yieldConfidence: 80,
    temperature: weatherData ? weatherData.temperature - 2 : 26,
    soilPH: soilData ? soilData.ph - 0.1 : 6.7,
  };

  return (
    <div className="min-h-screen bg-agri-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-slow">🌾</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Farm Dashboard</h1>
                <p className="text-sm text-gray-700 font-medium">
                  Real-time insights powered by live data
                </p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ExportButton 
                data={dashboardData} 
                filename="farm-dashboard" 
                format="json"
                label="Export"
              />
              <RefreshButton onRefresh={fetchAllData} lastUpdated={lastUpdated} />
            </div>
          </div>
        </div>

        {/* Quick Stats Comparison */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
          <StatCompare
            label="Farm Health"
            current={farmHealth?.overallScore || 0}
            previous={previousScores.farmHealth}
            unit="/100"
            icon="💚"
          />
          <StatCompare
            label="Yield Confidence"
            current={yieldPrediction?.confidence || 0}
            previous={previousScores.yieldConfidence}
            unit="%"
            icon="📈"
          />
          <StatCompare
            label="Temperature"
            current={weatherData?.temperature || 0}
            previous={previousScores.temperature}
            unit="°C"
            icon="🌡️"
          />
          <StatCompare
            label="Soil pH"
            current={soilData?.ph || 0}
            previous={previousScores.soilPH}
            icon="🧪"
          />
        </div>

        {/* Daily Tip - Prominent */}
        <div className="mb-6 animate-slide-in-up">
          <DailyTipCard tip={todaysTip} />
        </div>

        {isLoading && !farmHealth ? (
          <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-agri-green mx-auto mb-4"></div>
              <p className="text-lg text-gray-700 font-semibold">Loading real-time farm data...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching weather, soil, and analytics</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {farmHealth && (
                <div 
                  onClick={() => setSelectedCard(selectedCard === 'health' ? null : 'health')}
                  className="cursor-pointer"
                >
                  <FarmHealthScore 
                    score={farmHealth.overallScore}
                    factors={farmHealth.factors.map(f => ({
                      name: f.name,
                      score: f.score,
                      status: f.status === 'excellent' ? 'good' : 
                             f.status === 'moderate' ? 'moderate' : 'good',
                    }))}
                  />
                </div>
              )}
              
              {yieldPrediction && (
                <div 
                  onClick={() => setSelectedCard(selectedCard === 'yield' ? null : 'yield')}
                  className="cursor-pointer"
                >
                  <YieldConfidence
                    level={yieldPrediction.level}
                    percentage={yieldPrediction.confidence}
                    factors={yieldPrediction.factors.map(f => ({
                      name: f.name,
                      impact: f.impact,
                    }))}
                  />
                </div>
              )}

              {selectedCard && (
                <div className="bg-agri-green-soft border-2 border-agri-green rounded-xl p-4 animate-slide-in-up">
                  <p className="text-sm text-agri-green font-semibold">
                    💡 Tip: {selectedCard === 'health' 
                      ? 'Maintain your farm health above 80 for optimal yields!'
                      : 'High yield confidence means better profit predictions!'}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              {weatherData && soilData ? (
                <div className="animate-slide-in-up">
                  <WeatherSoilInsight
                    weather={{
                      temperature: weatherData.temperature,
                      humidity: weatherData.humidity,
                      description: weatherData.description,
                      advice: weatherData.advice,
                    }}
                    soil={{
                      status: soilData.status,
                      ph: soilData.ph,
                      nitrogen: soilData.nitrogen,
                      phosphorus: soilData.phosphorus,
                      potassium: soilData.potassium,
                      recommendation: soilData.recommendation,
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6 flex items-center justify-center h-64 animate-pulse">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading environmental data...</p>
                  </div>
                </div>
              )}

              {/* Daily Insights */}
              {dailyInsights.length > 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Today's Insights ({dailyInsights.length})
                  </h3>
                  <div className="space-y-3">
                    {dailyInsights.slice(0, 4).map((insight, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900">{insight.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                              insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {insight.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{insight.description}</p>
                          <p className="text-xs text-agri-green font-semibold">
                            → {insight.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
