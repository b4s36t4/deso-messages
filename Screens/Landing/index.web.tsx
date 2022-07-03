import {
  Button,
  Column,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import Deso from "../../assets/deso.svg";
import PrimaryButton from "../../components/PrimaryButton";
import { useAppContext } from "../../context/appContext";
import { setItem } from "../../utils/storage";

const HomeScreen = () => {
  const { deso } = useAppContext();
  const SignUpUser = async () => {
    await deso.identity.login("2");
    const request = {
      PublicKeyBase58Check: deso.identity.getUserKey() || "",
      jwt: (await deso.identity.getJwt()) || "",
    };
    const response = await deso.user.getUserMetadata(request);
    if (!response.HasPhoneNumber) {
      window.open(
        `https://identity.deso.org/log-in?accessLevelRequest=2&getFreeDeso=true`,
        undefined,
        "toolbar=no, width=800, height=1000, top=0, left=0"
      );
      return;
    } else {
      setItem("HasPhoneNumber", "true");
    }
    window.location.reload();
  };
  return (
    <View flexDirection={"row"} width={"100%"} bg={"white"} height={"100%"}>
      <View backgroundColor={"primary.100"} color={"white"} width={"50%"}>
        <View key={"cover"} justifyContent={"space-around"} height={"100%"}>
          <VStack justifyContent={"space-evenly"} height={"100%"} px={"3rem"}>
            <Column>
              <Text fontSize={35} fontWeight={"light"}>
                Your gateway to the <Heading size={"xl"}>Decentralized</Heading>{" "}
                Chat
              </Text>
            </Column>
            <Column>
              <VStack>
                <Heading size={"md"}>Powered By</Heading>
                <HStack mt={"2rem"}>
                  <img src={Deso} alt={"Deso"} />
                </HStack>
              </VStack>
            </Column>
          </VStack>
        </View>
      </View>
      <View width={"50%"} key={"main"}>
        <View justifyContent={"center"} alignItems={"center"} flex={1}>
          <PrimaryButton
            onPress={SignUpUser}
            title="Start your Journey"
            style={{ width: "60%" }}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
