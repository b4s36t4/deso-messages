import { StyleProp, ViewStyle } from "react-native";
import React from "react";
import { Button, Text, View } from "native-base";
import AntIcon from "@expo/vector-icons/AntDesign";

interface ButtonProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  style,
  ...props
}: ButtonProps) => {
  return (
    <Button
      style={[
        {
          paddingVertical: "15px",
          paddingHorizontal: "10px",
          marginHorizontal: "auto",
          maxWidth: "80%",
          width:"60%",
        },
        style,
      ]}
      bg={"primary.100"}
      fontFamily={"Poppins_700Bold"}
      borderRadius={0}
      _pressed={{ bg: "primary.100" }}
      _hover={{ bg: "primary.100", opacity: "0.9" }}
      endIcon={<AntIcon name="arrowright" color={"#E3F6F5"} size={30} />}
    >
      <Text fontWeight={"extrabold"}>{title}</Text>
    </Button>
  );
};

export default PrimaryButton;
