// Farm Analytics Service - Comprehensive farm health and insights
// Aggregates data from multiple sources to provide holistic farm intelligence

import { weatherService, WeatherData } from './weatherService';
import { soilService, SoilHealthData, SoilAnalysis } from './soilService';

export interface FarmHealthScore {
  overallScore: number;
  factors: {
    name: string;
    score: number;
    status: 'excellent' | 'good' | 'moderate' | 'poor';
    trend: 'improving' | 'stable' | 'declining';
    recommendation: string;
  }[];
  lastUpdated: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface YieldPrediction {
  level: 'Very High' | 'High' | 'Moderate' | 'Low';
  confidence: number;
  expectedYield: number;
  unit: string;
  factors: {
    name: string;
    impact: 'positive' | 'neutral' | 'negative';
    score: number;
    description: string;
  }[];
}

export interface DailyInsight {
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: 'weather' | 'soil' | 'market' | 'crop' | 'irrigation' | 'fertilizer' | 'pest';
  title: string;
  description: string;
  action: string;
  icon: string;
}

export interface SeasonalData {
  name: 'Kharif' | 'Rabi' | 'Zaid';
  greeting: string;
  months: number[];
  recommendedCrops: string[];
  currentWeek: number;
  weatherPattern: string;
  irrigationAdvice: string;
}

class FarmAnalyticsService {
  // Calculate comprehensive farm health score
  async getFarmHealth(location: string = 'Delhi', cropType?: string): Promise<FarmHealthScore> {
    try {
      const [weather, soilHealth, soilAnalysis] = await Promise.all([
        weatherService.getCurrentWeather(location),
        soilService.getSoilHealth(location, cropType),
        soilService.getSoilAnalysis(location, cropType),
      ]);
      
      const factors = this.calculateFarmFactors(weather, soilHealth, soilAnalysis);
      const overallScore = this.calculateOverallScore(factors);
      const trend = this.analyzeTrend(factors);
      
      return {
        overallScore,
        factors,
        lastUpdated: new Date().toISOString(),
        trend,
      };
    } catch (error) {
      console.error('Error calculating farm health:', error);
      throw new Error('Failed to calculate farm health');
    }
  }

  // Generate yield confidence and prediction
  async getYieldPrediction(
    location: string = 'Delhi',
    cropType: string = 'Wheat',
    areaInAcres: number = 10
  ): Promise<YieldPrediction> {
    try {
      const [weather, soilHealth, forecast] = await Promise.all([
        weatherService.getCurrentWeather(location),
        soilService.getSoilHealth(location, cropType),
        weatherService.getForecast(location),
      ]);
      
      const factors = this.analyzeYieldFactors(weather, soilHealth, forecast, cropType);
      const confidence = this.calculateYieldConfidence(factors);
      const expectedYield = this.calculateExpectedYield(cropType, areaInAcres, confidence, soilHealth);
      const level = this.getConfidenceLevel(confidence);
      
      return {
        level,
        confidence,
        expectedYield,
        unit: this.getYieldUnit(cropType),
        factors,
      };
    } catch (error) {
      console.error('Error predicting yield:', error);
      throw new Error('Failed to predict yield');
    }
  }

