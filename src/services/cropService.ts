// Crop Service - Real-time crop data and management
// Integrates with farm analytics to provide dynamic crop insights

import { farmAnalyticsService } from './farmAnalyticsService';
import { weatherService } from './weatherService';
import { soilService } from './soilService';

export interface CropData {
  id: string;
  name: string;
  variety: string;
  areaPlanted: number;
  sowingDate: string;
  expectedHarvest: string;
  currentStage: string;
  stageProgress: number;
  health: number;
  yield: {
    expected: number;
    unit: string;
  };
  location: string;
  lastUpdated: string;
}

export interface CropTimeline {
  id: string;
  stage: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming' | 'missed';
  progress: number;
  tip: string;
  actions: string[];
}

export interface CareActivity {
  id: string;
  cropId: string;
  type: 'irrigation' | 'fertilizer' | 'pesticide' | 'weeding' | 'monitoring';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  weatherDependent: boolean;
}

export interface CropRecommendation {
  crop: string;
  suitability: number;
  reason: string;
  expectedYield: number;
  marketPrice: number;
  profitPotential: 'high' | 'medium' | 'low';
}

class CropService {
  private crops: Map<string, CropData> = new Map();

  // Add a new crop to management
  async addCrop(
    name: string,
    variety: string,
    areaPlanted: number,
    sowingDate: string,
    location: string = 'Delhi'
  ): Promise<CropData> {
    const id = `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate expected harvest date based on crop type
    const expectedHarvest = this.calculateHarvestDate(name, sowingDate);
    const currentStage = this.determineCurrentStage(name, sowingDate);
    const stageProgress = this.calculateStageProgress(name, sowingDate);
    
    // Get yield prediction
    const yieldPrediction = await farmAnalyticsService.getYieldPrediction(
      location,
      name,
      areaPlanted
    );
    
    // Calculate crop health based on current conditions
    const health = await this.calculateCropHealth(name, location, sowingDate);
    
    const cropData: CropData = {
      id,
      name,
      variety,
      areaPlanted,
      sowingDate,
      expectedHarvest,
      currentStage,
      stageProgress,
      health,
      yield: {
        expected: yieldPrediction.expectedYield,
        unit: yieldPrediction.unit,
      },
      location,
      lastUpdated: new Date().toISOString(),
    };
    
    this.crops.set(id, cropData);
    return cropData;
  }

  // Get all managed crops
  getAllCrops(): CropData[] {
    return Array.from(this.crops.values());
  }

  // Get crops by status
  getCropsByStatus(status: 'active' | 'completed'): CropData[] {
    const now = new Date();
    return this.getAllCrops().filter(crop => {
      const harvestDate = new Date(crop.expectedHarvest);
      if (status === 'active') {
        return harvestDate > now;
      } else {
        return harvestDate <= now;
      }
    });
  }

  // Get single crop detail
  getCrop(id: string): CropData | null {
    return this.crops.get(id) || null;
  }

  // Update crop data
  async updateCrop(id: string): Promise<CropData | null> {
    const crop = this.crops.get(id);
    if (!crop) return null;
    
    const currentStage = this.determineCurrentStage(crop.name, crop.sowingDate);
    const stageProgress = this.calculateStageProgress(crop.name, crop.sowingDate);
    const health = await this.calculateCropHealth(crop.name, crop.location, crop.sowingDate);
    
    const updatedCrop: CropData = {
      ...crop,
      currentStage,
      stageProgress,
      health,
      lastUpdated: new Date().toISOString(),
    };
    
    this.crops.set(id, updatedCrop);
    return updatedCrop;
  }

  // Delete crop
  deleteCrop(id: string): boolean {
    return this.crops.delete(id);
  }

  // Get crop timeline
  async getCropTimeline(cropId: string): Promise<CropTimeline[]> {
    const crop = this.crops.get(cropId);
    if (!crop) return [];
    
    const stages = this.getCropStages(crop.name);
    const sowingDate = new Date(crop.sowingDate);
    
    return stages.map((stage, index) => {
      const stageDate = new Date(sowingDate);
      stageDate.setDate(stageDate.getDate() + stage.daysFromSowing);
      
      const now = new Date();
      let status: CropTimeline['status'];
      let progress: number;
      
      if (stageDate < now) {
        status = 'completed';
        progress = 100;
      } else if (index === stages.findIndex(s => s.name === crop.currentStage)) {
        status = 'current';
        progress = crop.stageProgress;
      } else if (stageDate > now) {
        status = 'upcoming';
        progress = 0;
      } else {
        status = 'upcoming';
        progress = 0;
      }
      
      return {
        id: `timeline_${cropId}_${index}`,
        stage: stage.name,
        date: stageDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        status,
        progress,
        tip: stage.tip,
        actions: stage.actions,
      };
    });
  }

  // Get upcoming care activities
  async getUpcomingActivities(cropId: string, _daysAhead: number = 7): Promise<CareActivity[]> {
    const crop = this.crops.get(cropId);
    if (!crop) return [];
    
    const activities: CareActivity[] = [];
    const now = new Date();
    const weather = await weatherService.getCurrentWeather(crop.location);
    const soilHealth = await soilService.getSoilHealth(crop.location, crop.name);
    
    // Generate dynamic activities based on crop stage and conditions
    const sowingDate = new Date(crop.sowingDate);
    const daysFromSowing = Math.floor((now.getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Irrigation scheduling
    if (soilHealth.moisture < 50) {
      activities.push({
        id: `activity_irr_${Date.now()}`,
        cropId,
        type: 'irrigation',
        title: 'Irrigation Required',
        description: `Soil moisture is ${soilHealth.moisture}%. Water the crop.`,
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'pending',
        weatherDependent: true,
      });
    }
    
    // Fertilizer application based on crop stage
    const fertilizerSchedule = this.getFertilizerSchedule(crop.name);
    for (const schedule of fertilizerSchedule) {
      if (daysFromSowing >= schedule.daysFromSowing - 2 && 
          daysFromSowing <= schedule.daysFromSowing + 2) {
        activities.push({
          id: `activity_fert_${schedule.stage}`,
          cropId,
          type: 'fertilizer',
          title: `Apply ${schedule.type}`,
          description: schedule.description,
          dueDate: new Date(sowingDate.getTime() + schedule.daysFromSowing * 24 * 60 * 60 * 1000).toISOString(),
          priority: schedule.priority,
          status: 'pending',
          weatherDependent: false,
        });
      }
    }
    
    // Pest monitoring
    if (weather.temperature >= 25 && weather.temperature <= 32 && weather.humidity > 65) {
      activities.push({
        id: `activity_pest_${Date.now()}`,
        cropId,
        type: 'monitoring',
        title: 'Pest Monitoring',
        description: 'Weather conditions favor pest activity. Inspect crops.',
        dueDate: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        status: 'pending',
        weatherDependent: true,
      });
    }
    
    // Weeding based on stage
    if (['germination', 'vegetative', 'growth'].includes(crop.currentStage.toLowerCase())) {
      const lastWeeding = new Date(sowingDate.getTime() + 21 * 24 * 60 * 60 * 1000);
      if (now >= lastWeeding) {
        activities.push({
          id: `activity_weed_${Date.now()}`,
          cropId,
          type: 'weeding',
          title: 'Weeding Required',
          description: 'Remove weeds to prevent competition for nutrients.',
          dueDate: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'pending',
          weatherDependent: false,
        });
      }
    }
    
    return activities.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }

  // Get seasonal crop recommendations
  async getSeasonalRecommendations(location: string = 'Delhi'): Promise<CropRecommendation[]> {
    const seasonalData = farmAnalyticsService.getCurrentSeasonalData();
    const weather = await weatherService.getCurrentWeather(location);
    const soilHealth = await soilService.getSoilHealth(location);
    
    const recommendations: CropRecommendation[] = [];
    
    for (const crop of seasonalData.recommendedCrops) {
      const suitability = this.calculateSuitability(crop, weather, soilHealth, seasonalData.name);
      const yieldPrediction = await farmAnalyticsService.getYieldPrediction(location, crop, 10);
      
      recommendations.push({
        crop,
        suitability,
        reason: this.getSuitabilityReason(crop, suitability, seasonalData.name),
        expectedYield: yieldPrediction.expectedYield,
        marketPrice: this.getEstimatedMarketPrice(crop),
        profitPotential: suitability >= 80 ? 'high' : suitability >= 60 ? 'medium' : 'low',
      });
    }
    
    return recommendations.sort((a, b) => b.suitability - a.suitability);
  }

  private async calculateCropHealth(
    cropName: string,
    location: string,
    sowingDate: string
  ): Promise<number> {
    try {
      const [weather, soilHealth] = await Promise.all([
        weatherService.getCurrentWeather(location),
        soilService.getSoilHealth(location, cropName),
      ]);
      
      // Calculate health based on multiple factors
      const weatherScore = Math.max(0, 100 - Math.abs(weather.temperature - 25) * 2);
      const soilScore = soilHealth.status === 'Excellent' ? 95 :
                       soilHealth.status === 'Good' ? 80 :
                       soilHealth.status === 'Fair' ? 65 : 50;
      const moistureScore = Math.min(100, soilHealth.moisture * 1.2);
      
      // Age factor - crops are healthier in middle stages
      const sowingDateObj = new Date(sowingDate);
      const daysSinceSowing = Math.floor(
        (Date.now() - sowingDateObj.getTime()) / (1000 * 60 * 60 * 24)
      );
      const ageScore = this.getAgeHealthScore(cropName, daysSinceSowing);
      
      const overallHealth = Math.round(
        weatherScore * 0.25 + soilScore * 0.35 + moistureScore * 0.20 + ageScore * 0.20
      );
      
      return Math.max(50, Math.min(100, overallHealth));
    } catch (error) {
      console.error('Error calculating crop health:', error);
      return 75; // Default value
    }
  }

  private calculateHarvestDate(cropName: string, sowingDate: string): string {
    // Crop duration in days
    const durations: Record<string, number> = {
      'Wheat': 120,
      'Rice': 130,
      'Cotton': 150,
      'Maize': 90,
      'Sugarcane': 360,
    };
    
    const duration = durations[cropName] || 100;
    const sowing = new Date(sowingDate);
    const harvest = new Date(sowing.getTime() + duration * 24 * 60 * 60 * 1000);
    
    return harvest.toISOString().split('T')[0];
  }

  private determineCurrentStage(cropName: string, sowingDate: string): string {
    const stages = this.getCropStages(cropName);
    const daysSinceSowing = Math.floor(
      (Date.now() - new Date(sowingDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    for (let i = stages.length - 1; i >= 0; i--) {
      if (daysSinceSowing >= stages[i].daysFromSowing) {
        return stages[i].name;
      }
    }
    
    return stages[0].name;
  }

  private calculateStageProgress(cropName: string, sowingDate: string): number {
    const stages = this.getCropStages(cropName);
    const daysSinceSowing = Math.floor(
      (Date.now() - new Date(sowingDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const currentStageIndex = stages.findIndex((stage, idx) => {
      const nextStage = stages[idx + 1];
      return daysSinceSowing >= stage.daysFromSowing && 
             (!nextStage || daysSinceSowing < nextStage.daysFromSowing);
    });
    
    if (currentStageIndex === -1) return 0;
    if (currentStageIndex === stages.length - 1) return 100;
    
    const currentStage = stages[currentStageIndex];
    const nextStage = stages[currentStageIndex + 1];
    const stageDuration = nextStage.daysFromSowing - currentStage.daysFromSowing;
    const daysInStage = daysSinceSowing - currentStage.daysFromSowing;
    
    return Math.min(100, Math.round((daysInStage / stageDuration) * 100));
  }

  private getCropStages(cropName: string) {
    const stages: Record<string, any[]> = {
      'Wheat': [
        { name: 'Sowing', daysFromSowing: 0, tip: 'Use quality seeds', actions: ['Prepare soil', 'Use seed treatment'] },
        { name: 'Germination', daysFromSowing: 7, tip: 'Ensure moisture', actions: ['Light irrigation if needed'] },
        { name: 'Tillering', daysFromSowing: 25, tip: 'First nitrogen dose', actions: ['Apply urea', 'Weeding'] },
        { name: 'Stem Extension', daysFromSowing: 50, tip: 'Second fertilizer dose', actions: ['Irrigation', 'Monitor pests'] },
        { name: 'Flowering', daysFromSowing: 80, tip: 'Critical water stage', actions: ['Ensure water', 'Pest control'] },
        { name: 'Grain Filling', daysFromSowing: 95, tip: 'Maintain moisture', actions: ['Regular irrigation'] },
        { name: 'Maturity', daysFromSowing: 115, tip: 'Prepare for harvest', actions: ['Stop irrigation', 'Check grain'] },
      ],
      'Rice': [
        { name: 'Sowing', daysFromSowing: 0, tip: 'Nursery preparation', actions: ['Prepare nursery bed'] },
        { name: 'Transplanting', daysFromSowing: 25, tip: 'Transplant seedlings', actions: ['Transplant at 25 days'] },
        { name: 'Tillering', daysFromSowing: 40, tip: 'Nitrogen application', actions: ['Apply urea', 'Keep water'] },
        { name: 'Panicle Initiation', daysFromSowing: 65, tip: 'Critical growth stage', actions: ['Fertilizer', 'Maintain water'] },
        { name: 'Flowering', daysFromSowing: 85, tip: 'Ensure water', actions: ['Keep water level'] },
        { name: 'Grain Filling', daysFromSowing: 100, tip: 'Maintain water', actions: ['Regular water'] },
        { name: 'Maturity', daysFromSowing: 125, tip: 'Drain field', actions: ['Drain water', 'Prepare harvest'] },
      ],
    };
    
    return stages[cropName] || stages['Wheat'];
  }

  private getFertilizerSchedule(cropName: string) {
    const schedules: Record<string, any[]> = {
      'Wheat': [
        { stage: 'basal', type: 'DAP', daysFromSowing: 0, description: 'Apply DAP at sowing', priority: 'high' as const },
        { stage: 'tillering', type: 'Urea', daysFromSowing: 25, description: 'First top dressing with urea', priority: 'high' as const },
        { stage: 'flowering', type: 'Urea', daysFromSowing: 80, description: 'Second top dressing', priority: 'medium' as const },
      ],
      'Rice': [
        { stage: 'basal', type: 'DAP', daysFromSowing: 0, description: 'Apply DAP before transplanting', priority: 'high' as const },
        { stage: 'tillering', type: 'Urea', daysFromSowing: 40, description: 'First nitrogen dose', priority: 'high' as const },
        { stage: 'panicle', type: 'Urea + MOP', daysFromSowing: 65, description: 'Apply urea and potash', priority: 'high' as const },
      ],
    };
    
    return schedules[cropName] || schedules['Wheat'];
  }

  private getAgeHealthScore(cropName: string, daysSinceSowing: number): number {
    const totalDuration = cropName === 'Wheat' ? 120 : cropName === 'Rice' ? 130 : 100;
    const progress = daysSinceSowing / totalDuration;
    
    // Bell curve - healthiest in middle stages (40-70% of cycle)
    if (progress < 0.1) return 70; // Establishment
    if (progress < 0.4) return 85; // Growth
    if (progress < 0.7) return 95; // Peak health
    if (progress < 0.9) return 85; // Maturity
    return 75; // Near harvest
  }

  private calculateSuitability(
    cropName: string,
    weather: any,
    soilHealth: any,
    season: string
  ): number {
    // Base suitability by season
    const seasonSuitability: Record<string, Record<string, number>> = {
      'Kharif': { 'Rice': 90, 'Cotton': 85, 'Maize': 80, 'Sorghum': 75, 'Bajra': 80 },
      'Rabi': { 'Wheat': 90, 'Barley': 85, 'Mustard': 80, 'Chickpea': 85, 'Lentil': 80 },
      'Zaid': { 'Watermelon': 90, 'Cucumber': 85, 'Muskmelon': 80, 'Vegetables': 75 },
    };
    
    let score = seasonSuitability[season]?.[cropName] || 50;
    
    // Adjust for soil conditions
    if (soilHealth.status === 'Excellent') score += 5;
    else if (soilHealth.status === 'Poor') score -= 15;
    
    // Adjust for weather
    if (weather.temperature >= 20 && weather.temperature <= 30) score += 5;
    if (weather.humidity >= 50 && weather.humidity <= 70) score += 5;
    
    return Math.min(100, Math.max(40, score));
  }

  private getSuitabilityReason(cropName: string, suitability: number, season: string): string {
    if (suitability >= 85) {
      return `Excellent choice for ${season} season. All conditions favor ${cropName} cultivation.`;
    } else if (suitability >= 70) {
      return `Good option for ${season}. ${cropName} should perform well.`;
    } else if (suitability >= 55) {
      return `Moderate suitability. ${cropName} can be grown with proper care.`;
    } else {
      return `Low suitability for current conditions. Consider alternatives.`;
    }
  }

  private getEstimatedMarketPrice(cropName: string): number {
    // Current MSP (Minimum Support Price) - realistic values
    const prices: Record<string, number> = {
      'Wheat': 2125,
      'Rice': 2183,
      'Cotton': 6620,
      'Maize': 2090,
      'Sugarcane': 340,
      'Barley': 1850,
      'Mustard': 5650,
      'Chickpea': 5440,
    };
    
    return prices[cropName] || 2000;
  }
}

export const cropService = new CropService();
