import { ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

import { Text, View } from '@/components/Themed';
import { phoneticAlphabet } from '@/constants/PhoneticAlphabet';
import { styles } from './styles';

const AlphabetRoute = () => {
  const playPronunciation = (phonetic: string) => {
      Speech.speak(phonetic, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {phoneticAlphabet.map((item) => (
          <View key={item.letter} style={styles.alphabetItem}>
            <Text style={styles.letter}>{item.letter}</Text>
            <Text style={styles.phonetic}>{item.phonetic}</Text>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => playPronunciation(item.phonetic)}
            >
              <Text style={styles.playButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AlphabetRoute;