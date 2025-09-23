import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useState } from 'react';

import AlphabetRoute from './AlphabetRoute';
import PracticeRoute from './PracticeRoute';

const renderScene = SceneMap({
  alphabet: AlphabetRoute,
  practice: PracticeRoute,
});

const routes = [
  { key: 'alphabet', title: 'Alphabet' },
  { key: 'practice', title: 'Practice' },
];

export default function AlphabetScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}