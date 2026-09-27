export type BureauName = 'CRIF High Mark' | 'Experian' | 'Equifax' | 'CIBIL';

export interface Bureau {
  id: string;
  name: BureauName;
  isActive: boolean;
  isAvailable: boolean;
}

export interface CreditScoreReport {
  score: number;
  minScore: number;
  maxScore: number;
  rating: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  isVerified: boolean;
  lastUpdatedAt: string;
  nextRefreshAt: string;
  primaryBureau: BureauName;
  bureaus: Bureau[];
}

export interface FreeReportOffer {
  isEligible: boolean;
  price: number;
  currency: string;
  validAfterDays: number;
  daysRemaining: number;
  bureauName: BureauName;
}

export interface CreditScoreApiResponse {
  success: boolean;
  data: {
    creditScore: CreditScoreReport;
    freeReportOffer: FreeReportOffer;
  };
}

export const mockCreditScoreResponse: CreditScoreApiResponse = {
  success: true,
  data: {
    creditScore: {
      score: 782,
      minScore: 300,
      maxScore: 900,
      rating: 'Excellent',
      isVerified: true,
      lastUpdatedAt: '2026-07-12T00:00:00Z',
      nextRefreshAt: '2026-08-11T00:00:00Z',
      primaryBureau: 'CRIF High Mark',
      bureaus: [
        {
          id: 'crif',
          name: 'CRIF High Mark',
          isActive: true,
          isAvailable: true,
        },
        {
          id: 'experian',
          name: 'Experian',
          isActive: false,
          isAvailable: true,
        },
        { id: 'equifax', name: 'Equifax', isActive: false, isAvailable: true },
        { id: 'cibil', name: 'CIBIL', isActive: false, isAvailable: false },
      ],
    },
    freeReportOffer: {
      isEligible: true,
      price: 49,
      currency: 'INR',
      validAfterDays: 30,
      daysRemaining: 24,
      bureauName: 'CRIF High Mark',
    },
  },
};
