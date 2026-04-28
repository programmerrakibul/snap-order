"use client";

import React, { useEffect } from "react";
import { ITokenUser } from "@/types/user.interface";
import { createContext, useState } from "react";
import { isAuthenticated } from "@/actions/server/isAuthenticated";

export interface TSessionContextProps {
  isLoading: boolean;
  data: ITokenUser | null;
}

export const SessionContext = createContext<TSessionContextProps>({
  isLoading: false,
  data: null,
});

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<ITokenUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const user = await isAuthenticated();
        setUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const sessionData: TSessionContextProps = {
    isLoading,
    data: user,
  };

  return <SessionContext value={sessionData}>{children}</SessionContext>;
};

export default SessionProvider;
