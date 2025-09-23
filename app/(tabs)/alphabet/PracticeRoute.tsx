import { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

import { Text, View } from '@/components/Themed';
import { phoneticAlphabet } from '@/constants/PhoneticAlphabet';
import { styles } from './styles';

const PracticeRoute = () => {
  const [currentChallenge, setCurrentChallenge] = useState(phoneticAlphabet[0]);
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isRecognitionAvailable, setIsRecognitionAvailable] = useState(true);

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      // Check if speech recognition is available
      const available = ExpoSpeechRecognitionModule.isRecognitionAvailable();
      setIsRecognitionAvailable(available);
      
      if (!available) {
        Alert.alert(
          'Speech Recognition Unavailable',
          'Speech recognition is not available on this device. Please ensure you have the necessary system components installed.'
        );
        return;
      }

      try {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
          Alert.alert(
            'Permission Required', 
            'Speech recognition permission is needed for practice mode. Please grant permissions in Settings.'
          );
        }
      } catch (error) {
        console.error('Failed to request permissions:', error);
        Alert.alert('Error', 'Failed to request speech recognition permissions.');
      }
    };
    
    initializeSpeechRecognition();
    generateNewChallenge();
  }, []);

  // Handle speech recognition events
  useSpeechRecognitionEvent('start', () => {
    setRecognizing(true);
    setFeedback('🎤 Listening...');
  });

  useSpeechRecognitionEvent('end', () => {
    setRecognizing(false);
    setIsListening(false);
    setVolumeLevel(0);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results?.[0]?.transcript?.toLowerCase() || '';
    const confidence = event.results?.[0]?.confidence || 0;
    console.log(`Speech result: "${transcript}" (confidence: ${confidence})`);
    checkAnswer(transcript, confidence);
  });

  useSpeechRecognitionEvent('error', (event) => {
    setRecognizing(false);
    setIsListening(false);
    setVolumeLevel(0);
    
    let errorMessage = 'Unknown error occurred';
    switch (event.error) {
      case 'not-allowed':
        errorMessage = 'Microphone access denied. Please check permissions.';
        break;
      case 'no-speech':
        errorMessage = 'No speech detected. Try speaking louder.';
        break;
      case 'audio-capture':
        errorMessage = 'Audio capture failed. Check microphone.';
        break;
      case 'network':
        errorMessage = 'Network error. Check internet connection.';
        break;
      case 'language-not-supported':
        errorMessage = 'Language not supported.';
        break;
      default:
        errorMessage = `Speech recognition error: ${event.error}`;
    }
    
    setFeedback(`❌ ${errorMessage}`);
    console.error('Speech recognition error:', event.error, event.message);
  });

  // Volume metering for visual feedback
  useSpeechRecognitionEvent('volumechange', (event) => {
    setVolumeLevel(Math.max(0, Math.min(10, event.value + 2))); // Normalize to 0-10 range
  });

  const generateNewChallenge = () => {
    const randomIndex = Math.floor(Math.random() * phoneticAlphabet.length);
    setCurrentChallenge(phoneticAlphabet[randomIndex]);
    setFeedback('');
    setVolumeLevel(0);
  };

  const startListening = async () => {
    if (!isRecognitionAvailable) {
      Alert.alert('Error', 'Speech recognition is not available on this device.');
      return;
    }

    try {
      setIsListening(true);
      setFeedback('');
      setVolumeLevel(0);
      
      // Create contextual strings from phonetic alphabet for better recognition
      const contextualStrings = phoneticAlphabet.map(item => item.phonetic);
      
      await ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: false,
        maxAlternatives: 3, // Get multiple alternatives for better matching
        continuous: false,
        // Add contextual strings to improve recognition of phonetic alphabet terms
        contextualStrings: contextualStrings,
        // Enable volume metering for visual feedback
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: 100, // Update volume every 100ms
        },
        // iOS-specific improvements for single word recognition
        iosTaskHint: 'confirmation',
        // Android-specific improvements for single word recognition
        androidIntentOptions: {
          EXTRA_LANGUAGE_MODEL: 'web_search', // Better for single words
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 3000,
        },
      });
    } catch (error) {
      setIsListening(false);
      setFeedback('❌ Failed to start speech recognition');
      console.error('Failed to start speech recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
      setVolumeLevel(0);
    } catch (error) {
      setFeedback('Failed to stop speech recognition');
      console.error('Failed to stop speech recognition:', error);
    }
  };

  const checkAnswer = (transcript: string, confidence: number = 0) => {
    const expectedAnswer = currentChallenge.phonetic.toLowerCase();
    const transcriptTrimmed = transcript.trim();
    
    // More flexible matching
    const isExactMatch = transcriptTrimmed === expectedAnswer;
    const isContainsMatch = transcript.includes(expectedAnswer) || expectedAnswer.includes(transcriptTrimmed);
    const isCloseMatch = calculateSimilarity(transcriptTrimmed, expectedAnswer) > 0.7;
    
    setTotalAttempts(prev => prev + 1);
    
    if (isExactMatch) {
      setScore(prev => prev + 1);
      setFeedback(`✅ Perfect! You said "${transcript}" (${Math.round(confidence * 100)}% confidence)`);
    } else if (isContainsMatch || isCloseMatch) {
      setScore(prev => prev + 1);
      setFeedback(`✅ Good! You said "${transcript}" - close enough to "${currentChallenge.phonetic}"`);
    } else {
      setFeedback(`❌ Not quite. You said "${transcript}", expected "${currentChallenge.phonetic}"`);
    }
    
    // Auto-generate new challenge after 3 seconds (increased for better UX)
    setTimeout(() => {
      generateNewChallenge();
    }, 3000);
  };

  // Simple string similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Calculate Levenshtein distance for string similarity
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const resetScore = () => {
    setScore(0);
    setTotalAttempts(0);
    setVolumeLevel(0);
    generateNewChallenge();
  };

  // Volume indicator component
  const VolumeIndicator = () => (
    <View style={styles.volumeContainer}>
      <Text style={styles.volumeLabel}>Volume:</Text>
      <View style={styles.volumeBar}>
        <View 
          style={[
            styles.volumeLevel, 
            { width: `${Math.max(0, Math.min(100, volumeLevel * 10))}%` }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.practiceContent}>
        <Text style={styles.title}>Speech Practice</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Score: {score}/{totalAttempts}
            {totalAttempts > 0 && ` (${Math.round((score/totalAttempts) * 100)}%)`}
          </Text>
        </View>

        <View style={styles.challengeContainer}>
          <Text style={styles.challengeLabel}>Say the phonetic word for:</Text>
          <Text style={styles.challengeLetter}>{currentChallenge.letter}</Text>
          <Text style={styles.challengeHint}>({currentChallenge.phonetic})</Text>
        </View>

        {/* Volume indicator - only show when listening */}
        {isListening && <VolumeIndicator />}

        <TouchableOpacity
          style={[
            styles.listenButton,
            isListening && styles.listenButtonActive,
            recognizing && styles.listenButtonRecognizing,
            !isRecognitionAvailable && styles.listenButtonDisabled
          ]}
          onPress={isListening ? stopListening : startListening}
          disabled={recognizing || !isRecognitionAvailable}
        >
          <Text style={styles.listenButtonText}>
            {recognizing ? '🎤 Listening...' : 
             isListening ? '⏹ Stop' : 
             !isRecognitionAvailable ? '❌ Not Available' :
             '🎤 Start Speaking'}
          </Text>
        </TouchableOpacity>

        {feedback ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={generateNewChallenge}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetScore}>
            <Text style={styles.resetButtonText}>Reset Score</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PracticeRoute;