// app/contribute/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ContributionEditView } from "@/components/ContributeComponent/contribution-edit-view"
import { ContributionDetailSkeleton } from "@/components/ContributeComponent/contribution-detail-skeleton"
import { ContributionDetail } from "@/types"

export default function EditContributionPage() {
  // ﹤-- params từ dynamic segment
  const { id } = useParams() as { id: string }

  const [contribution, setContribution] = useState<ContributionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("contributionData")
      if (raw) {
        const cached = JSON.parse(raw)

        // Nếu bạn lưu nhiều bản, kiểm tra _id cho chắc
        if (!cached?._id || cached._id === id) {
          setContribution(cached)
        }
      }
    } catch (err) {
      console.error("Không đọc được contributionData:", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  return (
    <div className="py-8 px-4">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/contribute/${id}`} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Contribution
        </Link>
      </Button>

      {loading && <ContributionDetailSkeleton />}

      {!loading && !contribution && (
        <p className="text-muted-foreground">
          Không tìm thấy dữ liệu contribution trong <code>sessionStorage</code>.
        </p>
      )}

      {contribution && <ContributionEditView contribution={contribution} />}
    </div>
  )
}