  // Generate daily actionable insights
  async getDailyInsights(location: string = 'Delhi', cropType?: string): Promise<DailyInsight[]> {
    try {
      const [weather, soilHealth, forecast] = await Promise.all([
        weatherService.getCurrentWeather(location),
        soilService.getSoilHealth(location, cropType),
        weatherService.getForecast(location),
      ]);
      
      const insights: DailyInsight[] = [];
      const today = new Date().toISOString().split('T')[0];
      
      // Weather-based insights
      if (weather.temperature > 35) {
        insights.push({
          date: today,
          priority: 'high',
          category: 'irrigation',
          title: 'High Temperature Alert',
          description: `Temperature is ${weather.temperature}°C. Crops need extra water.`,
          action: 'Increase irrigation frequency. Water in early morning or evening.',
          icon: '🌡️',
        });
      }
      
      if (weather.humidity < 40) {
        insights.push({
          date: today,
          priority: 'medium',
          category: 'irrigation',
          title: 'Low Humidity Detected',
          description: `Humidity at ${weather.humidity}% may cause water stress.`,
          action: 'Ensure adequate soil moisture. Consider mulching.',
          icon: '💧',
        });
      }
      
      // Check forecast for rain
      const rainSoon = forecast.some((day, idx) => 
        idx < 3 && day.description.toLowerCase().includes('rain')
      );
      
      if (rainSoon) {
        insights.push({
          date: today,
          priority: 'high',
          category: 'weather',
          title: 'Rain Expected Soon',
          description: 'Rainfall predicted in next 2-3 days.',
          action: 'Postpone irrigation and fertilizer application. Check drainage.',
          icon: '🌧️',
        });
      }
      
      // Soil-based insights
      if (soilHealth.nitrogen === 'Low') {
        insights.push({
          date: today,
          priority: 'high',
          category: 'fertilizer',
          title: 'Nitrogen Deficiency Detected',
          description: 'Soil nitrogen levels are low.',
          action: 'Apply urea fertilizer (120 kg/acre). Split application recommended.',
          icon: '🌱',
        });
      }
      
      if (soilHealth.moisture < 40) {
        insights.push({
          date: today,
          priority: 'high',
          category: 'irrigation',
          title: 'Low Soil Moisture',
          description: `Soil moisture at ${soilHealth.moisture}%.`,
          action: 'Irrigate immediately to prevent water stress.',
          icon: '💧',
        });
      }
      
      // Seasonal insights
      const season = this.getCurrentSeason();
      insights.push(this.getSeasonalInsight(season, today));
      
      // Fertilizer timing insight
      if (this.isOptimalFertilizerTime(weather)) {
        insights.push({
          date: today,
          priority: 'medium',
          category: 'fertilizer',
          title: 'Good Time for Fertilizer Application',
          description: 'Weather conditions are favorable.',
          action: 'Apply fertilizers in the morning for better absorption.',
          icon: '✅',
        });
      }
      
      // Pest risk assessment based on weather
      if (weather.temperature >= 25 && weather.temperature <= 32 && weather.humidity > 65) {
        insights.push({
          date: today,
          priority: 'medium',
          category: 'pest',
          title: 'Moderate Pest Risk',
          description: 'Temperature and humidity favor pest activity.',
          action: 'Monitor crops closely. Check for common pests.',
          icon: '🐛',
        });
      }
      
      return insights.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
    } catch (error) {
      console.error('Error generating daily insights:', error);
      return [];
    }
  }

  // Get current seasonal information
  getCurrentSeasonalData(): SeasonalData {
    const month = new Date().getMonth();
    const date = new Date();
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear.getTime();
    const currentWeek = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    
    if (month >= 6 && month <= 9) {
      return {
        name: 'Kharif',
        greeting: 'Monsoon Season Planning',
        months: [6, 7, 8, 9],
        recommendedCrops: ['Rice', 'Cotton', 'Maize', 'Sorghum', 'Bajra'],
        currentWeek,
        weatherPattern: 'Heavy rainfall expected. Monsoon season.',
        irrigationAdvice: 'Ensure proper drainage. May not need irrigation.',
      };
    } else if (month >= 10 || month <= 2) {
      return {
        name: 'Rabi',
        greeting: 'Winter Crop Season',
        months: [10, 11, 0, 1, 2],
        recommendedCrops: ['Wheat', 'Barley', 'Mustard', 'Chickpea', 'Lentil'],
        currentWeek,
        weatherPattern: 'Cool and dry weather. Minimal rainfall.',
        irrigationAdvice: 'Regular irrigation needed. 3-4 times per season.',
      };
    } else {
      return {
        name: 'Zaid',
        greeting: 'Summer Crop Season',
        months: [3, 4, 5],
        recommendedCrops: ['Watermelon', 'Cucumber', 'Muskmelon', 'Vegetables'],
        currentWeek,
        weatherPattern: 'Hot and dry. High temperatures.',
        irrigationAdvice: 'Frequent irrigation essential. Daily watering may be needed.',
      };
    }
  }

