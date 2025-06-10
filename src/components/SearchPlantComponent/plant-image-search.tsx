"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Search, Leaf, Camera, X, Info, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CloudImage } from "@/components/Common/CloudImage"

interface PlantResult {
  id: string
  name: string
  scientificName: string
  family: string
  description: string
  habitat: string
  bloomTime: string
  confidence: number
  image: string
}

export function PlantImageSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<PlantResult[]>([])

  // Mock search results
  const mockResults: PlantResult[] = [
    {
      id: "1",
      name: "Hoa Hồng",
      scientificName: "Rosa rubiginosa",
      family: "Rosaceae",
      description: "Hoa hồng là loài hoa được yêu thích nhất, có nhiều màu sắc và hương thơm đặc trưng.",
      habitat: "Vùng ôn đới, đất thoát nước tốt",
      bloomTime: "Mùa xuân - Thu",
      confidence: 95,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Cây Lá Bạc",
      scientificName: "Leucophyllum frutescens",
      family: "Plantaginaceae",
      description: "Cây bụi nhỏ có lá màu bạc và hoa tím nhỏ, thích hợp với khí hậu khô.",
      habitat: "Vùng sa mạc, đất cát",
      bloomTime: "Mùa hè - Thu",
      confidence: 87,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "Cây Xương Rồng",
      scientificName: "Opuntia ficus-indica",
      family: "Cactaceae",
      description: "Cây xương rồng có khả năng chịu hạn tốt, thân và lá dày chứa nhiều nước.",
      habitat: "Vùng khô hạn, sa mạc",
      bloomTime: "Mùa hè",
      confidence: 92,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSearch = async () => {
    if (!selectedImage) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 2000)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setSearchResults([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl font-bold text-gray-900">Plant Identifier</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a photo of the plant to identify the species and learn more about it
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload image
              </CardTitle>
              <CardDescription>Drag & drop an image here</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedImage ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Kéo thả ảnh vào đây</p>
                  <p className="text-gray-500 mb-4">Or</p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose a file from your computer
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="text-sm text-gray-400 mt-4">Supported: JPG, PNG, GIF (up to 10 MB)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <CloudImage
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected plant"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clearImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang nhận dạng...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Nhận dạng cây
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Kết quả nhận dạng
                </CardTitle>
                <CardDescription>Tìm thấy {searchResults.length} kết quả phù hợp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {searchResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <CloudImage
                        src={result.image || "/placeholder.svg"}
                        alt={result.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{result.name}</h3>
                          <Badge variant={result.confidence > 90 ? "default" : "secondary"} className="ml-2">
                            {result.confidence}% tin cậy
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 italic">{result.scientificName}</p>
                        <Badge variant="outline">{result.family}</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{result.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">
                          <strong>Môi trường sống:</strong> {result.habitat}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-600">
                          <strong>Thời gian ra hoa:</strong> {result.bloomTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {searchResults.length === 0 && selectedImage && !isSearching && (
            <Card>
              <CardContent className="text-center py-8">
                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Press “Identify plant” to start searching</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
