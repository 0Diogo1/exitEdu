import * as React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface SubmitButtonProps {
  action: () => void;
  text:string;
}

const SubmitButton:React.FC<SubmitButtonProps> = ({action, text}) => (
  <Button mode="contained" onPress={action}>
    {text}
  </Button>
);



export default SubmitButton;