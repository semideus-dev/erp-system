"use client";

import { env } from "@erp-system/env/web";
import { Button } from "@erp-system/ui/components/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erp-system/ui/components/card";
import { GlowCard } from "@erp-system/ui/components/glow-card";
import { Input } from "@erp-system/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erp-system/ui/components/select";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import z from "zod";

import type { authClient } from "@/lib/auth-client";

type User = typeof authClient.$Infer.Session.user;

const WHITESPACE_REGEX = /\s+/;

function createAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${encodeURIComponent(seed)}`;
}

function splitName(name: string | null | undefined) {
  if (!name || name.includes("@")) {
    return { firstName: "", lastName: "" };
  }

  const [firstName = "", ...lastNameParts] = name
    .trim()
    .split(WHITESPACE_REGEX);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
}

function getAvatarSeed(
  firstName: string,
  fallbackFirstName: string,
  user: User
) {
  return firstName.trim() || fallbackFirstName || user.email || user.id;
}

export default function OnboardingForm({ user }: { user: User }) {
  const router = useRouter();
  const initialName = splitName(user.name);
  const [requiresPassword, setRequiresPassword] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRequirements() {
      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/onboarding`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (isMounted) {
          setRequiresPassword(true);
          toast.error("Unable to check onboarding requirements");
        }
        return;
      }

      const data = (await response.json()) as { requiresPassword: boolean };

      if (isMounted) {
        setRequiresPassword(data.requiresPassword);
      }
    }

    loadRequirements().catch(() => {
      if (isMounted) {
        setRequiresPassword(true);
        toast.error("Unable to check onboarding requirements");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const form = useForm({
    defaultValues: {
      firstName: initialName.firstName,
      lastName: initialName.lastName,
      age: 0,
      gender: "",
      phoneNumber: user.phoneNumber ?? "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const avatarUrl = createAvatarUrl(
        getAvatarSeed(value.firstName, initialName.firstName, user)
      );

      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/onboarding`,
        {
          body: JSON.stringify({
            firstName: value.firstName,
            lastName: value.lastName,
            age: value.age,
            gender: value.gender,
            phoneNumber: value.phoneNumber,
            image: avatarUrl,
            ...(requiresPassword ? { password: value.password } : {}),
          }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      if (response.status === 409) {
        toast.error(
          "This phone number is already connected to another account."
        );
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(data?.error || "Unable to complete onboarding");
        return;
      }

      toast.success("Profile completed");
      router.push("/dashboard");
      router.refresh();
    },
    validators: {
      onSubmit: z.object({
        firstName: z.string().trim().min(1, "First name is required"),
        lastName: z.string().trim().min(1, "Last name is required"),
        age: z.number().int().min(16, "Must be at least 16"),
        gender: z.enum(["male", "female", "other"], {
          message: "Select a gender",
        }),
        phoneNumber: z
          .string()
          .min(1, "Phone number is required")
          .refine((value) => isValidPhoneNumber(value), "Invalid phone number"),
        password: requiresPassword
          ? z.string().min(8, "Password must be at least 8 characters")
          : z.string(),
      }),
    },
  });

  if (requiresPassword === null) {
    return null;
  }

  return (
    <div className="w-full max-w-lg">
      <GlowCard className="rounded-2xl bg-transparent">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <form.Subscribe selector={(state) => state.values.firstName}>
            {(firstName) => {
              const avatarUrl = createAvatarUrl(
                getAvatarSeed(firstName, initialName.firstName, user)
              );

              return (
                // biome-ignore lint/performance/noImgElement: DiceBear SVGs are deterministic remote avatars.
                <img
                  alt="Default profile avatar"
                  className="mb-3 size-24 rounded-full border bg-white"
                  height={96}
                  src={avatarUrl}
                  width={96}
                />
              );
            }}
          </form.Subscribe>
          <CardTitle className="mb-4 text-2xl">Complete your profile</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <form.Field name="firstName">
                {(field) => (
                  <div className="space-y-2">
                    <Input
                      autoComplete="given-name"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="First Name"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              <form.Field name="lastName">
                {(field) => (
                  <div className="space-y-2">
                    <Input
                      autoComplete="family-name"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Last Name"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="phoneNumber">
              {(field) => (
                <div className="space-y-2">
                  <PhoneInput
                    className="h-10 rounded-2xl font-medium text-base focus:border-primary"
                    countryCallingCodeEditable={false}
                    defaultCountry="IN"
                    id={field.name}
                    international
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(value) => field.handleChange(value ?? "")}
                    placeholder="Enter phone number"
                    value={field.state.value || undefined}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p className="text-red-500" key={error?.message}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 gap-2 space-y-2 md:grid-cols-2">
              <form.Field name="age">
                {(field) => (
                  <div className="space-y-2">
                    <Input
                      id={field.name}
                      min={16}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                      placeholder="Age"
                      type="number"
                      value={field.state.value || ""}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              <form.Field name="gender">
                {(field) => (
                  <div className="space-y-2">
                    <Select
                      onValueChange={(val) => field.handleChange(val ?? "")}
                      value={field.state.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            {requiresPassword ? (
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Input
                      autoComplete="new-password"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Password"
                      type="password"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className="text-red-500" key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            ) : null}

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  className="w-full"
                  disabled={!canSubmit || isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Saving..." : "Create Profile"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </GlowCard>
    </div>
  );
}
