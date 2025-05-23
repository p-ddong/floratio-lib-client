import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PlantDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Plant Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Column - Images and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery Skeleton */}
          <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="flex overflow-x-auto p-2 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-16 flex-shrink-0 rounded-md" />
              ))}
            </div>
          </Card>

          {/* Plant Details Card Skeleton */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Description */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="care">Care Guide</TabsTrigger>
              <TabsTrigger value="varieties">Varieties</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6 mt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
