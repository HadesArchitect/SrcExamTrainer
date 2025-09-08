import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

import { Text, View } from '@/components/Themed';
import { phoneticAlphabet } from '@/constants/PhoneticAlphabet';

export default function AlphabetScreen() {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  alphabetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 2,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  phonetic: {
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
  },
  playButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});