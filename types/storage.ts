interface BaseSession {
  id: string;
  moduleType: string;
  startTime: Date;
  endTime: Date;
}

// Alphabet specific types
interface PracticeSession extends BaseSession {
  moduleType: 'alphabet';
  totalAttempts: number;
  correctAttempts: number;
  letters: LetterAttempt[];
}

interface LetterAttempt {
  letter: string;
  phonetic: string;
  transcript: string;
  confidence: number;
  isCorrect: boolean;
  timestamp: Date;
}

interface PracticeStats {
  moduleType: 'alphabet';
  totalSessions: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  lastPracticed: Date;
  letterPerformance: Record<string, {
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  autoSkipDelay: number;
  minimumConfidence: number;
}

export type {
  BaseSession,
  PracticeSession,
  LetterAttempt,
  PracticeStats,
  UserPreferences,
};