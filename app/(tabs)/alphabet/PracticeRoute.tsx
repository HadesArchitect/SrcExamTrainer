import { Text, View } from '@/components/Themed';
import { styles } from './styles';

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

export default PracticeRoute;