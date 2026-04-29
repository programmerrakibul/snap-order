import { TLoginUser } from "@/schemas/user";
import { toast } from "sonner";
import { loginUser } from "../server/user.action";
import { getErrorResponse } from "@/lib/error";
import { BadRequestError } from "http-errors-enhanced";
import { Dispatch, SetStateAction } from "react";
import { UseFormReset } from "react-hook-form";

export const handleLogin = async (
  data: TLoginUser,
  reset: UseFormReset<TLoginUser>,
  setIsPending: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsPending(true);
    const { success, message } = await loginUser(data);
    if (!success) throw new BadRequestError("Login failed!");

    reset();
    toast.success(message);
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);

    toast.error(message);
  } finally {
    setIsPending(false);
  }
};
