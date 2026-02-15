// Market Data Service
// Integrates with commodity price APIs and provides market insights

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'commodity-rates-api.p.rapidapi.com';
const USE_REAL_API = Boolean(RAPIDAPI_KEY && RAPIDAPI_KEY !== 'demo');

export interface CropPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  trend: 'rising' | 'stable' | 'falling';
  lastUpdated: string;
}

export interface MarketMoodData {
  overall: 'rising' | 'stable' | 'falling';
  confidence: number;
  recommendation: string;
  bestWindow: string;
}

export interface PriceHistory {
  month: string;
  price: number;
  date: string;
}

export interface MarketData {
  prices: CropPrice[];
  mood: MarketMoodData;
  priceHistory: PriceHistory[];
  nearbyMarkets: {
    name: string;
    distance: string;
    price: number;
    trend: 'rising' | 'stable' | 'falling';
  }[];
}

// Commodity symbol mapping (adjust based on API's supported symbols)
const COMMODITY_SYMBOLS: Record<string, string> = {
  'Wheat': 'WHEAT',
  'Rice': 'RICE',
  'Cotton': 'COTTON',
  'Maize': 'CORN', // API might use 'CORN' instead of 'Maize'
  'Sugarcane': 'SUGAR',
};

// MSP (Minimum Support Price) 2024-25 - Official Government Rates
const MSP_PRICES: Record<string, number> = {
  'Wheat': 2125,
  'Rice': 2183,
  'Cotton': 6620,
  'Sugarcane': 340,
  'Maize': 2090,
};

