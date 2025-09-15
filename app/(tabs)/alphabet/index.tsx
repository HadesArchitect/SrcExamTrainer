import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useState } from 'react';

import AlphabetRoute from './AlphabetRoute';
import PracticeRoute from './PracticeRoute';

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