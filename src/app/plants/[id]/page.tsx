// app/plants/[id]/page.tsx
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { PlantDetailView } from "@/components/PlantsComponent/plant-detail-view"
import { PlantDetailSkeleton } from "@/components/PlantsComponent/plant-detail-skeleton"
import { fetchPlantDetail } from "@/services/plant.service.server"
import { PlantDetail } from "@/types/plant.types"

interface PlantPageProps {
  /** Next.js 15: params is now a Promise */
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PlantPageProps): Promise<Metadata> {
  /** Giải quyết Promise trước khi dùng */
  const { id } = await params;
  try {
    const plant = await fetchPlantDetail(id);
    if (!plant) throw new Error("Not found")
    return {
      title: `${plant.scientific_name} | Plant Library`,
      description: `Tìm hiểu về ${plant.scientific_name} (${plant.common_name[0] || "Chưa có tên chung"})`,
    }
  } catch {
    return {
      title: "Plant Not Found",
      description: "Loài cây này không tồn tại",
    }
  }
}

export default async function PlantDetailPage({ params }: PlantPageProps) {
  const { id } = await params;
  return (
    <div className="p-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/plants" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Species
          </Link>
        </Button>
      </div>

      {/* Suspense: show skeleton trong khi chờ dữ liệu */}
      <Suspense fallback={<PlantDetailSkeleton />}>
        {/* PlantDetailContent là Server Component */}
        <PlantDetailContent id={id} />
      </Suspense>
    </div>
  )
}

// Tách riêng phần content để fetch và render PlantDetailView
async function PlantDetailContent({ id }: { id: string }) {
  let plant: PlantDetail | null = null
  try {
    plant = await fetchPlantDetail(id)
  } catch {
    plant = null
  }
  if (!plant) {
    notFound()
  }
  // PlantDetailView là Client Component
  return <PlantDetailView plant={plant!} plantId={id} />
}
