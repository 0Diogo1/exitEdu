import * as React from 'react';
import { useState } from 'react';
import { TextInput, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface PasswordInputProps {
  userPass: string;
  setUserPass: (userPass: string) => void;
  label: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ userPass, setUserPass, label }) => {
  const [password, setPassword] = useState(''); // Estado para armazenar a senha
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  return (
    <TextInput
      label={label}
      value={userPass}
      style={styles.inputSpacing}
      onChangeText={setUserPass}
      secureTextEntry={!showPassword} // Oculta ou mostra a senha
      right={
        <TextInput.Icon
          icon={showPassword ? 'eye-off' : 'eye'} // Ícone de olho (aberto/fechado)
          onPress={() => setShowPassword(!showPassword)} // Alterna a visibilidade da senha
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  inputSpacing: {
    marginBottom: 16, // Adiciona uma margem de 16 unidades abaixo de cada componente
  },
});

export default PasswordInput;