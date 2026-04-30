"use client";

import { TUser } from "@/types/user.interface";
import { createContext } from "react";

interface UserProviderProps {
  children: React.ReactNode;
  initialUser: TUser | null;
}

export const UserContext = createContext<TUser | null>(null);



export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  return (
    <UserContext.Provider value={initialUser}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
