"use client";

import { useMounted } from "@/hook/useMounted";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import type { ReactNode } from "react";

interface ColorModeProviderProps {
  children: ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

// Hook to access current color mode and setter
export function useColorMode() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return { colorMode: undefined, setColorMode: () => {} };
  }

  const colorMode = theme === "dark" ? "dark" : "light";

  return {
    colorMode,
    setColorMode: (mode: "light" | "dark") => setTheme(mode),
  };
}

export function ColorModeToggle() {
  const { colorMode, setColorMode } = useColorMode();
  if (!colorMode) return null;

  const isDark = colorMode === "dark";

  return (
    <Button
      variant="ghost"
      onClick={() => setColorMode(isDark ? "light" : "dark")}
      aria-label="Toggle color mode"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
