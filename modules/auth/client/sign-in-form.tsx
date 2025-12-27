"use client";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/ui/password-input";
import { PiSpinnerGapLight } from "react-icons/pi";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/dashboard" },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Unable to sign in at this moment.",
          );
        },
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/dashboard");
        },
      },
    );
  }

  async function handleGoogleAuth() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  return (
    <form
      className="space-y-8 w-[90%] md:w-[50%] pt-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input {...field} id="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex flex-col items-center gap-4 py-4">
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <PiSpinnerGapLight className="animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
        <Button
          disabled={isSubmitting}
          variant="outline"
          className="w-full"
          type="button"
          size="lg"
          onClick={handleGoogleAuth}
        >
          <FcGoogle />
          <span>Continue with Google</span>
        </Button>
      </div>
    </form>
  );
}
