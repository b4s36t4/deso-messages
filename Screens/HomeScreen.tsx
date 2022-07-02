import { Avatar, Input, Pressable, Text, Tooltip, View } from "native-base";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import AntIcon from "@expo/vector-icons/AntDesign";
import IonIcon from "@expo/vector-icons/Ionicons";
import { useDeso } from "../context/desoContext";
import { GetProfilesResponse } from "deso-protocol-types/src/lib/deso-types";
import { ActivityIndicator } from "react-native";
const Ant = AntIcon as any;

interface Props {
  displayName: string;
  verified: boolean;
}

const User = ({ displayName, verified }: Props) => {
  const DP = displayName
    ?.match(/(\b\S)?/g)
    ?.join("")
    ?.match(/(^\S|\S$)?/g)
    ?.join("")
    ?.toUpperCase();

  return (
    <Pressable
      style={{
        paddingVertical: "10px",
        paddingHorizontal: 10,
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 12,
        marginVertical: 8,
      }}
      bg={"secondary.100"}
    >
      {/* <View
        style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
        mr={"10px"}
        bg={"primary.100"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text fontWeight={"bold"} fontSize={20}>
          {"JD"}
        </Text>
      </View> */}
      <Avatar size={"md"}>{DP}</Avatar>
      <View alignItems={"center"} flexDirection={"row"}>
        <Text
          fontSize={"20"}
          fontFamily={"POPPINS_600SEMIBOLD"}
          fontWeight={"semibold"}
          color={"black"}
          ml={"10px"}
          maxWidth={"100px"}
          accessibilityLabel={displayName}
          accessibilityHint={displayName}
          ellipsizeMode={"tail"}
          noOfLines={1}
        >
          {displayName}
        </Text>
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
          <View>
            {verified && (
              <IonIcon
                style={{ marginLeft: 10 }}
                name="ios-shield-checkmark-sharp"
                size={20}
              />
            )}
          </View>
        </Tooltip>
      </View>
    </Pressable>
  );
};

const HomeScreen = () => {
  const { getMyFollowers, searchUsers } = useDeso();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchUser, setSearchUsers] = useState<GetProfilesResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log(getMyFollowers());
  }, []);

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
  }, []);

  return (
    <View bg={"white"} height={"100%"} overflow={"hidden"}>
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
                    displayName={user.Username}
                    verified={user.IsVerified}
                  />
                ))}
              </>
            )}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
