import React, { useState } from "react";
import { useAppContext } from "./appContext";
import {
  GetSingleProfileResponse,
  GetFollowsResponse,
  GetProfilesResponse,
  GetNotificationsCountResponse,
  ProfileEntryResponse,
} from "deso-protocol-types/src/lib/deso-types";
import { GetDecryptMessagesResponse } from "deso-protocol-types/src/lib/deso-types-custom";
import axios from "axios";
interface Context {
  getAUser: (username: string) => Promise<GetSingleProfileResponse>;
  getMyFollowers: () => Promise<GetFollowsResponse>;
  followPerson: (username?: string, publicKey?: string) => Promise<void>;
  sendMessage: (to: string, msg: string) => Promise<any>;
  getUserMessages: (publicKey: string) => Promise<GetDecryptMessagesResponse[]>;
  searchUsers: (usernane: string) => Promise<GetProfilesResponse>;
  loading: boolean;
  getNotificationCount: () => Promise<GetNotificationsCountResponse>;
  openedUser: ProfileEntryResponse;
  setOpenedUser: (user: ProfileEntryResponse) => void;
  getMessagesFromAPI: () => Promise<any>;
}
const DesoContext = React.createContext<Context | null>(null);

export const DesoProvider = ({ children }: { children: React.ReactNode }) => {
  const { deso, publicKey: currentUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [openedUser, setOpenedUser] = useState<any>("");
  const toggleLoading = () => {
    setLoading(!loading);
  };
  const getAUser = async (username: string) => {
    toggleLoading();
    const res = await deso.user.getSingleProfile({
      Username: username,
      NoErrorOnMissing: true,
    });
    toggleLoading();
    return res;
  };
  const getMyFollowers = async () => {
    toggleLoading();
    const res = await deso.social.getFollowsStateless({
      PublicKeyBase58Check: currentUser,
      NumToFetch: 30,
    });
    toggleLoading();
    return res;
  };

  const getFollowStatusOfPublicKey = async (publicKey: string) => {
    toggleLoading();
    const res = await deso.social.isFollowingPublicKey({
      PublicKeyBase58Check: currentUser,
      IsFollowingPublicKeyBase58Check: publicKey,
    });
    toggleLoading();
    return res;
  };

  const getPublicKeyFromUsername = async (username?: string) => {
    const user = await deso.user.getSingleProfile({
      Username: username,
      NoErrorOnMissing: true,
    });
    return user.Profile?.PublicKeyBase58Check || "";
  };

  const followPerson = async (publicKey?: string, username?: string) => {
    toggleLoading();
    const finalPublicKey =
      publicKey ?? (await getPublicKeyFromUsername(username));
    if (!finalPublicKey) return;
    const isUnFollow = (await getFollowStatusOfPublicKey(finalPublicKey))
      .IsFollowing;
    await deso.social.createFollowTxnStateless({
      IsUnfollow: isUnFollow,
      FollowerPublicKeyBase58Check: finalPublicKey,
      FollowedPublicKeyBase58Check: currentUser,
      MinFeeRateNanosPerKB: 0,
      TransactionFees: [],
    });
    toggleLoading();
  };

  const sendMessage = async (to: string, msg: string) => {
    toggleLoading();
    const res = await deso.social.sendMessage({
      MessageText: msg,
      RecipientPublicKeyBase58Check: to,
      SenderPublicKeyBase58Check: currentUser,
    });
    toggleLoading();
    return res;
  };

  const getUserMessages = async (publicKey: string) => {
    toggleLoading();
    const res = await deso.social.getMessagesStateless({
      NumToFetch: 25,
      PublicKeyBase58Check: currentUser,
      FetchAfterPublicKeyBase58Check: "",
      HoldersOnly: false,
      FollowersOnly: false,
      FollowingOnly: false,
      HoldingsOnly: false,
      SortAlgorithm: "time",
    });
    toggleLoading();
    return res;
  };

  const getMessagesFromAPI = async () => {
    const params = {
      NumToFetch: 25,
      PublicKeyBase58Check: currentUser,
      FetchAfterPublicKeyBase58Check: "",
      HoldersOnly: false,
      FollowersOnly: false,
      FollowingOnly: false,
      HoldingsOnly: false,
      SortAlgorithm: "time",
    };
    const req = await axios.post(
      "https://node.deso.org/api/v0/get-messages-stateless",
      params
    );
    return req.data;
  };

  const searchUsers = async (username: string) => {
    toggleLoading();
    const res = await deso.user.getProfiles({
      UsernamePrefix: username,
      Username: username,
    });
    toggleLoading();
    return res;
  };
  const getNotificationCount = async () => {
    toggleLoading();
    const res = await deso.notification.getUnreadNotificationsCount({
      PublicKeyBase58Check: currentUser,
    });
    toggleLoading();
    return res;
  };
  const value = {
    getAUser,
    getMyFollowers,
    followPerson,
    sendMessage,
    getUserMessages,
    searchUsers,
    loading,
    getNotificationCount,
    openedUser,
    setOpenedUser,
    getMessagesFromAPI,
  };

  return <DesoContext.Provider value={value}>{children}</DesoContext.Provider>;
};

export const useDeso = () => {
  const context = React.useContext(DesoContext);
  if (context === null) {
    throw new Error("useDeso must be used within a DesoProvider");
  }
  return context;
};
