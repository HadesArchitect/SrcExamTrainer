import { BaseSession, UserPreferences } from '@/types/storage';

interface StorageProvider {
  // Sessions
  saveSession<T extends BaseSession>(session: T): Promise<void>;
  getRecentSessions(moduleType: string, limit?: number): Promise<BaseSession[]>;
  
  // Stats
  updateStats(moduleType: string, stats: any): Promise<void>;
  getStats(moduleType: string): Promise<any>;
  
  // Preferences
  savePreferences(preferences: UserPreferences): Promise<void>;
  getPreferences(): Promise<UserPreferences>;
  
  // Data management
  clearData(moduleType?: string): Promise<void>;
}

export type { StorageProvider };