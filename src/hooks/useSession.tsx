"use client";

import { SessionContext } from "@/providers/session-provider";
import { useContext } from "react";

const useSession = () => {
  const session = useContext(SessionContext);

  return session;
};

export default useSession;
