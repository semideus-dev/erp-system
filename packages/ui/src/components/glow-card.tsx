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
