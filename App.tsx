import React from "react";
import {
  Text,
  HStack,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  Theme,
  View,
} from "native-base";
import { AppContextProvider } from "./context/appContext";
import MainNavigator from "./navigation/MainNavigator";
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
      },
    },
    Heading: {
      defaultProps: {
        color: "white",
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
      <AppContextProvider>
        <MainNavigator />
      </AppContextProvider>
    </NativeBaseProvider>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light"}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
