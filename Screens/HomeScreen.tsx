import {
  Avatar,
  Button,
  Heading,
  Input,
  Pressable,
  ScrollView,
  Text,
  Tooltip,
  View,
} from "native-base";
import React, { memo, useEffect, useMemo, useState } from "react";
import AntIcon from "@expo/vector-icons/AntDesign";
import { useDeso } from "../context/desoContext";
import {
  GetProfilesResponse,
  ProfileEntryResponse,
} from "deso-protocol-types/src/lib/deso-types";
import { ActivityIndicator } from "react-native";
import { User } from "../components/UserCard";
import UserAvatar from "../components/UserAvatar";
import IonIconComponents from "@expo/vector-icons/Ionicons";
import { useAppContext } from "../context/appContext";
import { GetDecryptMessagesResponse } from "deso-protocol-types/src/lib/deso-types-custom";
import { DecryptedMessage } from "../global";

const IonIcon = IonIconComponents as any;
const Ant = AntIcon as any;

const HomeScreen = () => {
  const { searchUsers, sendMessage, getNotificationCount, getUserMessages } =
    useDeso();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchUser, setSearchUsers] = useState<GetProfilesResponse | null>(
    null
  );
  const { deso, publicKey } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [openedUser, setOpenedUser] = useState<ProfileEntryResponse | null>(
    null
  );
  const [msgText, setMsgText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const user = await searchUsers(searchText);
    setSearchUsers(user);
    setIsLoading(false);
  };
  useEffect(() => {
    handleSearch();
    const req = {
      PublicKeyBase58Check: publicKey,
    };
  }, []);

  const onPressSend = async () => {
    if (msgLoading) return;
    setMsgLoading(true);
    await sendMessage(openedUser?.PublicKeyBase58Check || "", msgText);
    setMsgText("");
    setMsgLoading(false);
  };

  const onPressonUser = (user: ProfileEntryResponse) => {
    setOpenedUser(user);
  };

  useEffect(() => {
    if (!openedUser) return;
    const func = async () => {
      const userMessages = await getUserMessages(
        openedUser.PublicKeyBase58Check
      );
      const decrypted = await deso.identity.decrypt(userMessages);
      if (!decrypted) return;
      setMessages(decrypted);
    };
    setInterval(() => {
      func();
    }, 1000);
  }, [openedUser]);

  const renderMessages = useMemo(() => {
    return (
      <View
        style={{ borderWidth: 2 }}
        borderColor={"primary.100"}
        borderTopRightRadius={"10"}
        borderBottomLeftRadius={"10"}
        height={"75%"}
        marginTop={"24px"}
        width={"100%"}
        display={"flex"}
        justifyContent={"flex-end"}
      >
        {Array.isArray(messages) && messages.length > 0 && (
          <ScrollView
            display="flex"
            flexDirection={"column-reverse"}
            // justifyContent={"flex-end"}
            overflow={"scroll"}
            contentContainerStyle={{ justifyContent: "flex-end" }}
          >
            {messages.map((message) => {
              return (
                (message.SenderMessagingPublicKey ===
                  openedUser?.PublicKeyBase58Check ||
                  message.RecipientMessagingPublicKey ===
                    openedUser?.PublicKeyBase58Check) && (
                  <View
                    my={"10px"}
                    ml={"10px"}
                    mr={"10px"}
                    borderRadius={10}
                    key={message.EncryptedHex}
                    alignSelf={message.IsSender ? "flex-end" : "flex-start"}
                    width={"50%"}
                    bg={message.IsSender ? "secondary.100" : "primary.200"}
                    py={"10px"}
                    px={"15px"}
                  >
                    <Text fontSize={"20px"} color={"black"}>
                      {message.DecryptedMessage}
                    </Text>
                  </View>
                )
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }, [messages]);

  return (
    <View
      bg={"white"}
      height={"100%"}
      overflow={"hidden"}
      flexDirection={"row"}
    >
      <View key={"leftMenu"} height={"full"} width={"30%"} bg={"primary.100"}>
        <View
          mt={"2rem"}
          pr={"2rem"}
          ml={"auto"}
          width={"80%"}
          mx={"auto"}
          flexDirection={"row"}
          alignItems={"center"}
        >
          {showSearchBar && (
            <Input
              _focus={{ borderColor: "secondary.200" }}
              width={"100%"}
              placeholder="Enter Username"
              color={"white"}
              placeholderTextColor={"white"}
              pl={"10px"}
              py={"5px"}
              fontSize={"20px"}
              onChangeText={(e) => setSearchText(e)}
              value={searchText}
              onKeyPress={(e: any) => e.key === "Enter" && handleSearch()}
            />
          )}
          {!showSearchBar ? (
            <Ant
              onPress={toggleSearchBar}
              name="search1"
              size={30}
              color={"white"}
              style={{ marginLeft: "10px" }}
            />
          ) : (
            <Ant
              onPress={toggleSearchBar}
              name="close"
              size={30}
              color={"white"}
              style={{ marginLeft: "10px" }}
            />
          )}
        </View>
        <View
          style={{
            marginTop: 50,
            paddingHorizontal: 20,
            maxHeight: 800,
            overflow: "scroll",
            paddingBottom: 120,
          }}
        >
          {isLoading && (
            <ActivityIndicator
              color={"white"}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          )}
          {Array.isArray(searchUser?.ProfilesFound) &&
            searchUser?.ProfilesFound &&
            searchUser?.ProfilesFound.length > 0 && (
              <>
                {searchUser?.ProfilesFound.map((user) => (
                  <User
                    key={user.PublicKeyBase58Check}
                    onPress={() => onPressonUser(user)}
                    displayName={user.Username}
                    verified={user.IsVerified}
                  />
                ))}
              </>
            )}
        </View>
      </View>
      <View key={"right"} width={"70%"} height={"100%"} px={"2rem"} py={"1rem"}>
        {openedUser ? (
          <View alignItems={"flex-start"} width={"100%"} height={"100%"}>
            <View
              px={"2rem"}
              py={"1rem"}
              width={"100%"}
              bg={"primary.100"}
              borderRadius={12}
            >
              <View flexDirection={"row"} alignItems={"center"}>
                <UserAvatar name={openedUser.Username} />
                <View ml={"10px"} flexDirection={"row"} alignItems={"center"}>
                  <Heading>{openedUser.Username}</Heading>
                  {openedUser.IsVerified && (
                    <Tooltip
                      label="This sheild refers that User has verified his phone/email with Deso"
                      openDelay={300}
                      maxWidth={200}
                      bg={"white"}
                      _text={{
                        color: "black",
                        fontWeight: "500",
                        fontFamily: "POPPINS_500MEDIUM",
                      }}
                    >
                      <>
                        <IonIcon
                          style={{ marginLeft: 10 }}
                          name="ios-shield-checkmark-sharp"
                          size={20}
                          color={"white"}
                        />
                      </>
                    </Tooltip>
                  )}
                </View>
              </View>
            </View>
            {renderMessages}
            <View width={"100%"} mt={"10px"}>
              <View
                style={{ borderWidth: 2 }}
                borderColor={"primary.200"}
                borderRadius={"12px"}
                flexDirection={"row"}
                alignItems={"center"}
                width={"100%"}
                py={"10px"}
                px="10px"
              >
                <View
                  flexDirection={"row"}
                  justifyContent={"space-around"}
                  style={{ width: "20%" }}
                >
                  <Pressable>
                    <Ant name={"paperclip"} size={25} />
                  </Pressable>
                  <Pressable>
                    <Ant name={"smileo"} size={25} />
                  </Pressable>
                </View>
                <View width={"60%"}>
                  <Input
                    borderWidth={"0"}
                    fontSize={20}
                    fontFamily={"POPPINS_500MEDIUM"}
                    variant={"unstyled"}
                    height={"100%"}
                    width={"100%"}
                    placeholder="type your message here"
                    value={msgText}
                    onChangeText={(e) => setMsgText(e)}
                  />
                </View>

                <View width={"15%"}>
                  <Button
                    variant={"unstyled"}
                    isLoading={msgLoading}
                    onPress={onPressSend}
                    _text={{ color: "black" }}
                  >
                    Send
                  </Button>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Heading
              textAlign={"center"}
              fontFamily={"Poppins_500Medium"}
              color={"black"}
            >
              Select a User to Start something Awesome
            </Heading>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
