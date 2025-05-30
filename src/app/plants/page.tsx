// src/app/plants/page.tsx
import { Suspense } from "react";
import { fetchFamiliesList, fetchAttributesList } from "@/services/plant.service.server";
import { PlantsSkeleton } from "@/components/PlantsComponent/plants-skeleton";
import PlantsGird from "@/components/PlantsComponent/plants-grid";

export default async function PlantsPage() {
  const [families, attributes] = await Promise.all([
    fetchFamiliesList(),
    fetchAttributesList(),
  ]);

  return (
    <Suspense fallback={<PlantsSkeleton />}>
      <PlantsGird
        families={families}
        attributes={attributes}
      />
    </Suspense>
  );
}
