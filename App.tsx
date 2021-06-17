import "react-native-gesture-handler";
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from "react";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components";

import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Modal, SafeAreaView } from "react-native";
import { Righteous_400Regular } from "@expo-google-fonts/righteous";

import theme from "./src/global/styles/theme";
import { AppRoutes } from "./src/routes/app.routes";
import { Text } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Righteous_400Regular,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}
