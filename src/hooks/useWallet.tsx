"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  connect as stacksConnect,
  disconnect as stacksDisconnect,
  isConnected as stacksIsConnected,
  getLocalStorage,
} from "@stacks/connect";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
});

function getStoredAddress(): string | null {
  const data = getLocalStorage();
  if (data?.addresses?.stx?.[0]?.address) {
    return data.addresses.stx[0].address;
  }
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (stacksIsConnected()) {
      setAddress(getStoredAddress());
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const response = await stacksConnect();
      // response.addresses is AddressEntry[] — find the STX entry
      const stxEntry = response?.addresses?.find(
        (a) => a.symbol === "STX" || a.symbol === "stx"
      );
      if (stxEntry?.address) {
        setAddress(stxEntry.address);
      } else if (response?.addresses?.[0]?.address) {
        // Fallback to first address
        setAddress(response.addresses[0].address);
      } else {
        // Fallback to localStorage
        setAddress(getStoredAddress());
      }
    } catch {
      // User rejected or wallet not available
    }
  }, []);

  const disconnect = useCallback(() => {
    stacksDisconnect();
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected: !!address,
        address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
