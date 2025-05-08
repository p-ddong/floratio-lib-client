import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"
import { useColorMode } from "./color-mode"

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}
