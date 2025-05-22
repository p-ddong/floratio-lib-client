// src/components/Loading.tsx
"use client"

import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  )
}