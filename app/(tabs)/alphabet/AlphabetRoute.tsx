import { ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

import { Text, View } from '@/components/Themed';
import { phoneticAlphabet } from '@/constants/PhoneticAlphabet';
import { styles } from './styles';

const AlphabetRoute = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {phoneticAlphabet.map((item) => (
          <View key={item.letter} style={styles.alphabetItem}>
            <Text style={styles.letter}>{item.letter}</Text>
            <Text style={styles.phonetic}>{item.phonetic}</Text>
            <TouchableOpacity 
              style={styles.playButton}
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