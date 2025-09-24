import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageProvider } from './StorageInterface';
import { BaseSession, UserPreferences, PracticeStats } from '@/types/storage';

export class AsyncStorageProvider implements StorageProvider {
  private async getKey(type: string, moduleType?: string): Promise<string> {
    return moduleType ? `${moduleType}_${type}` : type;
  }

  async saveSession<T extends BaseSession>(session: T): Promise<void> {
    try {
      const key = await this.getKey('sessions', session.moduleType);
      const existing = await AsyncStorage.getItem(key);
      const sessions = existing ? JSON.parse(existing) : [];
      
      sessions.push(session);
      // Keep only last 50 sessions per module
      if (sessions.length > 50) {
        sessions.splice(0, sessions.length - 50);
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  async getRecentSessions(moduleType: string, limit: number = 10): Promise<BaseSession[]> {
    try {
      const key = await this.getKey('sessions', moduleType);
      const existing = await AsyncStorage.getItem(key);
      
      if (!existing) {
        return [];
      }
      
      const sessions = JSON.parse(existing);
      // Parse dates back from strings
      const parsedSessions = sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        letters: session.letters?.map((letter: any) => ({
          ...letter,
          timestamp: new Date(letter.timestamp)
        })) || []
      }));
      
      // Return most recent sessions first
      return parsedSessions
        .sort((a: BaseSession, b: BaseSession) => b.endTime.getTime() - a.endTime.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get recent sessions:', error);
      return [];
    }
  }

  async updateStats(moduleType: string, stats: any): Promise<void> {
    try {
      const key = await this.getKey('stats', moduleType);
      await AsyncStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update stats:', error);
      throw error;
    }
  }

  async getStats(moduleType: string): Promise<any> {
    try {
      const key = await this.getKey('stats', moduleType);
      const existing = await AsyncStorage.getItem(key);
      
      if (!existing) {
        // Return default stats for alphabet module
        if (moduleType === 'alphabet') {
          const defaultStats: PracticeStats = {
            moduleType: 'alphabet',
            totalSessions: 0,
            totalAttempts: 0,
            correctAttempts: 0,
            accuracy: 0,
            lastPracticed: new Date(),
            letterPerformance: {}
          };
          return defaultStats;
        }
        return null;
      }
      
      const stats = JSON.parse(existing);
      // Parse date back from string
      if (stats.lastPracticed) {
        stats.lastPracticed = new Date(stats.lastPracticed);
      }
      
      return stats;
    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      const key = await this.getKey('preferences');
      await AsyncStorage.setItem(key, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw error;
    }
  }

  async getPreferences(): Promise<UserPreferences> {
    try {
      const key = await this.getKey('preferences');
      const existing = await AsyncStorage.getItem(key);
      
      if (!existing) {
        // Return default preferences
        const defaultPreferences: UserPreferences = {
          theme: 'auto',
          autoSkipDelay: 3000,
          minimumConfidence: 0.5
        };
        return defaultPreferences;
      }
      
      return JSON.parse(existing);
    } catch (error) {
      console.error('Failed to get preferences:', error);
      // Return defaults on error
      return {
        theme: 'auto',
        autoSkipDelay: 3000,
        minimumConfidence: 0.5
      };
    }
  }

  async clearData(moduleType?: string): Promise<void> {
    try {
      if (moduleType) {
        // Clear data for specific module
        const sessionsKey = await this.getKey('sessions', moduleType);
        const statsKey = await this.getKey('stats', moduleType);
        
        await AsyncStorage.removeItem(sessionsKey);
        await AsyncStorage.removeItem(statsKey);
      } else {
        // Clear all data
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
      }
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}