export const marketService = {
  // Fetch real commodity data from RapidAPI
  async fetchRealCommodityPrice(symbol: string): Promise<{ price: number; change: number } | null> {
    if (!USE_REAL_API) return null;

    try {
      const response = await fetch(
        `https://${RAPIDAPI_HOST}/open-high-low-close/2023-01-01?symbol=${symbol}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY!,
            'X-RapidAPI-Host': RAPIDAPI_HOST,
          },
        }
      );

      if (!response.ok) {
        console.warn(`API request failed for ${symbol}:`, response.status);
        return null;
      }

      const data = await response.json();
      
      // Parse API response (adjust based on actual API response structure)
      if (data && data.close) {
        const closePrice = parseFloat(data.close);
        const openPrice = parseFloat(data.open);
        const change = openPrice > 0 ? ((closePrice - openPrice) / openPrice) * 100 : 0;
        
        return {
          price: closePrice,
          change: parseFloat(change.toFixed(2)),
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching commodity price for ${symbol}:`, error);
      return null;
    }
  },

  // Fetch current market prices
  async getCurrentPrices(): Promise<CropPrice[]> {
    try {
      const baseTime = Date.now();
      const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'];
      
      const pricePromises = crops.map(async (crop) => {
        // Try to fetch real data first
        let realData = null;
        if (USE_REAL_API) {
          const symbol = COMMODITY_SYMBOLS[crop];
          if (symbol) {
            realData = await this.fetchRealCommodityPrice(symbol);
          }
        }

        // Use real data if available, otherwise use MSP + fluctuation
        let price: number;
        let change: number;

        if (realData && realData.price > 0) {
          // Convert commodity price to Indian rupees per quintal (approximate)
          // Note: Commodity APIs usually give prices in USD or other units
          // You may need to adjust the conversion based on actual API data
          price = Math.round(realData.price * 100); // Adjust multiplier as needed
          change = realData.change;
        } else {
          // Fallback to MSP-based realistic pricing
          const basePrice = MSP_PRICES[crop] || 2000;
          const fluctuation = (Math.random() - 0.5) * 0.05; // ±2.5%
          price = Math.round(basePrice * (1 + fluctuation));
          change = parseFloat((fluctuation * 100).toFixed(2));
        }

        return {
          crop,
          price,
          unit: 'per quintal',
          change,
          trend: change > 1 ? 'rising' as const : change < -1 ? 'falling' as const : 'stable' as const,
          lastUpdated: new Date(baseTime).toISOString(),
        };
      });

      return await Promise.all(pricePromises);
    } catch (error) {
      console.error('Market API error:', error);
      
      // Return fallback MSP-based data
      return Object.entries(MSP_PRICES).map(([crop, basePrice]) => ({
        crop,
        price: basePrice,
        unit: 'per quintal',
        change: 0,
        trend: 'stable' as const,
        lastUpdated: new Date().toISOString(),
      }));
    }
  },

  // Get market mood and recommendations
  async getMarketMood(currentPrices: CropPrice[]): Promise<MarketMoodData> {
    try {
      // Calculate overall market trend
      const avgChange = currentPrices.reduce((sum, item) => sum + item.change, 0) / currentPrices.length;
      const risingCount = currentPrices.filter(p => p.trend === 'rising').length;
      
      let overall: 'rising' | 'stable' | 'falling';
      let recommendation: string;
      let bestWindow: string;
      
      if (avgChange > 1.5) {
        overall = 'rising';
        recommendation = 'Hold your harvest! Prices are trending upward. Consider selling in the next 7-14 days for maximum profit.';
        bestWindow = 'Next 7-14 days';
      } else if (avgChange < -1.5) {
        overall = 'falling';
        recommendation = 'Prices are declining. If you need to sell soon, consider selling now. Otherwise, wait for market recovery.';
        bestWindow = 'Sell now or wait';
      } else {
        overall = 'stable';
        recommendation = 'Market is stable. Good time to sell if you need cash. Prices unlikely to change significantly in short term.';
        bestWindow = 'Anytime this week';
      }
      
      const confidence = Math.min(95, 70 + (risingCount * 5));
      
      return {
        overall,
        confidence,
        recommendation,
        bestWindow,
      };
    } catch (error) {
      console.error('Market mood calculation error:', error);
      throw error;
    }
  },

  // Get price history (last 6 months)
  async getPriceHistory(_crop: string = 'Wheat'): Promise<PriceHistory[]> {
    try {
      // Simulate historical data
      // In production, fetch from actual API
      const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
      const basePrice = 1900;
      
      return months.map((month, index) => {
        // Simulate gradual price increase
        const trend = index * 50 + (Math.random() * 100 - 50);
        return {
          month,
          price: Math.round(basePrice + trend),
          date: new Date(2025, 7 + index, 1).toISOString(),
        };
      });
    } catch (error) {
      console.error('Price history error:', error);
      return [];
    }
  },

  // Get nearby market prices
  async getNearbyMarkets(_location: string = 'Delhi'): Promise<MarketData['nearbyMarkets']> {
    try {
      // Simulate nearby market data
      // In production, use geolocation and market database
      const markets = [
        { name: 'Azadpur Mandi', distance: '12 km', basePrice: 2050 },
        { name: 'Najafgarh Mandi', distance: '18 km', basePrice: 2080 },
        { name: 'Ghazipur Mandi', distance: '25 km', basePrice: 2030 },
      ];
      
      return markets.map(market => {
        const change = (Math.random() - 0.5) * 0.06;
        return {
          name: market.name,
          distance: market.distance,
          price: Math.round(market.basePrice * (1 + change)),
          trend: change > 0.02 ? 'rising' : change < -0.02 ? 'falling' : 'stable',
        };
      });
    } catch (error) {
      console.error('Nearby markets error:', error);
      return [];
    }
  },

  // Get complete market data
  async getMarketData(): Promise<MarketData> {
    try {
      const prices = await this.getCurrentPrices();
      const mood = await this.getMarketMood(prices);
      const priceHistory = await this.getPriceHistory();
      const nearbyMarkets = await this.getNearbyMarkets();
      
      return {
        prices,
        mood,
        priceHistory,
        nearbyMarkets,
      };
    } catch (error) {
      console.error('Complete market data error:', error);
      throw error;
    }
  },

  // Auto-refresh market data every 5 minutes
  startAutoRefresh(callback: (data: MarketData) => void, intervalMs: number = 300000) {
    const fetchAndUpdate = async () => {
      try {
        const data = await this.getMarketData();
        callback(data);
      } catch (error) {
        console.error('Auto-refresh error:', error);
      }
    };
    
    // Initial fetch
    fetchAndUpdate();
    
    // Set up interval
    return setInterval(fetchAndUpdate, intervalMs);
  },
};
