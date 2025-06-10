// app/search/page.tsx
import { Metadata } from "next"
import { PlantImageSearch } from "../../components/SearchPlantComponent/plant-image-search"

/**
 * (Tuỳ chọn) SEO metadata cho trang Search
 */
export const metadata: Metadata = {
  title: "Plant Identifier – Search",
  description: "Tải lên hình để nhận dạng loài cây với Floratio",
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Component client-side của bạn */}
      <PlantImageSearch />
    </main>
  )
}
