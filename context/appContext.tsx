import React, { useEffect, useState } from "react";
import { IS_LOGGED_IN } from "../const";
import { getBooleanItem } from "../utils/storage";

interface Context {
  loggedIn: boolean;
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
  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const loggedInValue = await getBooleanItem(IS_LOGGED_IN);
      if (loggedInValue) {
        setLoggedIn(true);
      }
    };
    func();
    setLoading(false);
  }, []);
  const value = { loggedIn };
  return (
    <AppContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  );
};
