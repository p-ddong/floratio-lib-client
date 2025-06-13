// src/components/PlantsComponent/plant-card.tsx
"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlantList } from "@/types"
import { CloudImage } from "@/components/Common/CloudImage"
import { useAppSelector } from "@/store"
import { BookMarked } from "lucide-react"

interface PlantCardProps {
  plant: PlantList
}

export function PlantCard({ plant }: PlantCardProps) {  
  const markList = useAppSelector((state) => state.mark.list)
  const isMarked = markList.some((m)=>m.plant._id === plant._id)
  return (
    <Link href={`/plants/${plant._id}`}>
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md py-0! justify-between">
        {/* Hình vuông 1:1 */}
                {plant.image ? (
          <div className="relative">
            <CloudImage
            src={plant.image}
            alt={plant.scientific_name}
          />
          {isMarked && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                <BookMarked className="h-3 w-3 mr-1 fill-current" />
                Bookmarked
              </Badge>
            </div>
          )}
          </div>
        ) : (
          <div className="relative w-full aspect-square bg-gray-200 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        

        <CardHeader className="p-4 pt-3">
          <h2 className="font-bold text-lg">{plant.scientific_name}</h2>
          <p className="text-sm italic text-muted-foreground">
            {Array.isArray(plant.common_name) && plant.common_name.length > 0
              ? plant.common_name[0]
              : "No common name yet"}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {plant.attributes.slice(0, 4).map((attr) => (
              <Badge key={attr} variant="outline" className="bg-primary/10">
                {attr}
              </Badge>
            ))}
            {plant.attributes.length > 4 && (
              <span className="text-sm text-muted-foreground">
                {plant.attributes.length - 4} more
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-2 flex justify-between">
          <span className="text-sm text-muted-foreground">
            {plant.family}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
