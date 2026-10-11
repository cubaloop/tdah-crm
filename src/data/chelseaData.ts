import type { ProjectUnit } from '../types/crm';

export interface DeveloperProject {
  developer: string;
  projectName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  completionDate: string;
  dldFeePercentage: number;
  dldIncluded: boolean;
  salesWhatsApp: string;
  typologySummary: {
    typology: '1-BR' | '2-BR' | '3-BR';
    minPriceAED: number;
    maxPriceAED: number;
    minSqft: number;
    maxSqft: number;
    avgPsf: number;
    startingText: string;
  }[];
  units: ProjectUnit[];
  locationHighlights: { label: string; time: string; icon: string }[];
  capitalAppreciationHistory: { year: string; psfPrimary: number; psfSecondary: number }[];
  competitorsPSF: { name: string; psf: number; launch: string }[];
  paymentScheduleTemplate: { event: string; monthOffset: number; percentage: number }[];
}

export const CHELSEA_RESIDENCES_DATA: DeveloperProject = {
  developer: 'DAMAC',
  projectName: 'Chelsea Residences',
  location: 'Dubai Maritime City (Madinat Dubai Al Melaheyah)',
  coordinates: { lat: 25.2642, lng: 55.2678 }, // Dubai Maritime City site
  description: 'First football-branded luxury residences by DAMAC in partnership with Chelsea FC, featuring oceanfront luxury living, infinity pools, serene spas, and high capital growth in Dubai Maritime City.',
  completionDate: '30 June 2030',
  dldFeePercentage: 4,
  dldIncluded: false,
  salesWhatsApp: '+971508379080',
  typologySummary: [
    {
      typology: '1-BR',
      minPriceAED: 2548000,
      maxPriceAED: 3254000,
      minSqft: 771,
      maxSqft: 1009,
      avgPsf: 3317,
      startingText: 'AED 2.56 Mn'
    },
    {
      typology: '2-BR',
      minPriceAED: 3683000,
      maxPriceAED: 3683000,
      minSqft: 1158,
      maxSqft: 1158,
      avgPsf: 3180,
      startingText: 'AED 3.68 Mn'
    },
    {
      typology: '3-BR',
      minPriceAED: 7604000,
      maxPriceAED: 7604000,
      minSqft: 2855,
      maxSqft: 2855,
      avgPsf: 2663,
      startingText: 'AED 7.60 Mn'
    }
  ],
  units: [
    { unitNo: 'CHLC/1/101', typology: '1-BR', sqft: 928, priceAED: 2989000, psf: 3220, floor: 1, available: true },
    { unitNo: 'CHLC/1/102', typology: '1-BR', sqft: 1009, priceAED: 3174000, psf: 3145, floor: 1, available: true },
    { unitNo: 'CHLC/1/103', typology: '1-BR', sqft: 772, priceAED: 2551000, psf: 3304, floor: 1, available: true },
    { unitNo: 'CHLC/1/104', typology: '1-BR', sqft: 777, priceAED: 2565000, psf: 3301, floor: 1, available: true },
    { unitNo: 'CHLC/1/105', typology: '1-BR', sqft: 775, priceAED: 2560000, psf: 3303, floor: 1, available: true },
    { unitNo: 'CHLC/1/106', typology: '2-BR', sqft: 1158, priceAED: 3683000, psf: 3180, floor: 1, available: true },
    
    { unitNo: 'CHLC/2/201', typology: '1-BR', sqft: 921, priceAED: 2963000, psf: 3217, floor: 2, available: true },
    { unitNo: 'CHLC/2/202', typology: '1-BR', sqft: 1002, priceAED: 3150000, psf: 3143, floor: 2, available: true },
    { unitNo: 'CHLC/2/203', typology: '1-BR', sqft: 771, priceAED: 2548000, psf: 3304, floor: 2, available: true },
    { unitNo: 'CHLC/2/204', typology: '1-BR', sqft: 776, priceAED: 2566000, psf: 3306, floor: 2, available: true },

    { unitNo: 'CHLC/5/502', typology: '1-BR', sqft: 1002, priceAED: 3161000, psf: 3154, floor: 5, available: true },
    { unitNo: 'CHLC/8/802', typology: '1-BR', sqft: 1009, priceAED: 3197000, psf: 3168, floor: 8, available: true },
    { unitNo: 'CHLC/10/1002', typology: '1-BR', sqft: 1009, priceAED: 3213000, psf: 3184, floor: 10, available: true },
    
    { unitNo: 'CHLC/22/2201', typology: '3-BR', sqft: 2855, priceAED: 7604000, psf: 2663, floor: 22, available: true },
    { unitNo: 'CHLC/22/2202', typology: '1-BR', sqft: 776, priceAED: 2634000, psf: 3394, floor: 22, available: true },
    { unitNo: 'CHLC/27/2702', typology: '1-BR', sqft: 1003, priceAED: 3254000, psf: 3244, floor: 27, available: true }
  ],
  locationHighlights: [
    { label: 'J1 Beach', time: '14 mins', icon: 'Umbrella' },
    { label: 'Estación de Metro', time: '18 mins', icon: 'Train' },
    { label: 'Aeropuerto Int. Dubai (DXB)', time: '20 mins', icon: 'Plane' },
    { label: 'City Walk', time: '15 mins', icon: 'Building' }
  ],
  capitalAppreciationHistory: [
    { year: '2023', psfPrimary: 2047, psfSecondary: 1637 },
    { year: '2024', psfPrimary: 2439, psfSecondary: 2165 },
    { year: '2025', psfPrimary: 3004, psfSecondary: 2378 },
    { year: 'H1 2026', psfPrimary: 3123, psfSecondary: 2474 }
  ],
  competitorsPSF: [
    { name: 'IL Vento', psf: 3028, launch: 'Q4 2025' },
    { name: 'Chelsea Residences 2', psf: 3203, launch: 'Q3 2025' },
    { name: 'Chelsea Residence Tower C', psf: 3317, launch: 'Q3 2026' },
    { name: 'Breez', psf: 3463, launch: 'Q3 2025' },
    { name: 'Soulever', psf: 3633, launch: 'Q3 2025' }
  ],
  paymentScheduleTemplate: [
    { event: 'Depósito Inmediato (Inscripción)', monthOffset: 0, percentage: 5 },
    { event: 'Al mes 1 de reserva', monthOffset: 1, percentage: 10 },
    { event: 'Al mes 3 de reserva', monthOffset: 3, percentage: 5 },
    { event: 'Meses 4 al 5 (0.25% mensual)', monthOffset: 5, percentage: 0.5 },
    { event: 'Al mes 6 de reserva', monthOffset: 6, percentage: 6 },
    { event: 'Meses 7 al 11 (0.25% mensual)', monthOffset: 11, percentage: 1.25 },
    { event: 'Al mes 12 de reserva', monthOffset: 12, percentage: 6 },
    { event: 'Meses 13 al 17 (0.25% mensual)', monthOffset: 17, percentage: 1.25 },
    { event: 'Al mes 18 de reserva', monthOffset: 18, percentage: 5 },
    { event: 'Meses 19 al 23 (0.25% mensual)', monthOffset: 23, percentage: 1.25 },
    { event: 'Al mes 24 de reserva', monthOffset: 24, percentage: 5 },
    { event: 'Meses 25 al 29 (0.25% mensual)', monthOffset: 29, percentage: 1.25 },
    { event: 'Al mes 30 de reserva', monthOffset: 30, percentage: 5 },
    { event: 'Meses 31 al 35 (0.25% mensual)', monthOffset: 35, percentage: 1.25 },
    { event: 'Al mes 36 de reserva', monthOffset: 36, percentage: 5 },
    { event: 'Meses 37 al 41 (0.25% mensual)', monthOffset: 41, percentage: 1.25 },
    { event: 'A la entrega de llaves (30 Junio 2030)', monthOffset: 48, percentage: 40 }
  ]
};
