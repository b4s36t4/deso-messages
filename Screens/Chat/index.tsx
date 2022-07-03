import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Heading,
  Tooltip,
  Pressable,
  Input,
  Button,
} from "native-base";
import UserAvatar from "../../components/UserAvatar";
import AntIcon from "@expo/vector-icons/AntDesign";
import IonIconComponents from "@expo/vector-icons/Ionicons";
import { useDeso } from "../../context/desoContext";
import { useAppContext } from "../../context/appContext";
import { useNavigation } from "@react-navigation/native";
const IonIcon = IonIconComponents as any;
const Ant = AntIcon as any;
interface Props {
  messages: any[];
  openedUser: any;
}

const Chat = (props: any) => {
  const navigation = useNavigation();
  const { deso, navigationRef } = useAppContext();
  const { user: openedUser } = navigationRef.current.getCurrentRoute()?.params;

  const [msgText, setMsgText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const { sendMessage, getUserMessages, getMessagesFromAPI } = useDeso();

  const onPressSend = async () => {
    if (msgLoading) return;
    setMsgLoading(true);
    await sendMessage(openedUser?.PublicKeyBase58Check || "", msgText);
    setMsgText("");
    setMsgLoading(false);
  };

  const decryptMessages = (messages) => {};

  useEffect(() => {
    if (!openedUser) return;
    const func = async () => {
      const res = await getMessagesFromAPI();
      const userMessages = res?.OrderedContactsWithMessages[0]["Messages"];
      const decrypted = await deso.identity.decrypt(userMessages);
      //   if (!decrypted) return;
      console.log(userMessages[0]);
      setMessages(userMessages);
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
    <View>
      {openedUser ? (
        <View alignItems={"flex-start"} width={"100%"} height={"100%"}>
          <View
            px={"2"}
            py={"1"}
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
          <Heading textAlign={"center"} color={"black"}>
            Select a User to Start something Awesome
          </Heading>
        </View>
      )}
    </View>
  );
};

export default Chat;
