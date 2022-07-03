import { createNavigationContainerRef } from "@react-navigation/native";
import Deso from "deso-protocol";
import { Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import { getStringItem } from "../../utils/storage";

// const deso = new Deso();
interface Context {
  loggedIn: boolean;
  deso: Deso;
  publicKey: string;
  navigationRef: any;
}

const AppContext = React.createContext<Context | null>(null);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === null) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPublicKey, setUserPublicKey] = useState("");
  const [jwt, setJwt] = useState("");
  const navigationRef = createNavigationContainerRef();
  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const jwt = await getStringItem("jwt");
      const publicKey = await getStringItem("publicKeyBase58Check");
      if (!publicKey || !jwt) return;
      setUserPublicKey(publicKey);
      setJwt(jwt);
      setLoggedIn(true);
    };
    func();
    setLoading(false);
  }, []);
  const deso = new Deso({ identityConfig: { host: "server" } });
  const value = {
    loggedIn,
    publicKey: userPublicKey,
    deso,
    navigationRef,
    jwt,
  };
  return (
    <AppContext.Provider value={value}>
      {loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};
