"use client";

import { UserContext } from "@/providers/user-provider";
import { useContext } from "react";

const useUserData = () => {
  const user = useContext(UserContext);

  return user;
};

export default useUserData;
