"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ContributionStatus, ContributionType } from "@/types";

export interface ContributionFiltersProps {
  /** Optional callback khi filter thay đổi */
  onChange?: (filters: {
    status: ContributionStatus | "all";
    type: ContributionType | "all";
    search: string;
  }) => void;
}

export function ContributionFilters({ onChange }: ContributionFiltersProps) {
  const [status, setStatus] = useState<ContributionStatus | "all">("all");
  const [type, setType] = useState<ContributionType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // notify parent if needed
  const emit = (
    next: Partial<{ status: string; type: string; search: string }> = {}
  ) => {
    const current = {
      status,
      type,
      search: searchQuery,
      ...next,
    } as {
      status: ContributionStatus | "all";
      type: ContributionType | "all";
      search: string;
    };
    onChange?.(current);
  };

  return (
    <div className="space-y-4">
      {/* ---------- Search & Type buttons ---------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contributions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              emit({ search: e.target.value });
            }}
            className="pl-10"
          />
        </div>

        {/* type */}
        <div className="flex gap-2">
          <Button
            variant={type === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setType("all");
              emit({ type: "all" });
            }}
            className="flex-1 sm:flex-none"
          >
            All Types
          </Button>
          <Button
            variant={type === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setType("new");
              emit({ type: "new" });
            }}
            className="flex-1 sm:flex-none"
          >
            New Plants
          </Button>
          <Button
            variant={type === "update" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setType("update");
              emit({ type: "update" });
            }}
            className="flex-1 sm:flex-none"
          >
            Updates
          </Button>
        </div>
      </div>

      {/* ---------- Status tabs ---------- */}
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => {
          setStatus(value as ContributionStatus | "all");
          emit({ status: value });
        }}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}