import { phoneticAlphabet } from '@/constants/PhoneticAlphabet';

describe('Phonetic Alphabet Trainer - App Structure Tests', () => {
  describe('PhoneticAlphabet Data Integrity', () => {
    it('should contain exactly 26 letters', () => {
      expect(phoneticAlphabet).toHaveLength(26);
    });

    it('should have proper structure for each entry', () => {
      phoneticAlphabet.forEach((item) => {
        expect(item).toHaveProperty('letter');
        expect(item).toHaveProperty('phonetic');
        expect(typeof item.letter).toBe('string');
        expect(typeof item.phonetic).toBe('string');
        expect(item.letter).toHaveLength(1);
        expect(item.letter).toMatch(/[A-Z]/);
      });
    });

    it('should contain all letters A-Z in correct order', () => {
      const letters = phoneticAlphabet.map(item => item.letter);
      const expectedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      expect(letters).toEqual(expectedLetters);
    });

    it('should contain correct NATO phonetic alphabet words', () => {
      const testCases = [
        { letter: 'A', expected: 'Alpha' },
        { letter: 'B', expected: 'Bravo' },
        { letter: 'C', expected: 'Charlie' },
        { letter: 'D', expected: 'Delta' },
        { letter: 'E', expected: 'Echo' },
        { letter: 'Z', expected: 'Zulu' }
      ];

      testCases.forEach(({ letter, expected }) => {
        const entry = phoneticAlphabet.find(item => item.letter === letter);
        expect(entry).toBeTruthy();
        expect(entry.phonetic).toBe(expected);
      });
    });

    it('should not have empty phonetic values', () => {
      phoneticAlphabet.forEach((item) => {
        expect(item.phonetic.trim()).not.toBe('');
        expect(item.phonetic.length).toBeGreaterThan(2);
      });
    });
  });

  describe('Application Configuration', () => {
    it('should have a working alphabet data export', () => {
      expect(phoneticAlphabet).toBeDefined();
      expect(Array.isArray(phoneticAlphabet)).toBe(true);
    });
  });
});