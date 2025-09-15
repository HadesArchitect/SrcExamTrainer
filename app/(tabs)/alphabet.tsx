import { StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useState } from 'react';
import * as Speech from 'expo-speech';

import { Text, View } from '@/components/Themed';
import { phoneticAlphabet } from '@/constants/PhoneticAlphabet';

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

const PracticeRoute = () => (
  <View style={styles.container}>
    <View style={styles.practiceContent}>
      <Text style={styles.title}>Practice Mode</Text>
      <Text style={styles.practiceText}>Coming soon - practice exercises will be available here!</Text>
      <Text style={styles.practiceDescription}>
        This section will include interactive exercises to help you memorize the phonetic alphabet.
      </Text>
    </View>
  </View>
);

const renderScene = SceneMap({
  alphabet: AlphabetRoute,
  practice: PracticeRoute,
});

export default function AlphabetScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'alphabet', title: 'Alphabet' },
    { key: 'practice', title: 'Practice' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
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
  practiceContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  practiceText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  practiceDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});