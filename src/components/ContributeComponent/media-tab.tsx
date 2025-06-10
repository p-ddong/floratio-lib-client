"use client"

import type React from "react"

import { useRef, useState } from "react"
import { CloudImage } from "@/components/Common/CloudImage"
import { Upload, Eye, Plus, X, AlertCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageData {
  id: string
  type: "file" | "url"
  file?: File
  url?: string
  preview: string
  name: string
}

interface MediaTabProps {
  uploadedImages: ImageData[]
  setUploadedImages: React.Dispatch<React.SetStateAction<ImageData[]>>
}

export function MediaTab({ uploadedImages, setUploadedImages }: MediaTabProps) {
  const [urlInput, setUrlInput] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const files = event.target.files

    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select valid image files only")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`${file.name} is too large. Please select images under 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage: ImageData = {
          id: generateId(),
          type: "file",
          file,
          preview: reader.result as string,
          name: file.name,
        }
        setUploadedImages((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addUrlImage = () => {
    if (!urlInput.trim()) return

    try {
      new URL(urlInput)
      const newImage: ImageData = {
        id: generateId(),
        type: "url",
        url: urlInput.trim(),
        preview: urlInput.trim(),
        name: `Image from URL`,
      }
      setUploadedImages((prev) => [...prev, newImage])
      setUrlInput("")
    } catch {
      setUploadError("Please enter a valid URL")
    }
  }

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      const [removed] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, removed)
      return newImages
    })
  }

  return (
    <CardContent className="space-y-6 pb-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-4">Plant Images</h3>

          {/* Upload Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* File Upload */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <label className="text-sm font-medium">Upload from Device</label>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Select multiple images (JPEG, PNG, WebP • Max 5MB each)</p>
              </div>
            </Card>

            {/* URL Input */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <label className="text-sm font-medium">Add from URL</label>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/plant-image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addUrlImage()
                      }
                    }}
                  />
                  <Button type="button" onClick={addUrlImage} size="sm" disabled={!urlInput.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Add images from web URLs</p>
              </div>
            </Card>
          </div>

          {/* Error Display */}
          {uploadError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Images Grid */}
          {uploadedImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</h4>
                <p className="text-xs text-muted-foreground">Drag to reorder • First image will be the main photo</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative group border rounded-lg overflow-hidden bg-muted"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", index.toString())
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const fromIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                      if (fromIndex !== index) {
                        reorderImages(fromIndex, index)
                      }
                    }}
                  >
                    {/* Main Image Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge variant="default" className="text-xs bg-green-600">
                          Main
                        </Badge>
                      </div>
                    )}

                    {/* Image Type Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          image.type === "file"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {image.type === "file" ? "File" : "URL"}
                      </Badge>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2 z-10 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>

                    {/* Image */}
                    <div className="aspect-square relative">
                      <CloudImage
                        src={image.preview || "/placeholder.svg"}
                        alt={image.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>

                    {/* Image Info */}
                    <div className="p-2 bg-background">
                      <p className="text-xs font-medium truncate">{image.name}</p>
                      {image.type === "file" && image.file && (
                        <p className="text-xs text-muted-foreground">{Math.round(image.file.size / 1024)} KB</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {uploadedImages.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-2">No images uploaded yet</p>
              <p className="text-sm text-muted-foreground">Upload files or add URLs to get started</p>
            </div>
          )}
        </div>

        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            <strong>Image Guidelines:</strong> {`Upload high-quality images that clearly show the plant's characteristics.
            The first image will be used as the main photo. You can drag images to reorder them. Supported formats:
            JPEG, PNG, WebP (max 5MB each).`}
          </AlertDescription>
        </Alert>
      </div>
    </CardContent>
  )
}
