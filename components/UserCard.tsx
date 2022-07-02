import { Pressable, View, Text, Tooltip } from "native-base";
import IonIconComponents from "@expo/vector-icons/Ionicons";
import UserAvatar from "./UserAvatar";

const IonIcon = IonIconComponents as any;

interface Props {
  displayName: string;
  verified: boolean;
  onPress?: () => void;
}

export const User = ({ displayName, verified, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
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
      <UserAvatar name={displayName} />
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
