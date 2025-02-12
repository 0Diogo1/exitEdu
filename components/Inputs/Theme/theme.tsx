import { DefaultTheme } from "react-native-paper";

export const greenTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'purple', // Cor primária (usada para o sublinhado e o ícone)
      accent: 'purple',  // Cor de destaque (usada para o fundo do botão, etc.

    },
  };