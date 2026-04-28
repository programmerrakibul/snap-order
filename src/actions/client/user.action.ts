import { TCreateUserInput } from "@/schemas/user";
import { toast } from "sonner";
import { createUser } from "../server/user.action";
import { getErrorResponse } from "@/lib/error";
import { BadRequestError } from "http-errors-enhanced";

export const handleCreateUser = async (data: TCreateUserInput) => {
  try {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.name) formData.append("name", data.name);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    if (data.photoURL) formData.append("photoURL", data.photoURL);

    const { success, message } = await createUser(formData);

    if (!success) throw new BadRequestError("Registration failed!");

    toast.success(message);
  } catch (error: unknown) {
    const { message } = getErrorResponse(error);
    toast.error(message);
  }
};
