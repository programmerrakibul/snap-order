"use client";

import { ITokenUser } from "@/types/user.interface";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  ReactNode,
} from "react";
import { isAuthenticated } from "@/actions/server/isAuthenticated";

export interface TSessionContextProps {
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<ITokenUser | null>>;
  data: ITokenUser | null;
}

const defaultSetUser: Dispatch<SetStateAction<ITokenUser | null>> = () => null;

export const SessionContext = createContext<TSessionContextProps>({
  isLoading: false,
  data: null,
  setUser: defaultSetUser,
});

const SessionProvider = ({ children }: { children: ReactNode }) => {
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
    setUser,
  };

  return <SessionContext value={sessionData}>{children}</SessionContext>;
};

export default SessionProvider;
