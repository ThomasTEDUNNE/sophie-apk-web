import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee', // Couleur primaire
    accent: '#03dac4',  // Couleur d'accentuation
    background: '#ffffff', // Couleur d'arrière-plan claire
    surface: '#f5f5f5', // Couleur de surface (comme celle des cartes)
    text: '#000000', // Couleur du texte
    disabled: '#bdbdbd', // Couleur pour les éléments désactivés
    placeholder: '#a0a0a0', // Couleur des placeholders
    //backdrop: '#000000', // Couleur d'arrière-plan de la superposition
    notification: '#f50057', // Couleur pour les notifications
  },
};



