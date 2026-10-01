// Authentication service with local storage
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  uid: string;
  email?: string;
  phone?: string;
  name?: string;
  role?: 'farmer' | 'admin' | 'officer';
  location?: string;
  ecoCredits?: number;
}

// Mock Firebase Auth for now - replace with actual Firebase Auth in production
export class AuthService {
  private currentUser: any = null;

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if account is deleted
  private async isAccountDeleted(email: string): Promise<boolean> {
    try {
      const deletedAccounts = await AsyncStorage.getItem('deletedAccounts');
      if (deletedAccounts) {
        const deletedEmails = JSON.parse(deletedAccounts);
        return deletedEmails.includes(email.toLowerCase());
      }
      return false;
    } catch (error) {
      console.error('Error checking deleted account:', error);
      return false;
    }
  }

  // Add account to deleted accounts list
  private async addToDeletedAccounts(email: string): Promise<void> {
    try {
      const deletedAccounts = await AsyncStorage.getItem('deletedAccounts');
      let deletedEmails = deletedAccounts ? JSON.parse(deletedAccounts) : [];
      
      // Add email to deleted accounts list (case-insensitive)
      if (!deletedEmails.includes(email.toLowerCase())) {
        deletedEmails.push(email.toLowerCase());
        await AsyncStorage.setItem('deletedAccounts', JSON.stringify(deletedEmails));
      }
    } catch (error) {
      console.error('Error adding to deleted accounts:', error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      // Check if account has been deleted
      const isDeleted = await this.isAccountDeleted(email);
      if (isDeleted) {
        throw new Error('Account has been deleted');
      }

      // Mock authentication - replace with Firebase Auth
      if (email && password) {
        this.currentUser = {
          uid: 'mock-user-id-' + Date.now(),
          email: email,
        };
        
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string) {
    try {
      // Check if account has been deleted
      const isDeleted = await this.isAccountDeleted(email);
      if (isDeleted) {
        throw new Error('This email was previously used for a deleted account. Please use a different email.');
      }

      // Mock registration - replace with Firebase Auth
      if (email && password) {
        this.currentUser = {
          uid: 'mock-user-id-' + Date.now(),
          email: email,
        };
        
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      this.currentUser = null;
      // Clear user data but preserve deletedAccounts list
      await AsyncStorage.removeItem('user');
      
      // Also clear any other user-related data that might be stored
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => 
        (key.includes('user') || key.includes('auth')) && 
        key !== 'deletedAccounts'
      );
      if (userKeys.length > 0) {
        await AsyncStorage.multiRemove(userKeys);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Delete user account with password verification
  async deleteUser(password: string) {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      if (!password) {
        throw new Error('Password is required');
      }

      // Mock password verification - replace with Firebase Auth
      // In real implementation, you would re-authenticate the user first
      // await firebase.auth().currentUser?.reauthenticateWithCredential(
      //   firebase.auth.EmailAuthProvider.credential(this.currentUser.email, password)
      // );
      
      // Mock verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password check (in real app, Firebase would handle this)
      if (password.length < 6) {
        throw new Error('Invalid password');
      }

      // Add email to deleted accounts list before clearing data
      if (this.currentUser.email) {
        await this.addToDeletedAccounts(this.currentUser.email);
      }

      // Get all keys to clear except deletedAccounts
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter(key => key !== 'deletedAccounts');
      
      // Remove all user data except deletedAccounts list
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
      
      // Mock user deletion - replace with Firebase Auth
      // await firebase.auth().currentUser?.delete();
      
      this.currentUser = null;
      
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Get stored user data
  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
      return null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  // Debug method to check deleted accounts (for testing purposes)
  async getDeletedAccounts(): Promise<string[]> {
    try {
      const deletedAccounts = await AsyncStorage.getItem('deletedAccounts');
      return deletedAccounts ? JSON.parse(deletedAccounts) : [];
    } catch (error) {
      console.error('Error getting deleted accounts:', error);
      return [];
    }
  }
}

export const authService = new AuthService();