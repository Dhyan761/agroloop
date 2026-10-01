import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VerificationCode {
  id: string;
  code: string;
  wasteType: string;
  quantity: number;
  location: string;
  farmerId: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface VerificationRequest {
  wasteType: string;
  quantity: number;
  location: string;
  farmerId: string;
}

export interface VerificationStats {
  total: number;
  used: number;
  active: number;
  expired: number;
}

class VerificationService {
  private readonly STORAGE_KEY = 'verification_codes';

  // Create a verification code for waste logging
  async createVerificationCode(request: VerificationRequest): Promise<VerificationCode> {
    // For simulation, generate a code between 1-100
    const code = Math.floor(Math.random() * 100) + 1;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const verificationCode: VerificationCode = {
      id: Date.now().toString(),
      code: code.toString(),
      wasteType: request.wasteType,
      quantity: request.quantity,
      location: request.location,
      farmerId: request.farmerId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isUsed: false,
    };

    await this.saveVerificationCode(verificationCode);
    return verificationCode;
  }

  // Verify a code and mark it as used
  async verifyCode(code: string, farmerId: string): Promise<VerificationCode | null> {
    try {
      // For simulation purposes, accept codes 1-100 as valid
      const codeNumber = parseInt(code);
      if (codeNumber >= 1 && codeNumber <= 100) {
        // First check if this simulation code was already used
        const codes = await this.getVerificationCodes();
        const existingCode = codes.find(
          vc => vc.code === code.toUpperCase() &&
                vc.farmerId === farmerId
        );

        if (existingCode) {
          // Code already exists - check if it was used
          if (existingCode.isUsed) {
            return null; // Code already used
          }
          
          // Mark existing code as used
          existingCode.isUsed = true;
          existingCode.usedAt = new Date().toISOString();
          await this.saveVerificationCode(existingCode);
          return existingCode;
        }

        // Create a new mock verification code for simulation
        const mockVerificationCode: VerificationCode = {
          id: Date.now().toString(),
          code: code.toUpperCase(),
          wasteType: 'Simulated Waste',
          quantity: 10,
          location: 'Simulated Location',
          farmerId: farmerId,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isUsed: true,
          usedAt: new Date().toISOString(),
        };

        // Save the mock verification code
        await this.saveVerificationCode(mockVerificationCode);

        return mockVerificationCode;
      }

      // For real codes, check against stored codes
      const codes = await this.getVerificationCodes();
      const verificationCode = codes.find(
        vc => vc.code === code.toUpperCase() &&
              vc.farmerId === farmerId &&
              !vc.isUsed &&
              new Date(vc.expiresAt) > new Date()
      );

      if (verificationCode) {
        verificationCode.isUsed = true;
        verificationCode.usedAt = new Date().toISOString();
        await this.saveVerificationCode(verificationCode);
        return verificationCode;
      }

      return null;
    } catch (error) {
      console.error('Error verifying code:', error);
      return null;
    }
  }

  // Get all verification codes
  async getVerificationCodes(): Promise<VerificationCode[]> {
    try {
      const codesJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return codesJson ? JSON.parse(codesJson) : [];
    } catch (error) {
      console.error('Error getting verification codes:', error);
      return [];
    }
  }

  // Get verification codes for a specific farmer
  async getFarmerVerificationCodes(farmerId: string): Promise<VerificationCode[]> {
    const codes = await this.getVerificationCodes();
    return codes.filter(code => code.farmerId === farmerId);
  }

  // Get verification statistics
  async getVerificationStats(farmerId: string): Promise<VerificationStats> {
    const codes = await this.getFarmerVerificationCodes(farmerId);
    const now = new Date();

    const stats: VerificationStats = {
      total: codes.length,
      used: codes.filter(code => code.isUsed).length,
      active: codes.filter(code => !code.isUsed && new Date(code.expiresAt) > now).length,
      expired: codes.filter(code => !code.isUsed && new Date(code.expiresAt) <= now).length,
    };

    return stats;
  }

  // Cleanup expired codes
  async cleanupExpiredCodes(): Promise<void> {
    try {
      const codes = await this.getVerificationCodes();
      const now = new Date();
      const validCodes = codes.filter(code => 
        code.isUsed || new Date(code.expiresAt) > now
      );

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(validCodes));
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
    }
  }

  // Validate verification request
  validateVerificationRequest(request: VerificationRequest): { isValid: boolean; error?: string } {
    if (!request.farmerId || !request.wasteType || !request.quantity || !request.location) {
      return { isValid: false, error: 'All fields are required' };
    }

    if (request.quantity <= 0) {
      return { isValid: false, error: 'Quantity must be greater than 0' };
    }

    return { isValid: true };
  }

  // Save a verification code
  private async saveVerificationCode(verificationCode: VerificationCode): Promise<void> {
    try {
      const codes = await this.getVerificationCodes();
      const existingIndex = codes.findIndex(code => code.id === verificationCode.id);
      
      if (existingIndex >= 0) {
        codes[existingIndex] = verificationCode;
      } else {
        codes.push(verificationCode);
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(codes));
    } catch (error) {
      console.error('Error saving verification code:', error);
    }
  }
}

export const verificationService = new VerificationService(); 