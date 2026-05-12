"use client";

import { UserContext } from "@/providers/user-provider";
import { BadRequestError } from "http-errors-enhanced";
import { useContext } from "react";

const useUserData = () => {
  const user = useContext(UserContext);

  if (!user) {
    throw new BadRequestError(
      "useUserData must be used within a UserProvider!",
    );
  }

  return user;
};

export default useUserData;
