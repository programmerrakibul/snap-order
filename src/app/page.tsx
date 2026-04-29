"use client";

import { logoutUser } from "@/actions/server/user.action";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { toast } from "sonner";

export default function Home() {
  const { isLoading, data, setUser } = useSession();

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>{JSON.stringify(data, null, 2)}</div>

        <div>
          <Button
            onClick={() => {
              (async () => {
                const { message } = await logoutUser();
                setUser(null);
                toast.success(message);
              })();
            }}
          >
            Logout
          </Button>
        </div>
      </main>
    </div>
  );
}
