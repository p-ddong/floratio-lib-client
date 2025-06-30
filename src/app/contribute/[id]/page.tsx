/* app/contribute/[id]/page.tsx */
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ContributionDetailSkeleton } from '@/components/ContributeComponent/contribution-detail-skeleton'
import { ContributionDetailView } from '@/components/ContributeComponent/contribution-detail-view'
import { fetchContributeDetail } from '@/services/contribute.service'
import type { ContributionDetail } from '@/types'

export default function ContributionDetailPage () {
  /* 🆕 Lấy id từ URL bằng useParams */
  const params = useParams()                          // { id: '...' }
  const id = (params?.id as string) ?? ''             // ép kiểu đơn giản
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [contribution, setContribution] =
    useState<ContributionDetail | null>(null)

  /* Gọi API khi id thay đổi */
  useEffect(() => {
    if (!id) return
    let ignore = false

    ;(async () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('token') ?? ''
            : ''

        const data = await fetchContributeDetail(id, token)
        if (!ignore) setContribution(data)
      } catch {
        router.replace('/404')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [id, router])

  /* Render */
  return (
    <div className='p-8'>
      <Button variant='ghost' size='sm' asChild className='mb-6'>
        <Link href='/contribute' className='flex items-center'>
          <ChevronLeft className='mr-2 h-4 w-4' />
          Back to Contributions
        </Link>
      </Button>

      {loading && <ContributionDetailSkeleton />}
      {!loading && contribution && (
        <ContributionDetailView contribution={contribution} />
      )}
      {!loading && !contribution && (
        <p className='text-center text-muted-foreground'>
          Contribution not found.
        </p>
      )}
    </div>
  )
}
