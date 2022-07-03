import React from "react";
import {
  Text,
  HStack,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  Theme,
  StatusBar,
} from "native-base";
import { AppContextProvider } from "./context/appContext";
import MainNavigator from "./navigation/MainNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Define the config

// extend the theme

export const theme: Theme = extendTheme({
  colors: {
    primary: {
      "100": "#272643",
      "200": "#2c698d",
    },
    secondary: {
      "100": "#e3f6f5",
      "200": "#e3f6f5",
    },
    white: "#ffffff",
    black: "#000000",
    verify: "#117338",
  },
  components: {
    Text: {
      defaultProps: {
        color: "white",
        fontFamiliy: "Poppins_500Normal",
      },
    },
    Heading: {
      defaultProps: {
        color: "white",
        fontFamiliy: "Poppins_700Bold",
      },
    },
  },
});
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}
export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar barStyle={"default"} />
        <AppContextProvider>
          <MainNavigator />
        </AppContextProvider>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
