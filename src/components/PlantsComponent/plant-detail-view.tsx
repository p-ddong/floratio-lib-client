// src/components/plant-detail-view.tsx
"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlantDetail } from "@/types/plant.types"
import { CloudImage } from "@/components/Common/CloudImage"

interface PlantDetailViewProps {
  plant: PlantDetail
}

export function PlantDetailView({ plant }: PlantDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % plant.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + plant.images.length) % plant.images.length)
  }

  const descriptionSections = plant.species_description.filter(
    (section) => !section.section.toLowerCase().includes("care") && !section.section.toLowerCase().includes("variet"),
  )

  const careSections = plant.species_description.filter((section) => section.section.toLowerCase().includes("care"))

  const varietySections = plant.species_description.filter((section) =>
    section.section.toLowerCase().includes("variet"),
  )

  return (
    <div className="space-y-8">
      {/* Plant Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold italic">{plant.scientific_name}</h1>
        <div className="flex flex-wrap gap-2">
          {plant.common_name.map((name, index) => (
            <span key={index} className="text-xl text-muted-foreground">
              {name}
              {index < plant.common_name.length - 1 && ","}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Column - Images and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden py-0">
            <div className="relative">
              <CloudImage
                src={plant.images[currentImageIndex] || "/placeholder.svg?height=600&width=600"}
                alt={plant.scientific_name}
              />

              {plant.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">Next image</span>
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {plant.images.length > 1 && (
              <div className="flex overflow-x-auto p-2 gap-2">
                {plant.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                      currentImageIndex === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100",
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <CloudImage
                      src={image || "/placeholder.svg?height=64&width=64"}
                      alt={`${plant.scientific_name} thumbnail ${index + 1}`}
                      className="rounded-md"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Plant Details Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Taxonomy</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <span className="text-muted-foreground">Family:</span>
                  <span className="font-medium">{plant.family.name}</span>
                  <span className="text-muted-foreground">Scientific Name:</span>
                  <span className="font-medium italic">{plant.scientific_name}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {plant.attributes.map((attribute) => (
                    <Badge key={attribute._id} variant="outline" className="bg-primary/10">
                      {attribute.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Wikipedia
                  </a>
                </Button>
              </div>
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

            {/* Description Tab */}
            <TabsContent value="description" className="mt-6">
              {descriptionSections.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {descriptionSections.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`}>
                      <AccordionTrigger className="text-xl font-semibold">{section.section}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {section.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="space-y-2">
                              <h4 className="font-medium text-lg">{detail.label}</h4>
                              <p className="text-muted-foreground">{detail.content}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground italic">No description information available.</p>
                </div>
              )}
            </TabsContent>

            {/* Care Guide Tab */}
            <TabsContent value="care" className="mt-6">
              {careSections.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {careSections.map((section, index) => (
                    <AccordionItem key={index} value={`care-${index}`}>
                      <AccordionTrigger className="text-xl font-semibold">{section.section}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {section.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="space-y-2">
                              <h4 className="font-medium text-lg">{detail.label}</h4>
                              <p className="text-muted-foreground">{detail.content}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground italic">No care guide information available yet.</p>
                </div>
              )}
            </TabsContent>

            {/* Varieties Tab */}
            <TabsContent value="varieties" className="mt-6">
              {varietySections.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {varietySections.map((section, index) => (
                    <AccordionItem key={index} value={`variety-${index}`}>
                      <AccordionTrigger className="text-xl font-semibold">{section.section}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {section.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="space-y-2">
                              <h4 className="font-medium text-lg">{detail.label}</h4>
                              <p className="text-muted-foreground">{detail.content}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground italic">
                    Information about varieties and cultivars will be added soon.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>

  )
}
