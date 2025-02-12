import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as React from 'react';
import { DefaultTheme, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface GeneralInputProps {
  input:string;
  setInput:(email:string) => void;
  label:string;
}

const GeneralInput:React.FC<GeneralInputProps> = ({input, setInput, label}) => {


  return (
    <TextInput
      style={styles.inputSpacing}
      label={label}
      value={input}
      autoCapitalize='none'
      onChangeText={setInput}
    />
  );
};

const styles = StyleSheet.create({
  inputSpacing: {
    marginBottom: 16, 
  },
  
});

export default GeneralInput;