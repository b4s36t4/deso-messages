import { Avatar } from "native-base";
import React from "react";
const UserAvatar = ({ name }: { name: string }) => {
  const DP = name
    ?.match(/(\b\S)?/g)
    ?.join("")
    ?.match(/(^\S|\S$)?/g)
    ?.join("")
    ?.toUpperCase();
  return <Avatar size={"md"}>{DP}</Avatar>;
};

export default UserAvatar;
