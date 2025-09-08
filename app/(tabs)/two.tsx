import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

import { Text, View } from '@/components/Themed';

const phoneticAlphabet = [
  { letter: 'A', phonetic: 'Alpha' },
  { letter: 'B', phonetic: 'Bravo' },
  { letter: 'C', phonetic: 'Charlie' },
  { letter: 'D', phonetic: 'Delta' },
  { letter: 'E', phonetic: 'Echo' },
  { letter: 'F', phonetic: 'Foxtrot' },
  { letter: 'G', phonetic: 'Golf' },
  { letter: 'H', phonetic: 'Hotel' },
  { letter: 'I', phonetic: 'India' },
  { letter: 'J', phonetic: 'Juliet' },
  { letter: 'K', phonetic: 'Kilo' },
  { letter: 'L', phonetic: 'Lima' },
  { letter: 'M', phonetic: 'Mike' },
  { letter: 'N', phonetic: 'November' },
  { letter: 'O', phonetic: 'Oscar' },
  { letter: 'P', phonetic: 'Papa' },
  { letter: 'Q', phonetic: 'Quebec' },
  { letter: 'R', phonetic: 'Romeo' },
  { letter: 'S', phonetic: 'Sierra' },
  { letter: 'T', phonetic: 'Tango' },
  { letter: 'U', phonetic: 'Uniform' },
  { letter: 'V', phonetic: 'Victor' },
  { letter: 'W', phonetic: 'Whiskey' },
  { letter: 'X', phonetic: 'X-ray' },
  { letter: 'Y', phonetic: 'Yankee' },
  { letter: 'Z', phonetic: 'Zulu' },
];

export default function TabTwoScreen() {
  const playPronunciation = (phonetic: string) => {
    Speech.speak(phonetic, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phonetic Alphabet</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
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
