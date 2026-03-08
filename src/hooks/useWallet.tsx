"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
  userSession: UserSession;
}

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  connect: () => {},
  disconnect: () => {},
  userSession,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const addr =
        userData.profile?.stxAddress?.testnet ||
        userData.profile?.stxAddress?.mainnet ||
        null;
      setAddress(addr);
    }
  }, []);

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: "StackPool",
        icon: typeof window !== "undefined" ? window.location.origin + "/icon.png" : "/icon.png",
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        const addr =
          userData.profile?.stxAddress?.testnet ||
          userData.profile?.stxAddress?.mainnet ||
          null;
        setAddress(addr);
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected: !!address,
        address,
        connect,
        disconnect,
        userSession,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
