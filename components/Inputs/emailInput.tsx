import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as React from 'react';
import { DefaultTheme, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface EmailInputProps {
  userEmail:string;
  setEmail:(email:string) => void;
  label:string;
}

const EmailInput:React.FC<EmailInputProps> = ({userEmail, setEmail, label}) => {
  const [text, setText] = React.useState("");

  return (
    <TextInput
      style={styles.inputSpacing}
      label={label}
      value={userEmail}
      autoComplete='email'
      onChangeText={setEmail}
    />
  );
};

const styles = StyleSheet.create({
  inputSpacing: {
    marginBottom: 16, // Adiciona uma margem de 16 unidades abaixo de cada componente
  },
});

export default EmailInput;