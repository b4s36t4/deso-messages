import Deso, { DesoConfig } from "deso-protocol";
import React, { useEffect, useState } from "react";
import { IS_LOGGED_IN } from "../const";
import { getBooleanItem } from "../utils/storage";

const deso = new Deso();

declare global {
  interface Window {
    deso: Deso;
  }
}

interface Context {
  loggedIn: boolean;
  deso: Deso;
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
  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const loggedUser = deso.identity.getUserKey();
      if (!loggedUser) return;
      const req = {
        PublicKeyBase58Check: loggedUser,
      };
      setLoggedIn(true);
    };
    func();
    setLoading(false);
    window.deso = deso;
  }, []);
  const value = { loggedIn, deso };
  return (
    <AppContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  );
};
