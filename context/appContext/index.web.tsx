import Deso from "deso-protocol";
import React, { useEffect, useState } from "react";

const deso = new Deso();
interface Context {
  loggedIn: boolean;
  deso: Deso;
  publicKey: string;
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
      console.log(deso.reinitialize(), "init");
      let loggedUser;
      try {
        loggedUser = deso.identity.getUserKey();
      } catch (e) {
        console.log(e);
      }
      if (!loggedUser) return;
      setLoggedIn(true);
      setUserPublicKey(loggedUser);
    };
    func();
    setLoading(false);
    (window as any).deso = deso;
  }, []);
  const value = { loggedIn, deso, publicKey: userPublicKey };
  return (
    <AppContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  );
};
