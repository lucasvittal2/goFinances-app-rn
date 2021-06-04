import React from 'react';
import AppLoading from 'expo-app-loading'
import { ThemeProvider} from 'styled-components';
import {
 useFonts,
 Poppins_400Regular,
 Poppins_500Medium,
 Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Righteous_400Regular } from '@expo-google-fonts/righteous'

import theme from './src/global/styles/theme';
import {DashBoard} from './src/screens/Dashboard/index'
import { Text } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Righteous_400Regular
  });
  if(! fontsLoaded){
    return <AppLoading/>;
  }
  return (
    <ThemeProvider theme = { theme }>
      <DashBoard/>
    </ThemeProvider>
  );
}


