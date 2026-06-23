"use client";

import { cn } from "@erp-system/ui/lib/utils";
import type { ReactNode } from "react";
import BorderGlow from "./BorderGlow";

interface GlowCardProps {
  backgroundColor?: string;
  borderRadius?: number;
  children: ReactNode;
  className?: string;
  disableCursorFollow?: boolean;
}

/**
 * Wraps content in a styled glow border container.
 *
 * Renders children inside a BorderGlow component with a dark background and glowing border effect.
 * The appearance can be customized through the provided props.
 *
 * @param props.children - React content to render inside the container
 * @param props.backgroundColor - Background color of the container (default: `"#0A0A0A"`)
 * @param props.borderRadius - Border radius in pixels (default: `28`)
 * @param props.className - Additional CSS classes to merge with default styling
 * @param props.disableCursorFollow - Disable the cursor-following glow effect (default: `false`)
 */
export function GlowCard({
  children,
  className,
  borderRadius = 28,
  backgroundColor = "#0A0A0A",
  disableCursorFollow = false,
}: GlowCardProps) {
  return (
    <BorderGlow
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      className={cn("overflow-hidden px-2 py-8", className)}
      showDefaultGlow
      disableCursorFollow={disableCursorFollow}
    >
      {children}
    </BorderGlow>
  );
}
