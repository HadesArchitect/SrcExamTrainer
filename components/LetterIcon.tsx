import { Text } from 'react-native';

export interface LetterIconProps {
  letter: string;
  color: string;
}

export function LetterIcon(props: LetterIconProps) {
  return (
    <Text 
      style={{ 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: props.color, 
        marginBottom: -3 
      }}
    >
      {props.letter}
    </Text>
  );
}
