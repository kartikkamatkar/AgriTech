export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Weather {
  temperature: number;
  humidity: number;
  condition: string;
  location: string;
}

export interface Crop {
  id: string;
  name: string;
  status: string;
  area: number;
  plantedDate: string;
  expectedHarvest: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  price: number;
  change: number;
  unit: string;
}

export interface SoilHealth {
  id: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
}
