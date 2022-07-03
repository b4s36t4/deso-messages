import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAppContext } from "../context/appContext";
import HomeScreen from "../Screens/HomeScreen";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { ActivityIndicator } from "react-native";
import Landing from "../Screens/Landing";
import { DesoProvider } from "../context/desoContext";
import * as Linking from "expo-linking";
import { setItem } from "../utils/storage";
import url from "url";
import Chat from "../Screens/Chat";

const Stack = createNativeStackNavigator();

const HomeWrapper = () => {
  return (
    <DesoProvider>
      <HomeScreen />
    </DesoProvider>
  );
};

const ChatWrapper = () => {
  return (
    <DesoProvider>
      <Chat />
    </DesoProvider>
  );
};

const MainNavigator = () => {
  const appContext = useAppContext();
  const [loaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });
  if (!loaded) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={"#272643"} />
      </View>
    );
  }
  const prefix = Linking.createURL("/");

  Linking.addEventListener("url", (e) => {
    const params = url.parse(e.url, true).query;
    Object.entries(params).forEach(([key, value]) => {
      setItem(key, value);
    });
  });

  return (
    <NavigationContainer
      linking={{
        prefixes: [prefix],
      }}
      ref={appContext.navigationRef}
      onStateChange={(e) => {
        // console.log(e);
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!appContext.loggedIn && (
          <Stack.Screen component={Landing} name={"Landing"} />
        )}
        <Stack.Screen
          navigationKey="home"
          component={HomeWrapper}
          name={"Home"}
        />
        <Stack.Screen
          navigationKey="chat"
          component={ChatWrapper}
          name={"Chat"}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
