import { useState, useCallback, useEffect, useMemo } from 'react';
import { PracticeSession, LetterAttempt, PracticeStats } from '@/types/storage';
import { AsyncStorageProvider } from '@/services/storage';

// Simple ID generator
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const usePracticeData = () => {
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const storage = useMemo(() => new AsyncStorageProvider(), []);

  // Load stats on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const storedStats = await storage.getStats('alphabet');
        setStats(storedStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    
    loadStats();
  }, [storage]);

  const startSession = useCallback(async (): Promise<PracticeSession> => {
    const session: PracticeSession = {
      id: generateId(),
      moduleType: 'alphabet',
      startTime: new Date(),
      endTime: new Date(), // Will be updated when session ends
      totalAttempts: 0,
      correctAttempts: 0,
      letters: [],
    };
    
    setCurrentSession(session);
    return session;
  }, []);

  const recordAttempt = useCallback(async (attempt: LetterAttempt) => {
    if (!currentSession) {
      console.warn('No active session to record attempt');
      return;
    }
    
    const updatedSession: PracticeSession = {
      ...currentSession,
      letters: [...currentSession.letters, attempt],
      totalAttempts: currentSession.totalAttempts + 1,
      correctAttempts: currentSession.correctAttempts + (attempt.isCorrect ? 1 : 0),
      endTime: new Date(), // Update end time with each attempt
    };
    
    setCurrentSession(updatedSession);
  }, [currentSession]);

  const endSession = useCallback(async (): Promise<void> => {
    if (!currentSession) {
      console.warn('No active session to end');
      return;
    }
    
    try {
      // Final update to session with end time
      const finalSession: PracticeSession = {
        ...currentSession,
        endTime: new Date(),
      };
      
      // Save the session
      await storage.saveSession(finalSession);
      
      // Update stats
      const currentStats = stats || {
        moduleType: 'alphabet' as const,
        totalSessions: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
        lastPracticed: new Date(),
        letterPerformance: {}
      };
      
      // Calculate updated stats
      const updatedStats: PracticeStats = {
        ...currentStats,
        totalSessions: currentStats.totalSessions + 1,
        totalAttempts: currentStats.totalAttempts + finalSession.totalAttempts,
        correctAttempts: currentStats.correctAttempts + finalSession.correctAttempts,
        lastPracticed: finalSession.endTime,
        letterPerformance: { ...currentStats.letterPerformance }
      };
      
      // Update letter performance
      finalSession.letters.forEach(letter => {
        const letterKey = letter.letter;
        const existing = updatedStats.letterPerformance[letterKey] || {
          attempts: 0,
          correct: 0,
          accuracy: 0
        };
        
        const newAttempts = existing.attempts + 1;
        const newCorrect = existing.correct + (letter.isCorrect ? 1 : 0);
        
        updatedStats.letterPerformance[letterKey] = {
          attempts: newAttempts,
          correct: newCorrect,
          accuracy: newCorrect / newAttempts
        };
      });
      
      // Calculate overall accuracy
      updatedStats.accuracy = updatedStats.totalAttempts > 0 
        ? updatedStats.correctAttempts / updatedStats.totalAttempts 
        : 0;
      
      // Save updated stats
      await storage.updateStats('alphabet', updatedStats);
      setStats(updatedStats);
      
      // Clear current session
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to end session:', error);
      throw error;
    }
  }, [currentSession, stats, storage]);

  const getRecentSessions = useCallback(async (limit: number = 10) => {
    try {
      return await storage.getRecentSessions('alphabet', limit);
    } catch (error) {
      console.error('Failed to get recent sessions:', error);
      return [];
    }
  }, [storage]);

  const clearData = useCallback(async () => {
    try {
      await storage.clearData('alphabet');
      setStats({
        moduleType: 'alphabet',
        totalSessions: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
        lastPracticed: new Date(),
        letterPerformance: {}
      });
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }, [storage]);

  return {
    currentSession,
    stats,
    startSession,
    recordAttempt,
    endSession,
    getRecentSessions,
    clearData,
  };
};