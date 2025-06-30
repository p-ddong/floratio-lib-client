"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ContributionStatus, ContributionType } from "@/types";

export function ContributionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  /* ---------- local state (khởi tạo từ URL để đồng bộ) ---------- */
  const [status, setStatus] = useState<ContributionStatus | "all">(
    (searchParams.get("status") as ContributionStatus) ?? "all"
  );
  const [type, setType] = useState<ContributionType | "all">(
    (searchParams.get("type") as ContributionType) ?? "all"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") ?? ""
  );

  /* -------------------------------------------------------------- */
  /** Ghi đè (hoặc xóa) param rồi push lên URL */
  const updateURL = (next: Partial<{ status: string; type: string; q: string }>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.status !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.status === "all" ? params.delete("status") : params.set("status", next.status);
    }
    if (next.type !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.type === "all" ? params.delete("type") : params.set("type", next.type);
    }
    if (next.q !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.q.trim() ? params.set("q", next.q.trim()) : params.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  /* -------------------------------------------------------------- */
  return (
    <div className="space-y-4">
      {/* ---------- Search + Type ---------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* search box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contributions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateURL({ q: e.target.value });
            }}
            className="pl-10"
          />
        </div>

        {/* type buttons */}
        <div className="flex gap-2">
          {(["all", "create", "update"] as const).map((t) => (
            <Button
              key={t}
              variant={type === t ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setType(t);
                updateURL({ type: t });
              }}
              className="flex-1 sm:flex-none capitalize"
            >
              {t === "all" ? "All Types" : t === "create" ? "New Plants" : "Updates"}
            </Button>
          ))}
        </div>
      </div>

      {/* ---------- Status tabs ---------- */}
      <Tabs
        value={status}
        className="w-full"
        onValueChange={(val) => {
          setStatus(val as ContributionStatus | "all");
          updateURL({ status: val });
        }}
      >
        <TabsList className="grid w-full grid-cols-4">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
