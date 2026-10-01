// Global type definitions for AgroLoop

export type UserRole = 'farmer' | 'admin' | 'officer';

export type WasteType = 'stubble' | 'leaves' | 'stalks' | 'husks' | 'other';

export type TransactionType = 'earned' | 'redeemed';

export type SyncStatus = 'pending' | 'synced' | 'failed';

export type RewardCategory = 'fertilizer' | 'seeds' | 'tools' | 'services';

export interface User {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  location?: string;
  ecoCredits: number;
  createdAt: Date;
  lastActive: Date;
}

export interface WasteLog {
  id: string;
  userId: string;
  type: WasteType;
  quantity: number;
  location: string;
  imageUrl?: string;
  classificationResult?: {
    confidence: number;
    detectedType: string;
    additionalInfo?: any;
  };
  ecoCredits: number;
  timestamp: Date;
  syncStatus: SyncStatus;
  notes?: string;
}

export interface EcoTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  relatedLogId?: string;
  timestamp: Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: RewardCategory;
  creditsRequired: number;
  discountPercentage: number;
  available: boolean;
  termsAndConditions?: string;
}

export interface ClassificationResult {
  type: WasteType;
  confidence: number;
  additionalInfo?: {
    estimatedQuantity?: number;
    condition?: 'fresh' | 'dry' | 'decomposed';
  };
}

export interface OfflineData {
  id: string;
  data: any;
  timestamp: Date;
  syncStatus: SyncStatus;
  retryCount?: number;
}