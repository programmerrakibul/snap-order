"use client";

import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  ACCEPTED_IMAGE_TYPES,
  createUserSchema,
  TCreateUserInput,
  TCreateUserOutput,
} from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { createUser } from "@/actions/server/user.action";
import { BadRequestError } from "http-errors-enhanced";
import { getErrorResponse } from "@/lib/error";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { handleSubmit, control, reset } = useForm<
    TCreateUserInput,
    TCreateUserOutput
  >({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: undefined,
      email: "",
      password: "",
      photoURL: undefined,
      phoneNumber: undefined,
    },
  });

  const handleCreateUser = async (data: TCreateUserInput) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.name) formData.append("name", data.name);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.photoURL) formData.append("photoURL", data.photoURL);

      const { success, message } = await createUser(formData);

      if (!success) throw new BadRequestError("Registration failed!");

      reset({
        name: "",
        email: "",
        password: "",
        photoURL: undefined,
        phoneNumber: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(message);
    } catch (error: unknown) {
      const {message} = getErrorResponse(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => handleSubmit(handleCreateUser)(e)}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Rakibul Islam"
                      disabled={isLoading}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="photoURL"
                control={control}
                render={({ field: { onChange, value }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="photoURL">Photo</FieldLabel>
                    <Input
                      ref={fileInputRef}
                      id="photoURL"
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {value && value instanceof File && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {value.name} ({(value.size / 1024).toFixed(1)}{" "}
                        KB)
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                      id="phoneNumber"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="0123456-7890"
                      disabled={isLoading}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email *</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="john@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password *</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/auth/signin">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
