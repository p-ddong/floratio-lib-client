"use client";

import type React from "react";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Search,
  Leaf,
  Camera,
  X,
  // Info,
  // MapPin,
  // Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { CloudImage } from "@/components/Common/CloudImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RawPrediction } from "@/types";
import { fetchPrediction, getPlantsPrediction } from "@/services/plant.service";
import Link from "next/link";


interface PlantResult {
  _id: string;
  scientific_name: string;
  confidence: number;
  image: string;
  common_name: string[]
}

/* =======================
   Component: ResultCard
   ======================= */
function ResultCard({ result }: { result: PlantResult }) {
  return (
    <Link href={`/plants/${result._id}`}>
      <Card key={result._id} className="overflow-hidden bg-white shadow-sm">
      <CardContent className="p-0">
        {/* Top section */}
        <div className="flex p-4">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <CloudImage
              src={result.image || "/placeholder.svg"}
              alt={result.common_name[0] || result.scientific_name}
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 ml-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {result.common_name[0]}
                </h3>
                <p className="text-gray-600 italic text-sm">
                  {result.scientific_name}
                </p>
              </div>
              <Badge
                variant={result.confidence > 90 ? "default" : "secondary"}
                className="ml-2"
              >
                {result.confidence.toFixed(1)}% confidence
              </Badge>
            </div>

            {/* Confidence bar */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600">Độ tin cậy:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {result.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${Math.min(result.confidence, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
    </Link>
  );
}

export function PlantImageSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PlantResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleSelect = () => fileInputRef.current?.click();

  /* -------- mock data + handlers (giữ nguyên logic cũ) -------- */

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

const handleSearch = async () => {
  if (!selectedFile) return;      // dùng File, không dùng string preview
  setIsSearching(true);

  try {
    const raw: RawPrediction[] = await fetchPrediction(selectedFile);
    const scientific_names = raw.map((r)=>r.name)
    const plantsPredict = await getPlantsPrediction(scientific_names);
    const confMap = new Map(raw.map(r => [r.name, r.confidence]));

    const result: PlantResult[] = plantsPredict
      .map((p) => ({
        ...p,
        confidence: Math.round(confMap.get(p.scientific_name) ?? 0), // làm tròn, tùy ý
      }))
      .sort((a, b) => b.confidence - a.confidence); // ⬅️ sắp xếp giảm dần

    setSearchResults(result);

  } catch (err) {
    console.error("Predict error:", err);
    // TODO: toast
  } finally {
    setIsSearching(false);
  }
};

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setSearchResults([]);
  };

  /* ================= render ================= */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl font-bold text-gray-900">Plant Identifier</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a photo of the plant to identify the species and learn more
          about it
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload section – không đổi logic */}
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
                    isDragging
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop images here
                  </p>
                  <p className="text-gray-500 mb-4">Or</p>
                  <Button variant="outline" onClick={handleSelect}>
                    Choose a file from your computer
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <p className="text-sm text-gray-400 mt-4">
                    Supported: JPG, PNG, GIF (up to 10 MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <CloudImage
                      src={selectedImage}
                      alt="Selected plant"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="w-full"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Identifying…
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Tree identification
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results section – NEW layout */}
        <div className="space-y-6">
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Identification results
                </CardTitle>
                <CardDescription>
                  Found {searchResults.length} matching results
                </CardDescription>
              </CardHeader>
              <ScrollArea className="h-[55vh]">
                <CardContent className="space-y-6">
                  {searchResults.map((r) => (
                      <ResultCard key={r._id} result={r} /> 
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          )}

          {searchResults.length === 0 && selectedImage && !isSearching && (
            <Card>
              <CardContent className="text-center py-8">
                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Press “Identify plant” to start searching
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
