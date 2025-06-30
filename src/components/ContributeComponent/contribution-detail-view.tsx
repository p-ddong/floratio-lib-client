"use client";

import { useState } from "react";
import { CloudImage } from "../Common/CloudImage";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  MessageSquare,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ContributionDetail } from "@/types";
import Link from "next/link";
import { useAppSelector } from "@/store";

interface ContributionDetailViewProps {
  contribution: ContributionDetail;
}

export function ContributionDetailView({
  contribution,
}: ContributionDetailViewProps) {
  // Combine existing images with new images for display
  const allImages = [
    ...contribution.data.plant.images,
    ...(contribution.data.new_images || []),
  ];

  const user = useAppSelector((state) => state.auth.user)
  const canEdit = user?._id === contribution.c_user._id && contribution.status !== "approved"
  

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-700 border-green-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-700 border-red-500/50";
      default:
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/50";
    }
  };

  const getImageBadge = (index: number) => {
    const existingImagesCount = contribution.data.plant.images.length;
    if (index < existingImagesCount) {
      return (
        <Badge
          variant="outline"
          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
        >
          Existing
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="text-xs bg-green-50 text-green-700 border-green-200"
        >
          <Plus className="h-3 w-3 mr-1" />
          New
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold italic">
              {contribution.data.plant.scientific_name}
            </h1>
            <Badge
              variant="outline"
              className={getStatusColor(contribution.status)}
            >
              {getStatusIcon(contribution.status)}
              <span className="ml-1 capitalize">{contribution.status}</span>
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {contribution.type === "create" ? "New Plant" : "Update"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {contribution.data.plant.common_name.map((name, index) => (
              <span key={index} className="text-xl text-muted-foreground">
                {name}
                {index < contribution.data.plant.common_name.length - 1 && ","}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Family:</span>
            <span className="font-medium">
              {contribution.data.plant.family.name}
            </span>
          </div>
          {contribution.c_message && (
            <div className="flex items-start gap-2 text-sm">
              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium">Message:</span>{" "}
                {contribution.c_message}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </Button>
          {canEdit && (
                      <Link href={`/contribute/${contribution._id}/edit/`}>
            <Button
              variant="outline"
              onClick={() => {
                const contributionData = contribution;
                // Lưu dữ liệu vào sessionStorage cho form contribution
                sessionStorage.setItem(
                  "contributionData",
                  JSON.stringify({ ...contributionData })
                );

                // Điều hướng sang trang đóng góp ở chế độ update
                // window.location.href = "/contribute/create?type=update";
              }}
              className="flex items-center gap-2 bg-transparent"
            >
              <Edit className="h-4 w-4" />
              Edit Contribution
            </Button>
          </Link>
          )}
        </div>
      </div>

      {/* Contributor Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {contribution.c_user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {contribution.c_user.username}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Contributor
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Submitted{" "}
                      {formatDistanceToNow(new Date(contribution.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {contribution.updatedAt &&
                    contribution.updatedAt !== contribution.createdAt && (
                      <div className="flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(
                            new Date(contribution.updatedAt),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Contribution ID
              </div>
              <div className="font-mono text-sm">{contribution._id}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Column - Images and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="relative aspect-square">
              <CloudImage
                src={
                  allImages[currentImageIndex] ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={contribution.data.plant.scientific_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />

              {/* Image Type Badge */}
              <div className="absolute top-2 left-2">
                {getImageBadge(currentImageIndex)}
              </div>

              {allImages.length > 1 && (
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

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded-md text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex overflow-x-auto p-2 gap-2">
                {allImages.map((image, index) => (
                  <div key={index} className="relative">
                    <button
                      className={cn(
                        "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                        currentImageIndex === index
                          ? "ring-2 ring-primary"
                          : "opacity-70 hover:opacity-100"
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <CloudImage
                        src={image || "/placeholder.svg?height=64&width=64"}
                        alt={`${
                          contribution.data.plant.scientific_name
                        } thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                    {/* Small badge on thumbnail */}
                    <div className="absolute -top-1 -right-1">
                      {index < contribution.data.plant.images.length ? (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Image Summary */}
            {contribution.type === "update" &&
              contribution.data.new_images &&
              contribution.data.new_images.length > 0 && (
                <div className="p-3 bg-muted/30 border-t">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Images:</span>{" "}
                    {contribution.data.plant.images.length} existing,{" "}
                    {contribution.data.new_images.length} new
                  </div>
                </div>
              )}
          </Card>

          {/* Plant Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Plant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  TAXONOMY
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <span className="text-sm text-muted-foreground">Family:</span>
                  <span className="text-sm font-medium">
                    {contribution.data.plant.family.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Scientific Name:
                  </span>
                  <span className="text-sm font-medium italic">
                    {contribution.data.plant.scientific_name}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  ATTRIBUTES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contribution.data.plant.attributes.map(
                    (attribute, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary/10"
                      >
                        {attribute.name}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  COMMON NAMES
                </h3>
                <div className="space-y-1">
                  {contribution.data.plant.common_name.map((name, index) => (
                    <div key={index} className="text-sm">
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              {contribution.data.plant.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                      DESCRIPTION
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {contribution.data.plant.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Description */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="care">Care Guide</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-6">
              {contribution.data.plant.species_description &&
              contribution.data.plant.species_description.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {contribution.data.plant.species_description.map(
                    (section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                          {section.section}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {section.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="space-y-2">
                                <h4 className="font-medium text-base">
                                  {detail.label}
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {detail.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground italic">
                    No detailed description provided.
                  </p>
                  {contribution.data.plant.description && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg text-left">
                      <h4 className="font-medium mb-2">Basic Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {contribution.data.plant.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Care Guide Tab */}
            <TabsContent value="care" className="mt-6">
              {contribution.data.plant.species_description?.find(
                (section) =>
                  section.section.toLowerCase().includes("care") ||
                  section.section.toLowerCase().includes("propagation")
              ) ? (
                <Accordion type="single" collapsible className="w-full">
                  {contribution.data.plant.species_description
                    .filter(
                      (section) =>
                        section.section.toLowerCase().includes("care") ||
                        section.section.toLowerCase().includes("propagation")
                    )
                    .map((section, index) => (
                      <AccordionItem key={index} value={`care-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                          {section.section}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {section.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="space-y-2">
                                <h4 className="font-medium text-base">
                                  {detail.label}
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {detail.content}
                                </p>
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
                    No care guide information provided.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(contribution.status)}
                    Review Status
                  </CardTitle>
                  <CardDescription>
                    Current status and review information for this contribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Status</div>
                      <div className="text-sm text-muted-foreground">
                        {contribution.status === "approved"
                          ? "This contribution has been approved and published"
                          : contribution.status === "rejected"
                          ? "This contribution has been rejected"
                          : "This contribution is pending review"}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(contribution.status)}
                    >
                      {contribution.status}
                    </Badge>
                  </div>

                  {contribution.status === "pending" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Pending Review</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your contribution is currently being reviewed by our
                        team. This process typically takes 2-5 business days.
                      </p>
                    </div>
                  )}

                  {contribution.status === "approved" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Approved</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Congratulations! Your contribution has been approved and
                        is now live in the plant database.
                      </p>
                    </div>
                  )}

                  {contribution.status === "rejected" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Rejected</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        This contribution was rejected. Please review the
                        feedback and consider submitting an updated version.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Submitted:
                        </span>
                        <span>
                          {formatDistanceToNow(
                            new Date(contribution.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      {contribution.updatedAt &&
                        contribution.updatedAt !== contribution.createdAt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Last Updated:
                            </span>
                            <span>
                              {formatDistanceToNow(
                                new Date(contribution.updatedAt),
                                { addSuffix: true }
                              )}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Contribution Details */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Contribution Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {contribution.type === "create"
                            ? "New Plant"
                            : "Update"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Images:
                        </span>
                        <span>{allImages.length}</span>
                      </div>
                      {contribution.type === "update" &&
                        contribution.data.new_images && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              New Images:
                            </span>
                            <span>{contribution.data.new_images.length}</span>
                          </div>
                        )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Attributes:
                        </span>
                        <span>{contribution.data.plant.attributes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Description Sections:
                        </span>
                        <span>
                          {contribution.data.plant.species_description
                            ?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
