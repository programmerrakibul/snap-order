import { getEnv } from "@/lib/env";

export const CLIENT_URL = getEnv().NEXT_PUBLIC_SITE_URL;
export const API_BASE_URL = `${getEnv().NEXT_PUBLIC_SITE_URL}/api` as const;
