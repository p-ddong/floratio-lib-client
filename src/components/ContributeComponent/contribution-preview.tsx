"use client"

import Image from "next/image"
import { CloudImage } from "@/components/Common/CloudImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Loader2, Save } from "lucide-react"

interface SpeciesDetail {
  label: string
  content: string
}

interface SpeciesSection {
  section: string
  details: SpeciesDetail[]
  isCustom?: boolean
}

interface ImageData {
  id: string
  type: "file" | "url"
  file?: File
  url?: string
  preview: string
  name: string
}

interface ContributionPreviewProps {
  // Form data
  scientificName: string
  familyName: string
  contributionType: "create" | "update"
  commonNames: string[]
  attributes: string[]
  speciesDescription: SpeciesSection[]
  uploadedImages: ImageData[]

  // Actions
  onBackToEdit: () => void
  onSaveDraft: () => void
  onSubmit: () => void

  // States
  isDraft: boolean
  isSubmitting: boolean
}

export function ContributionPreview({
  scientificName,
  familyName,
  contributionType,
  commonNames,
  attributes,
  speciesDescription,
  uploadedImages,
  onBackToEdit,
  onSaveDraft,
  onSubmit,
  isDraft,
  isSubmitting,
}: ContributionPreviewProps) {
  const mainImage = uploadedImages[0]?.preview || "https://res.cloudinary.com/dt2yslzqx/image/upload/v1749395108/plants/rbekx9uyuug2vvoeqtsy.jpg"

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBackToEdit} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Edit
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveDraft} disabled={isDraft}>
            {isDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Contribution
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        {/* Main Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <CloudImage
            src={mainImage || "/placeholder.svg"}
            alt={scientificName || "Plant preview"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-background/80">
              {contributionType === "create" ? "New Plant" : "Update"}
            </Badge>
          </div>
          {uploadedImages.length > 1 && (
            <div className="absolute bottom-4 right-4">
              <Badge variant="outline" className="bg-background/80">
                +{uploadedImages.length - 1} more photos
              </Badge>
            </div>
          )}
        </div>

        {/* Plant Information */}
        <CardHeader>
          <CardTitle className="text-2xl italic">{scientificName || "Scientific Name"}</CardTitle>
          <CardDescription className="text-lg">
            {commonNames.length > 0 ? commonNames.join(", ") : "Common names will appear here"}
          </CardDescription>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Family:</span>
            <span className="font-medium">{familyName || "Family name"}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Gallery Preview */}
          {uploadedImages.length > 1 && (
            <div>
              <h3 className="font-semibold mb-3">Image Gallery ({uploadedImages.length} photos)</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {uploadedImages.slice(1, 9).map((image, index) => (
                  <div key={image.id} className="relative aspect-square">
                    <Image
                      src={image.preview || "/placeholder.svg"}
                      alt={`${scientificName} - Image ${index + 2}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                    />
                    <div className="absolute top-1 right-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          image.type === "file"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {image.type === "file" ? "F" : "U"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {uploadedImages.length > 9 && (
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{uploadedImages.length - 9}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Species Description */}
          {speciesDescription.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Species Description</h3>
              <div className="space-y-4">
                {speciesDescription.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium text-lg">{section.section}</h4>
                      {section.isCustom && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {section.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <span className="font-medium text-sm">{detail.label}:</span>
                          <span className="text-sm text-muted-foreground md:col-span-2">{detail.content}</span>
                        </div>
                      ))}
                      {section.details.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No details added yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attributes */}
          {attributes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {attributes.map((attribute, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {attribute}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Contribution Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{uploadedImages.length}</div>
                <div className="text-xs text-muted-foreground">Images</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{commonNames.length}</div>
                <div className="text-xs text-muted-foreground">Common Names</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{attributes.length}</div>
                <div className="text-xs text-muted-foreground">Attributes</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{speciesDescription.length}</div>
                <div className="text-xs text-muted-foreground">Sections</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