  private calculateFarmFactors(
    weather: WeatherData,
    soilHealth: SoilHealthData,
    soilAnalysis: SoilAnalysis
  ) {
    return [
      {
        name: 'Soil Quality',
        score: soilAnalysis.healthScore,
        status: this.getFactorStatus(soilAnalysis.healthScore),
        trend: 'stable' as const,
        recommendation: soilHealth.recommendation,
      },
      {
        name: 'Water Availability',
        score: Math.min(100, soilHealth.moisture * 1.3),
        status: this.getFactorStatus(soilHealth.moisture * 1.3),
        trend: soilHealth.moisture > 60 ? 'improving' as const : 'declining' as const,
        recommendation: soilHealth.moisture < 50 ? 
          'Increase irrigation frequency' : 
          'Water availability is good',
      },
      {
        name: 'Weather Conditions',
        score: this.calculateWeatherScore(weather),
        status: this.getFactorStatus(this.calculateWeatherScore(weather)),
        trend: 'stable' as const,
        recommendation: weather.advice,
      },
      {
        name: 'Nutrient Balance',
        score: this.calculateNutrientScore(soilHealth),
        status: this.getFactorStatus(this.calculateNutrientScore(soilHealth)),
        trend: 'stable' as const,
        recommendation: 'Follow fertilizer recommendations for optimal growth',
      },
    ];
  }

  private calculateOverallScore(factors: any[]): number {
    const avgScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
    return Math.round(avgScore);
  }

  private analyzeTrend(factors: any[]): 'improving' | 'stable' | 'declining' {
    const improvingCount = factors.filter(f => f.trend === 'improving').length;
    const decliningCount = factors.filter(f => f.trend === 'declining').length;
    
    if (improvingCount > decliningCount) return 'improving';
    if (decliningCount > improvingCount) return 'declining';
    return 'stable';
  }

  private analyzeYieldFactors(
    weather: WeatherData,
    soilHealth: SoilHealthData,
    forecast: any[],
    _cropType: string
  ) {
    return [
      {
        name: 'Weather Pattern',
        impact: this.getWeatherImpact(weather) as any,
        score: this.calculateWeatherScore(weather),
        description: `Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%`,
      },
      {
        name: 'Soil Condition',
        impact: soilHealth.status === 'Excellent' || soilHealth.status === 'Good' ? 
          'positive' : soilHealth.status === 'Fair' ? 'neutral' : 'negative' as any,
        score: soilHealth.status === 'Excellent' ? 95 : 
               soilHealth.status === 'Good' ? 80 :
               soilHealth.status === 'Fair' ? 65 : 50,
        description: `pH: ${soilHealth.ph}, Moisture: ${soilHealth.moisture}%`,
      },
      {
        name: 'Nutrient Availability',
        impact: this.getNutrientImpact(soilHealth) as any,
        score: this.calculateNutrientScore(soilHealth),
        description: `N: ${soilHealth.nitrogen}, P: ${soilHealth.phosphorus}, K: ${soilHealth.potassium}`,
      },
      {
        name: 'Forecast Outlook',
        impact: this.getForecastImpact(forecast) as any,
        score: this.calculateForecastScore(forecast),
        description: forecast.length > 0 ? 
          `Next few days: ${forecast[0].description}` : 
          'Stable conditions expected',
      },
    ];
  }

  private calculateYieldConfidence(factors: any[]): number {
    const avgScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
    return Math.round(avgScore);
  }

  private calculateExpectedYield(
    cropType: string,
    area: number,
    confidence: number,
    soilHealth: SoilHealthData
  ): number {
    // Base yield per acre for different crops (in quintals)
    const baseYields: Record<string, number> = {
      'Wheat': 20,
      'Rice': 25,
      'Cotton': 15,
      'Maize': 22,
      'Sugarcane': 350,
    };
    
    const baseYield = baseYields[cropType] || 20;
    const confidenceFactor = confidence / 100;
    const soilFactor = soilHealth.status === 'Excellent' ? 1.2 :
                      soilHealth.status === 'Good' ? 1.0 :
                      soilHealth.status === 'Fair' ? 0.85 : 0.7;
    
    return Math.round(baseYield * area * confidenceFactor * soilFactor);
  }

  private getYieldUnit(cropType: string): string {
    if (cropType === 'Sugarcane') return 'tons';
    return 'quintals';
  }

