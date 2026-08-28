"use client";

import { getUserData } from "@/actions/server/user.action";
import { TUser } from "@/types/user.interface";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UserProviderProps {
  children: ReactNode;
}

export type TUserContext = {
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>>;
  authenticated: boolean;
  loading: boolean;
};

export const UserContext = createContext<TUserContext>({
  user: null,
  setUser: () => null,
  authenticated: false,
  loading: true,
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const authenticated = useMemo(() => !!user, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      authenticated,
      loading: isLoading,
    }),
    [user, authenticated, isLoading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
