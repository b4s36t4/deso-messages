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

const Stack = createNativeStackNavigator();
const Login = () => {
  return (
    <View>
      <Text>Login</Text>
    </View>
  );
};
const MainNavigator = () => {
  const [loaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });
  const appContext = useAppContext();
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
  return (
    <NavigationContainer
      linking={{
        prefixes: ["social://", "http://simple.scoal.app", "http://localhost"],
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {appContext.loggedIn ? (
          <Stack.Screen component={Login} name={"LoginUp"} />
        ) : (
          <Stack.Screen component={HomeScreen} name={"Home"} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
