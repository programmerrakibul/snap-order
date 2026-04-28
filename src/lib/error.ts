import { HttpError } from "http-errors-enhanced";

export type TErrorResponse = {
  success: boolean;
  message: string;
  statusCode: number;
};

export const getErrorResponse = (error: unknown): TErrorResponse => {
  let message = "Something went wrong!";
  let statusCode = 500;

  if (error instanceof Error) {
    message = error.message;
  }

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  return {
    success: false,
    message,
    statusCode,
  };
};
