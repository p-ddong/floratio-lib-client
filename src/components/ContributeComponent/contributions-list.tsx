"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { getContributions } from "@/store/contributeSlice";
import { ContributionsListSkeleton } from "./contributions-list-skeleton";
import { CloudImage } from "@/components/Common/CloudImage";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import type { Contribution } from "@/types";

export function ContributionsList() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.contribute);
  const token = useAppSelector((s) => s.auth.token);

  // fetch once token ready
  useEffect(() => {
    if (token) dispatch(getContributions());
  }, [token, dispatch]);

  // read filters from URL
  const params = useSearchParams();
  const status = params.get("status") ?? "all";
  const type = params.get("type") ?? "all";
  const q = (params.get("q") ?? "").trim().toLowerCase();

  // apply filters
  let contributions: Contribution[] = list;
  if (status !== "all") contributions = contributions.filter((c) => c.status === status);
  if (type !== "all") contributions = contributions.filter((c) => (c.type ?? "new") === type);
  if (q) {
    contributions = contributions.filter((c) => {
      const text = `${c.contribute_plant.scientific_name} ${c.user.username}`.toLowerCase();
      return text.includes(q);
    });
  }

  if (loading) return <ContributionsListSkeleton />;

  if (!contributions.length)
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No contributions found</h3>
        <p className="text-muted-foreground mb-6">
          Start contributing to our plant database today!
        </p>
        <Button asChild>
          <Link href="/contribute/new">Create Your First Contribution</Link>
        </Button>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contributions.map((c) => (
        <Card key={c._id} className="overflow-hidden flex flex-col pt-0">
          {/* ---------- IMAGE + BADGES ---------- */}
          <div className="relative h-48 w-full">
            <CloudImage
              src={c.contribute_plant.image || "/placeholder.svg?height=200&width=400"}
              alt={c.contribute_plant.scientific_name}
              className="h-full w-full object-cover"
            />

            {/* status badge (top‑right) */}
            <div className="absolute top-2 right-2">
              <StatusBadge status={c.status} />
            </div>

            {/* type badge (top‑left) */}
            {c.type && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-background/80 capitalize">
                  {c.type === "new" ? "New Plant" : "Update"}
                </Badge>
              </div>
            )}
          </div>

          {/* ---------- HEADER ---------- */}
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg font-bold italic">
              {c.contribute_plant.scientific_name}
            </CardTitle>
            <CardDescription>
              {c.contribute_plant.common_name.slice(0, 2).join(", ")}
              {c.contribute_plant.common_name.length > 2 && "..."}
            </CardDescription>
          </CardHeader>

          {/* ---------- CONTENT ---------- */}
          <CardContent className="p-4 pt-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {c.contribute_plant.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.contribute_plant.attributes.slice(0, 3).map((attr, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {attr}
                </Badge>
              ))}
              {c.contribute_plant.attributes.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{c.contribute_plant.attributes.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>

          {/* ---------- FOOTER ---------- */}
          <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm border-t mt-auto">
            <div className="text-muted-foreground">
              By <span className="font-medium">{c.user.username}</span> •{" "}
              {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/contribute/${c._id}`} className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                View
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

/** Badge hiển thị trạng thái */
function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const variants: Record<string, string> = {
    pending: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    approved: "bg-green-500/50 text-green-900 border-green-600",
    rejected: "bg-red-500/50 text-red-900 border-red-600",
  };

  const labels: Record<string, string> = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} capitalize`}>
      {labels[status]}
    </Badge>
  );
}
