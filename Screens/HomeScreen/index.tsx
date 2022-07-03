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
import {
  GetProfilesResponse,
  ProfileEntryResponse,
} from "deso-protocol-types/src/lib/deso-types";
import { ActivityIndicator } from "react-native";
import IonIconComponents from "@expo/vector-icons/Ionicons";
import { useAppContext } from "../../context/appContext";
import { useDeso } from "../../context/desoContext";
import { User } from "../../components/UserCard";
import UserAvatar from "../../components/UserAvatar";
import { useNavigation } from "@react-navigation/native";

const IonIcon = IonIconComponents as any;
const Ant = AntIcon as any;

const HomeScreen = () => {
  const { searchUsers, setOpenedUser } = useDeso();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchUser, setSearchUsers] = useState<GetProfilesResponse | null>(
    null
  );
  const navigation = useNavigation();
  const { deso, publicKey, navigationRef } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  // const [openedUser, setOpenedUser] = useState<ProfileEntryResponse | null>(
  //   null
  // );
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

  // useEffect(() => {
  //   console.log(searchUser);
  // }, [searchUser]);

  const onPressonUser = (user: ProfileEntryResponse) => {
    setOpenedUser(user);
    navigationRef.current.setParams({ openedUser: user });
    navigation.navigate("Chat", { user });
  };

  return (
    <View bg={"primary.100"} width={"100%"} height={"100%"}>
      <View
        marginTop={"2"}
        mr={"2"}
        ml={"auto"}
        width={"80%"}
        mx={"auto"}
        flexDirection={"row-reverse"}
        alignItems={"center"}
      >
        {!showSearchBar ? (
          <Ant
            onPress={toggleSearchBar}
            name="search1"
            size={30}
            color={"white"}
            style={{ marginRight: 20 }}
          />
        ) : (
          <Ant
            onPress={toggleSearchBar}
            name="close"
            size={30}
            color={"white"}
            style={{ marginRight: 20 }}
          />
        )}
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
            onSubmitEditing={handleSearch}
          />
        )}
      </View>
      {Array.isArray(searchUser?.ProfilesFound) &&
        searchUser?.ProfilesFound &&
        searchUser?.ProfilesFound.length > 0 && (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
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
            {searchUser.ProfilesFound.map((user, index) => {
              return (
                <User
                  key={index}
                  onPress={() => onPressonUser(user)}
                  displayName={user.Username}
                  verified={user.IsVerified}
                />
              );
            })}
          </ScrollView>
        )}
    </View>
  );
};

export default HomeScreen;
