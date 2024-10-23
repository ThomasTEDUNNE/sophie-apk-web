import React, { lazy, Suspense } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import SplashScreen from './components/SplashScreen';
import { ActivityIndicator, View } from 'react-native';

const InitialScreen = lazy(() => import('./components/InitialScreen'));
const CompetencesScreen = lazy(() => import('./components/CompetencesScreen'));
const EvaluationScreen = lazy(() => import('./components/EvaluationScreen'));

const Stack = createStackNavigator();
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Suspense fallback={<LoadingScreen />}>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen 
              name="Splash" 
              component={SplashScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Initial" 
              component={InitialScreen} 
              options={{ title: 'Initialisation Liste Elève' }} 
            />
            <Stack.Screen 
              name="Competences" 
              component={CompetencesScreen} 
              options={{ title: 'Choix des Compétences' }} 
            />
            <Stack.Screen 
              name="Evaluation" 
              component={EvaluationScreen} 
              options={{ title: 'Évaluation' }} 
            />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
    </PaperProvider>
  );
}
