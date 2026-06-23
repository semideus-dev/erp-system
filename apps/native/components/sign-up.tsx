import { useForm } from "@tanstack/react-form";
import Constants from "expo-constants";
import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  Surface,
  TextField,
  useToast,
} from "heroui-native";
import { useRef } from "react";
import { Text, type TextInput, View } from "react-native";
import z from "zod";

import { authClient } from "@/lib/auth-client";

const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

export function SignUp() {
  const emailInputRef = useRef<TextInput>(null);
  const { toast } = useToast();
  const callbackURL = `${Constants.expoConfig?.scheme ?? "erp-system"}://`;

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.magicLink(
        {
          email: value.email.trim(),
          callbackURL,
          newUserCallbackURL: callbackURL,
        },
        {
          onError(error) {
            toast.show({
              variant: "danger",
              label: error.error?.message || "Failed to send magic link",
            });
          },
          onSuccess() {
            formApi.reset();
            toast.show({
              variant: "success",
              label: "Magic link sent. Check your inbox.",
            });
          },
        }
      );
    },
  });

  return (
    <Surface className="rounded-lg p-4" variant="secondary">
      <Text className="mb-4 font-medium text-foreground">Create Account</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = validationError;

          return (
            <>
              <FieldError className="mb-3" isInvalid={!!formError}>
                {formError}
              </FieldError>

              <View className="gap-3">
                <form.Field name="email">
                  {(field) => (
                    <TextField>
                      <Label>Email</Label>
                      <Input
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        onSubmitEditing={form.handleSubmit}
                        placeholder="email@example.com"
                        ref={emailInputRef}
                        returnKeyType="go"
                        textContentType="emailAddress"
                        value={field.state.value}
                      />
                    </TextField>
                  )}
                </form.Field>

                <Button
                  className="mt-1"
                  isDisabled={isSubmitting}
                  onPress={form.handleSubmit}
                >
                  {isSubmitting ? (
                    <Spinner color="default" size="sm" />
                  ) : (
                    <Button.Label>Send Magic Link</Button.Label>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </form.Subscribe>
    </Surface>
  );
}
