"use client";

import { TUser } from "@/types/user.interface";
import {
  createContext,
  useState,
  ReactNode,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

interface UserProviderProps {
  children: ReactNode;
  initialUser: TUser | null;
}

export type TUserContext = {
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>>;
};

export const UserContext = createContext<TUserContext>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState<TUser | null>(initialUser);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
