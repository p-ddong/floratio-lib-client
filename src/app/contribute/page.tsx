import { Suspense } from "react";
import { ContributionFilters } from "@/components/ContributeComponent/contribution-filters";
import { ContributionsList } from "@/components/ContributeComponent/contributions-list";
import { ContributionsListSkeleton } from "@/components/ContributeComponent/contributions-list-skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contribute | Plant Library",
  description:
    "Contribute to our plant database by adding new species or updating existing ones",
};

// Kiểu search-params tuỳ ý của bạn
type SearchParams = {
  status?: string;
};

export default async function ContributePage({
  searchParams,
}: {
  // 👇 Quan trọng: Promise
  searchParams: Promise<SearchParams>;
}) {
  // Giải bất đồng bộ
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status } = await searchParams;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contribute</h1>
          <p className="text-muted-foreground">
            Help grow our plant database by adding new species or updating
            existing ones
          </p>
        </div>

        <Button asChild>
          <Link href="/contribute/new" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Contribution
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <ContributionFilters />

      {/* List */}
      <div className="mt-8">
        <Suspense fallback={<ContributionsListSkeleton />}>
          <ContributionsList />
        </Suspense>
      </div>
    </div>
  );
}
