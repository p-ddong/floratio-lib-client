"use client";

import { useEffect, useState, useCallback } from "react";
import { PlantCard } from "./plant-card";
import { PlantFilters } from "./plant-filters";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import type { PlantList, Family, Attribute } from "@/types";
import { fetchPlantPagination } from "@/services/plant.service";
import { PlantsSkeleton } from "./plants-skeleton";

interface Props {
  families:   Family[];
  attributes: Attribute[];
}

export default function PlantsGird({ families, attributes }: Props) {
  /* ---------- filters & phân trang ---------- */
  const [filters, setFilters]     = useState({ search: "", family: "", attribute: "" });
  const [page,    setPage]        = useState(1);

  /* ---------- dữ liệu ---------- */
  const [plants,      setPlants]      = useState<PlantList[]>([]);
  const [totalPages,  setTotalPages]  = useState(1);
  const [pageSize,    setPageSize]    = useState(28);   // fallback
  // const [totalItems,    setTotalItems]    = useState(0);
  const [loading,     setLoading]     = useState(true);

  const loadPlants = useCallback(async () => {
    setLoading(true);
    const res = await fetchPlantPagination({
      page,
      limit: pageSize,               // pageSize hiện tại
      search: filters.search,
      family: filters.family,
      attributes: filters.attribute,
    });
    setPlants(res.data);
    setTotalPages(res.totalPages);
    setPageSize(res.pageSize);       // luôn đồng bộ với server
    setLoading(false);
    // setTotalItems(res.totalItems)
  }, [page, filters, pageSize]);

  const handleFilterChange = useCallback(
  (f: { search: string; family: string; attribute: string }) => {
    setFilters(f);
    setPage(1);           // reset về trang đầu khi đổi bộ lọc
  },
  []                      // không phụ thuộc state thay đổi liên tục
);

  useEffect(() => { loadPlants(); }, [loadPlants]);

  // Nếu filter mới khiến page vượt quá totalPages → reset
  useEffect(() => { if (page > totalPages) setPage(1); }, [page, totalPages]);

  /* ---------- render ---------- */
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">All Plants</h1>

      <PlantFilters
        families={families.map((f) => ({ value: f._id, label: f.name }))}
        attributes={attributes.map((a) => ({ value: a._id, label: a.name }))}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <PlantsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((plant) => <PlantCard key={plant._id} plant={plant} />)}
          {plants.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              Không tìm thấy cây phù hợp
            </p>
          )}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setPage(Math.max(1, page - 1))} />
              </PaginationItem>

              {/* 1 … p-1 p p+1 … last */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((out, p, idx, arr) => {
                  if (idx && p - (arr[idx - 1] as number) > 1) out.push("…");
                  out.push(p);
                  return out;
                }, [])
                .map((p, i) => (
                  <PaginationItem key={i}>
                    {p === "…" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => { e.preventDefault(); setPage(p); }}
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext href="#" onClick={() => setPage(Math.min(totalPages, page + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
