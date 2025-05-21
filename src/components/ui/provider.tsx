"use client";

import type { ReactNode } from "react";
import { ColorModeProvider } from "./color-mode";

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return <ColorModeProvider>{children}</ColorModeProvider>;
}