// Weather Service using OpenWeatherMap API
// Get your free API key from: https://openweathermap.org/api

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  advice: string;
}

export interface ForecastData {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export const weatherService = {
  // Get current weather by city name
  async getCurrentWeather(city: string = 'Delhi'): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${WEATHER_BASE_URL}/weather?q=${city},IN&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        advice: this.generateAdvice(data.main.temp, data.main.humidity, data.weather[0].main),
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Return fallback data
      return {
        temperature: 28,
        humidity: 65,
        description: 'Clear sky',
        icon: '01d',
        windSpeed: 3.5,
        pressure: 1013,
        feelsLike: 30,
        advice: 'Weather data temporarily unavailable. Using default recommendations.',
      };
    }
  },

  // Get weather by coordinates (for location-based weather)
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        advice: this.generateAdvice(data.main.temp, data.main.humidity, data.weather[0].main),
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  },

  // Get 5-day forecast
  async getForecast(city: string = 'Delhi'): Promise<ForecastData[]> {
    try {
      const response = await fetch(
        `${WEATHER_BASE_URL}/forecast?q=${city},IN&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      const data = await response.json();
      
      // Get one forecast per day (at noon)
      const dailyForecasts = data.list.filter((item: any) => 
        item.dt_txt.includes('12:00:00')
      ).slice(0, 5);
      
      return dailyForecasts.map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }));
    } catch (error) {
      console.error('Forecast API error:', error);
      return [];
    }
  },

  // Generate farming advice based on weather conditions
  generateAdvice(temp: number, humidity: number, condition: string): string {
    if (temp > 35) {
      return 'High temperature alert! Increase irrigation frequency and provide shade for sensitive crops.';
    } else if (temp < 10) {
      return 'Cold weather alert! Protect sensitive crops from frost. Consider mulching.';
    } else if (humidity > 80) {
      return 'High humidity detected. Monitor crops for fungal diseases. Ensure good air circulation.';
    } else if (humidity < 30) {
      return 'Low humidity. Increase watering frequency to prevent crop stress.';
    } else if (condition.toLowerCase().includes('rain')) {
      return 'Rain expected. Postpone irrigation and chemical applications. Check drainage systems.';
    } else if (condition.toLowerCase().includes('clear')) {
      return 'Good weather for field activities. Ideal time for spraying and fertilizer application.';
    } else {
      return 'Monitor weather conditions regularly. Adjust farming activities accordingly.';
    }
  },
};
