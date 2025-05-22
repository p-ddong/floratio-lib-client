// src/app/plants/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store";

import { PlantCard } from "@/components/PlantsComponent/plant-card";
import { Loading } from "@/components/Common/Loading";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PlantFilters } from "@/components/PlantsComponent/plant-filters";

export default function PlantsPage() {
  // const dispatch = useAppDispatch();
  const {
    list,
    attributes,
    families,
    loadingList,
    loadingAttributes,
    loadingFamilies,
  } = useAppSelector((s) => s.plant);

  const [filters, setFilters] = useState({
    search: "",
    family: "",
    attribute: "",
  });

  // 1. Filtered plants
  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return list.filter((p) => {
      // 1. Search: khoa học hoặc common_name[0]
      const sciLower = p.scientific_name.toLowerCase();
      const common0 =
        Array.isArray(p.common_name) && p.common_name.length > 0
          ? p.common_name[0].toLowerCase()
          : "";
      const matchSearch =
        term === "" || sciLower.includes(term) || common0.includes(term);

      // 2. Family: so sánh trực tiếp tên họ
      const matchFamily =
        filters.family === "" || p.family_name === filters.family;

      // 3. Attribute: p.attributes là mảng string
      const matchAttribute =
        filters.attribute === "" || p.attributes.includes(filters.attribute);

      return matchSearch && matchFamily && matchAttribute;
    });
  }, [list, filters]);

  // 2. Pagination state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 28;

  const totalPages = useMemo(
    () => Math.ceil(filtered.length / itemsPerPage),
    [filtered.length]
  );

  // 4. Reset page if filter changes and currentPage out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // 5. Compute paginatedPlants from filtered
  const paginatedPlants = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filtered, currentPage]
  );

  // Sinh mảng pages + ellipsis
  const pages = useMemo<(number | "ellipsis")[]>(() => {
    const arr: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        arr.push(i);
      } else if (
        arr[arr.length - 1] !== "ellipsis" &&
        (i === currentPage - 2 || i === currentPage + 2)
      ) {
        arr.push("ellipsis");
      }
    }
    return arr;
  }, [totalPages, currentPage]);

  if (loadingList || loadingAttributes || loadingFamilies) {
    return <Loading />;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">All Plants</h1>

      <PlantFilters
        families={families.map((f) => ({
          value: f.name,
          label: f.name,
        }))}
        attributes={attributes.map((a) => ({ value: a.name, label: a.name }))}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedPlants.map((plant) => (
          <PlantCard key={plant._id} plant={plant} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Prev */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  // disabled={currentPage === 1}
                  href="#"
                />
              </PaginationItem>

              {/* Page numbers & ellipsis */}
              {pages.map((p, idx) => (
                <PaginationItem key={idx}>
                  {p === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p as number);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  // disabled={currentPage === totalPages}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
