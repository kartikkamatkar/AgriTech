import { GovernmentScheme, SchemeFilter } from '../types';
import api from './api';

const API_BASE = '/api/schemes';

export const fetchSchemes = async (filter?: SchemeFilter): Promise<GovernmentScheme[]> => {
  try {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.state) params.append('state', filter.state);
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
    if (filter?.search) params.append('search', filter.search);
    
    const response = await api.get(`${API_BASE}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schemes:', error);
    // Return mock data for development
    return mockSchemes;
  }
};

export const fetchSchemeById = async (schemeId: string): Promise<GovernmentScheme> => {
  try {
    const response = await api.get(`${API_BASE}/${schemeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scheme:', error);
    // Return mock data for development
    return mockSchemes.find(s => s.id === schemeId) || mockSchemes[0];
  }
};

export const fetchStates = async (): Promise<string[]> => {
  try {
    const response = await api.get(`${API_BASE}/states`);
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return mockStates;
  }
};

export const incrementSchemeView = async (schemeId: string): Promise<{ schemeId: string; views: number }> => {
  try {
    const response = await api.post(`${API_BASE}/${schemeId}/view`);
    return response.data;
  } catch (error) {
    console.error('Error incrementing scheme view:', error);
    // Return mock response
    return { schemeId, views: Math.floor(Math.random() * 1000) };
  }
};

// Mock data for development
const mockSchemes: GovernmentScheme[] = [
  {
    id: '1',
    title: 'PM-KISAN - Pradhan Mantri Kisan Samman Nidhi',
    description: 'Financial benefit of ₹6000 per year to all farmer families having cultivable land, in three equal installments of ₹2000 each.',
    eligibility: [
      'Must be a farmer family',
      'Should own cultivable land',
      'All farmers irrespective of landholding size are eligible',
      'Institutional land holders are not eligible',
    ],
    benefits: [
      '₹6000 per year direct benefit transfer',
      'Payment in three installments',
      'Direct transfer to bank account',
      'No limit on family income',
    ],
    category: 'subsidy',
    applicationDeadline: '2026-03-31',
    applicationLink: 'https://pmkisan.gov.in',
    documents: [
      'Aadhaar Card',
      'Land Ownership Documents',
      'Bank Account Details',
      'Mobile Number',
    ],
    contactInfo: {
      phone: '155261',
      email: 'pmkisan-ict@gov.in',
      website: 'https://pmkisan.gov.in',
    },
    publishedDate: '2026-01-15',
    isActive: true,
    views: 4523,
    imageUrl: '/assets/schemes/pm-kisan.jpg',
  },
  {
    id: '2',
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'Provides adequate and timely credit support to farmers for their cultivation and other needs at a reduced interest rate.',
    eligibility: [
      'All farmers – individual/joint borrowers who are owner cultivators',
      'Tenant farmers, oral lessees & share croppers',
      'Self Help Groups or Joint Liability Groups of farmers',
    ],
    benefits: [
      'Credit limit based on cropping pattern and scale of finance',
      'Simplified documentation',
      'Flexible repayment terms',
      'Interest subvention of 2%',
      'Prompt repayment incentive of 3%',
    ],
    category: 'loan',
    applicationLink: 'https://www.nabard.org/content1.aspx?id=523&catid=8',
    documents: [
      'Identity Proof (Aadhaar/Voter ID/PAN)',
      'Address Proof',
      'Land Records',
      'Passport size photographs',
    ],
    contactInfo: {
      website: 'https://www.nabard.org',
    },
    publishedDate: '2026-01-20',
    isActive: true,
    views: 3421,
  },
  {
    id: '3',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Crop insurance scheme providing financial support to farmers in case of crop loss due to natural calamities, pests, and diseases.',
    eligibility: [
      'All farmers growing notified crops',
      'Compulsory for loanee farmers',
      'Voluntary for non-loanee farmers',
    ],
    benefits: [
      'Low premium rates (2% for Kharif, 1.5% for Rabi)',
      'Coverage for pre-sowing to post-harvest losses',
      'Add-on coverage for localized risks',
      'Use of technology for quick settlement',
    ],
    category: 'insurance',
    state: 'All India',
    applicationDeadline: '2026-06-30',
    applicationLink: 'https://pmfby.gov.in',
    documents: [
      'Proposal Form',
      'Land Records',
      'Aadhaar Card',
      'Bank Account Details',
      'Sowing Certificate',
    ],
    contactInfo: {
      phone: '18001801551',
      email: 'pmfby-dac@gov.in',
      website: 'https://pmfby.gov.in',
    },
    publishedDate: '2026-02-01',
    isActive: true,
    views: 2987,
  },
  {
    id: '4',
    title: 'National Mission on Sustainable Agriculture (NMSA)',
    description: 'Promotes sustainable agriculture through climate change adaptation measures focusing on water use efficiency, soil health management, and resource conservation.',
    eligibility: [
      'All farmers',
      'Farmer groups and cooperatives',
      'Agricultural institutions',
    ],
    benefits: [
      'Training on sustainable practices',
      'Financial assistance for soil testing',
      'Support for water conservation',
      'Subsidy on agricultural equipment',
    ],
    category: 'training',
    applicationLink: 'https://nmsa.dac.gov.in',
    documents: [
      'Application Form',
      'Identity Proof',
      'Land Documents',
    ],
    contactInfo: {
      email: 'nmsa@gov.in',
      website: 'https://nmsa.dac.gov.in',
    },
    publishedDate: '2026-01-25',
    isActive: true,
    views: 1876,
  },
  {
    id: '5',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    description: 'Promotes farm mechanization to increase productivity through subsidies on purchase of agricultural equipment and machinery.',
    eligibility: [
      'All categories of farmers',
      'Custom Hiring Centers',
      'Farmer Producer Organizations',
    ],
    benefits: [
      'Subsidy on tractors and implements',
      '40-50% subsidy for SC/ST farmers',
      '40% subsidy for women farmers',
      'Financial assistance for setting up CHC',
    ],
    category: 'equipment',
    applicationDeadline: '2026-04-30',
    applicationLink: 'https://agrimachinery.nic.in',
    documents: [
      'Application Form',
      'Caste Certificate (if applicable)',
      'Land Records',
      'Bank Account Details',
      'Quotation of machinery',
    ],
    contactInfo: {
      phone: '1800-180-1551',
      website: 'https://agrimachinery.nic.in',
    },
    publishedDate: '2026-02-05',
    isActive: true,
    views: 2543,
  },
];

const mockStates = [
  'All India',
  'Andhra Pradesh',
  'Bihar',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];
