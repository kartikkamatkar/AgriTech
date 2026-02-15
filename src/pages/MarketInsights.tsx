import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMarketData } from '../store/slices/marketSlice';
import { setMessage } from '../store/slices/messageSlice';
import MarketMood from '../components/unique/MarketMood';
import RefreshButton from '../components/common/RefreshButton';
import MarketFilter from '../components/common/MarketFilter';
import PriceAlert from '../components/common/PriceAlert';

const MarketInsights = () => {
  const dispatch = useAppDispatch();
  const { prices, mood, priceHistory, nearbyMarkets, loading, lastUpdated } = useAppSelector((state) => state.market);
  
  const [filteredPrices, setFilteredPrices] = useState(prices);
  const [filters, setFilters] = useState<any>({ trend: [], priceRange: null, crops: [] });

  useEffect(() => {
    // Fetch real-time market data
    dispatch(fetchMarketData());

    // Auto-refresh every 5 minutes for real-time pricing
    const interval = setInterval(() => {
      dispatch(fetchMarketData());
    }, 300000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    // Apply filters when prices or filters change
    if (!prices) return;
    
    let filtered = [...prices];
    
    // Filter by trend
    if (filters.trend.length > 0) {
      filtered = filtered.filter((item: any) => filters.trend.includes(item.trend));
    }
    
    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter((item: any) => 
        item.currentPrice >= filters.priceRange.min && 
        item.currentPrice <= filters.priceRange.max
      );
    }
    
    // Filter by crop
    if (filters.crops.length > 0) {
      filtered = filtered.filter((item: any) => filters.crops.includes(item.name));
    }
    
    setFilteredPrices(filtered);
  }, [prices, filters]);

  const handleRefresh = async () => {
    await dispatch(fetchMarketData());
    dispatch(setMessage({ message: 'Market data refreshed', type: 'success' }));
  };

  const handleSetAlert = (cropName: string, targetPrice: number, direction: 'above' | 'below') => {
    // In production, this would save to backend
    dispatch(setMessage({
      message: `Alert set for ${cropName} when price goes ${direction} ₹${targetPrice}`,
      type: 'success'
    }));
  };

  return (
    <div className="min-h-screen bg-agri-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-slow">💰</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
                <p className="text-sm text-gray-700 font-medium">Smart pricing and selling recommendations</p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MarketFilter onFilterChange={setFilters} />
              <RefreshButton onRefresh={handleRefresh} lastUpdated={lastUpdated} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Mood */}
            {loading && !mood ? (
              <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6 flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading real-time market data...</p>
                </div>
              </div>
            ) : mood ? (
              <MarketMood
                mood={mood.overall}
                confidence={mood.confidence}
                recommendation={mood.recommendation}
                bestWindow={mood.bestWindow}
              />
            ) : null}

            {/* Price Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wheat Price Trend (Last 6 Months)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      domain={[1800, 2200]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#4A7C59" 
                      strokeWidth={3}
                      dot={{ fill: '#4A7C59', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-agri-green-soft rounded-lg border border-agri-green">
                <p className="text-sm text-agri-green font-medium">
                  <strong className="font-bold">Insight:</strong> Prices have been steadily rising. Current trend suggests holding for better rates.
                </p>
              </div>
            </div>

            {/* Current Prices */}
            <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Market Prices
                {filters.trend.length + filters.crops.length + (filters.priceRange ? 1 : 0) > 0 && (
                  <span className="ml-2 text-sm font-medium text-agri-green">
                    ({filteredPrices?.length || 0} results)
                  </span>
                )}
              </h3>
              {loading && prices.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agri-green"></div>
                </div>
              ) : filteredPrices && filteredPrices.length > 0 ? (
                <div className="space-y-3">
                  {filteredPrices.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition transform hover:scale-105 duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl animate-pulse-slow">
                          {item.trend === 'rising' ? '📈' : item.trend === 'falling' ? '📉' : '➡️'}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-600 font-medium">per quintal</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">₹{item.currentPrice}</div>
                          <div className={`text-sm font-semibold ${
                            item.trend === 'rising' ? 'text-green-600' : 
                            item.trend === 'falling' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </div>
                        </div>
                        <PriceAlert
                          cropName={item.name}
                          currentPrice={item.currentPrice}
                          onSetAlert={(targetPrice, direction) => 
                            handleSetAlert(item.name, targetPrice, direction)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p className="text-lg mb-2">No items match your filters</p>
                  <p className="text-sm">Try adjusting your filter criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Nearby Markets */}
            <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Markets</h3>
              <div className="space-y-3">
                {nearbyMarkets.map((market, index) => (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-agri-green transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{market.name}</div>
                        <div className="text-xs text-gray-600 font-medium">📍 {market.distance} away</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        market.trend === 'rising' ? 'bg-green-100 text-green-700' :
                        market.trend === 'stable' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {market.trend}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-agri-green">₹{market.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selling Tips */}
            <div className="bg-gradient-to-br from-agri-brown to-agri-brown-light text-white rounded-xl shadow-sm p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>💡</span>
                Selling Tips
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Check prices from multiple markets before selling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Transport costs matter - closer markets may be better</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Rising trends suggest waiting improves returns</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;