  private getConfidenceLevel(confidence: number): YieldPrediction['level'] {
    if (confidence >= 85) return 'Very High';
    if (confidence >= 70) return 'High';
    if (confidence >= 55) return 'Moderate';
    return 'Low';
  }

  private getCurrentSeason(): SeasonalData['name'] {
    const month = new Date().getMonth();
    if (month >= 6 && month <= 9) return 'Kharif';
    if (month >= 10 || month <= 2) return 'Rabi';
    return 'Zaid';
  }

  private getSeasonalInsight(season: SeasonalData['name'], date: string): DailyInsight {
    const insights = {
      'Kharif': {
        title: 'Monsoon Crop Care',
        description: 'Kharif season is ideal for rice, cotton, and maize cultivation.',
        action: 'Ensure good drainage to prevent waterlogging during heavy rains.',
      },
      'Rabi': {
        title: 'Winter Crop Management',
        description: 'Rabi season is perfect for wheat, mustard, and chickpea.',
        action: 'Plan irrigation schedule as rainfall is minimal in winter.',
      },
      'Zaid': {
        title: 'Summer Crop Focus',
        description: 'Zaid season requires heat-tolerant crops like watermelon.',
        action: 'Increase irrigation frequency due to high temperatures.',
      },
    };
    
    return {
      date,
      priority: 'low',
      category: 'crop',
      ...insights[season],
      icon: '📅',
    };
  }

  private isOptimalFertilizerTime(weather: WeatherData): boolean {
    // Morning conditions with moderate temperature
    const hour = new Date().getHours();
    return hour >= 6 && hour <= 10 && 
           weather.temperature >= 20 && 
           weather.temperature <= 30 &&
           weather.windSpeed < 15;
  }

  private getFactorStatus(score: number): 'excellent' | 'good' | 'moderate' | 'poor' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'moderate';
    return 'poor';
  }

  private calculateWeatherScore(weather: WeatherData): number {
    // Ideal conditions: temp 20-30°C, humidity 50-70%
    const tempScore = Math.max(0, 100 - Math.abs(weather.temperature - 25) * 3);
    const humidityScore = Math.max(0, 100 - Math.abs(weather.humidity - 60) * 2);
    return Math.round((tempScore + humidityScore) / 2);
  }

  private calculateNutrientScore(soilHealth: SoilHealthData): number {
    const scores = {
      'High': 95,
      'Adequate': 75,
      'Low': 50,
    };
    return Math.round((
      scores[soilHealth.nitrogen] +
      scores[soilHealth.phosphorus] +
      scores[soilHealth.potassium]
    ) / 3);
  }

  private getWeatherImpact(weather: WeatherData): 'positive' | 'neutral' | 'negative' {
    const score = this.calculateWeatherScore(weather);
    if (score >= 75) return 'positive';
    if (score >= 55) return 'neutral';
    return 'negative';
  }

  private getNutrientImpact(soilHealth: SoilHealthData): 'positive' | 'neutral' | 'negative' {
    const score = this.calculateNutrientScore(soilHealth);
    if (score >= 75) return 'positive';
    if (score >= 60) return 'neutral';
    return 'negative';
  }

  private getForecastImpact(forecast: any[]): 'positive' | 'neutral' | 'negative' {
    const score = this.calculateForecastScore(forecast);
    if (score >= 70) return 'positive';
    if (score >= 50) return 'neutral';
    return 'negative';
  }

  private calculateForecastScore(forecast: any[]): number {
    if (forecast.length === 0) return 60;
    
    // Analyze upcoming conditions
    const extremeTempDays = forecast.filter(day => 
      day.temp > 38 || day.temp < 10
    ).length;
    
    const rainyDays = forecast.filter(day =>
      day.description.toLowerCase().includes('rain')
    ).length;
    
    let score = 70;
    score -= extremeTempDays * 10;
    
    // Moderate rain is good, too much is bad
    if (rainyDays === 1 || rainyDays === 2) score += 10;
    else if (rainyDays > 3) score -= 15;
    
    return Math.max(40, Math.min(95, score));
  }
}

export const farmAnalyticsService = new FarmAnalyticsService();
