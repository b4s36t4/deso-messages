import {
  Button,
  Column,
  Heading,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import WebView from "react-native-webview";
import DesoImg from "../../assets/deso.svg";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppContext } from "../../context/appContext";
import { setItem } from "../../utils/storage";
import Deso from "deso-protocol";
const HomeScreen = () => {
  const [webView, setWebView] = useState(false);
  const appContext = useAppContext();

  useEffect(() => {
    if (appContext.loggedIn) {
      setWebView(false);
    }
  }, [appContext.loggedIn]);

  if (webView) {
    return (
      <WebView
        source={{
          uri: "https://identity.deso.org/derive?accessLevelRequest=4&callback=exp://192.168.2.154:19000",
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(e) => console.log(e)}
      />
    );
  }
  return (
    <View style={{ height: "100%" }}>
      <View
        bg={"primary.100"}
        height={"70%"}
        borderBottomLeftRadius={12}
        borderBottomRightRadius={12}
      >
        <View justifyContent={"center"} height={"100%"} alignItems={"center"}>
          <Text fontSize={35} fontWeight={"light"}>
            Your gateway to the <Heading size={"xl"}>Decentralized</Heading>{" "}
            Chat
          </Text>
          <View style={{ paddingTop: 50 }}>
            <Image source={DesoImg} alt={"logo"} />
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PrimaryButton
          onPress={() => {
            setWebView(true);
          }}
          title="Start your Journey"
          style={{ width: "60%" }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
