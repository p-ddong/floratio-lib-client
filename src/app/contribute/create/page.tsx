"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronLeft, Loader2, Plus, X, Upload, Eye, Save } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

const contributionSchema = z.object({
  scientific_name: z.string().min(1, "Scientific name is required"),
  family_name: z.string().min(1, "Family name is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  image_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  contribution_type: z.enum(["new", "update"], {
    required_error: "Please select a contribution type",
  }),
})

type ContributionFormValues = z.infer<typeof contributionSchema>

const plantFamilies = [
  "Araceae",
  "Moraceae",
  "Asparagaceae",
  "Marantaceae",
  "Strelitziaceae",
  "Arecaceae",
  "Euphorbiaceae",
  "Cactaceae",
  "Rosaceae",
  "Fabaceae",
  "Crassulaceae",
  "Orchidaceae",
  "Bromeliaceae",
]

const commonAttributes = [
  "Air Purifying",
  "Low Light",
  "Bright Light",
  "High Humidity",
  "Low Maintenance",
  "Pet Safe",
  "Toxic to Pets",
  "Trailing",
  "Climbing",
  "Succulent",
  "Tropical",
  "Drought Tolerant",
  "Large Leaves",
  "Small Leaves",
  "Flowering",
  "Fragrant",
  "Fast Growing",
  "Slow Growing",
]

export default function CreateContributionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [attributes, setAttributes] = useState<string[]>([])
  const [attributeInput, setAttributeInput] = useState("")
  const [commonNames, setCommonNames] = useState<string[]>([])
  const [commonNameInput, setCommonNameInput] = useState("")
  const [currentTab, setCurrentTab] = useState("basic")
  const [previewMode, setPreviewMode] = useState(false)

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      scientific_name: "",
      family_name: "",
      description: "",
      image_url: "",
      contribution_type: "new",
    },
  })

  const watchedValues = form.watch()

  const addAttribute = () => {
    if (attributeInput.trim() && !attributes.includes(attributeInput.trim())) {
      setAttributes([...attributes, attributeInput.trim()])
      setAttributeInput("")
    }
  }

  const addCommonAttribute = (attribute: string) => {
    if (!attributes.includes(attribute)) {
      setAttributes([...attributes, attribute])
    }
  }

  const removeAttribute = (attribute: string) => {
    setAttributes(attributes.filter((a) => a !== attribute))
  }

  const addCommonName = () => {
    if (commonNameInput.trim() && !commonNames.includes(commonNameInput.trim())) {
      setCommonNames([...commonNames, commonNameInput.trim()])
      setCommonNameInput("")
    }
  }

  const removeCommonName = (name: string) => {
    setCommonNames(commonNames.filter((n) => n !== name))
  }

  const saveDraft = async () => {
    setIsDraft(true)
    try {
      // Simulate saving draft
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Draft saved:", {
        ...watchedValues,
        common_names: commonNames,
        attributes: attributes,
      })
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setIsDraft(false)
    }
  }

  async function onSubmit(data: ContributionFormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const contributionData = {
        scientific_name: data.scientific_name,
        family_name: data.family_name,
        common_name: commonNames,
        description: data.description,
        attributes: attributes,
        image: data.image_url || "/placeholder.svg?height=400&width=400",
        type: data.contribution_type,
      }

      console.log("Contribution submitted:", contributionData)

      // Redirect to contributions page with success message
      router.push("/contribute?success=true")
    } catch (error) {
      console.error("Error submitting contribution:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (previewMode) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)} className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveDraft} disabled={isDraft}>
              {isDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Draft
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Contribution
            </Button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <div className="relative h-64 w-full">
            <Image
              src={watchedValues.image_url || "/placeholder.svg?height=400&width=600"}
              alt={watchedValues.scientific_name || "Plant preview"}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-background/80">
                {watchedValues.contribution_type === "new" ? "New Plant" : "Update"}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl italic">{watchedValues.scientific_name || "Scientific Name"}</CardTitle>
            <CardDescription className="text-lg">
              {commonNames.length > 0 ? commonNames.join(", ") : "Common names will appear here"}
            </CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Family:</span>
              <span className="font-medium">{watchedValues.family_name || "Family name"}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                {watchedValues.description || "Plant description will appear here..."}
              </p>
            </div>
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild className="flex items-center">
          <Link href="/contribute">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Contributions
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveDraft} disabled={isDraft}>
            {isDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Contribution</CardTitle>
          <CardDescription>
            Share your plant knowledge with the community. All contributions are reviewed before being published.
          </CardDescription>
        </CardHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 px-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Basic Information Tab */}
              <TabsContent value="basic">
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contribution_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contribution Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contribution type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New Plant Species</SelectItem>
                            <SelectItem value="update">Update Existing Plant</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose whether you're adding a new plant or updating information for an existing one
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scientific_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scientific Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Monstera deliciosa" {...field} />
                        </FormControl>
                        <FormDescription>Enter the full scientific name (genus and species)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Common Names
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Swiss Cheese Plant"
                        value={commonNameInput}
                        onChange={(e) => setCommonNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCommonName()
                          }
                        }}
                      />
                      <Button type="button" onClick={addCommonName} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Add multiple common names for this plant</p>

                    {commonNames.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {commonNames.map((name, index) => (
                          <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                            {name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground ml-1"
                              onClick={() => removeCommonName(name)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="family_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Family *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select plant family" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {plantFamilies.map((family) => (
                              <SelectItem key={family} value={family}>
                                {family}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the taxonomic family this plant belongs to</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the plant including its appearance, native habitat, growth habits, and any notable characteristics..."
                            className="min-h-40"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include information about appearance, native habitat, growth habits, and notable features
                          (minimum 50 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <AlertDescription>
                      <strong>Writing Tips:</strong> Include details about the plant's size, leaf shape, flower
                      characteristics, native environment, and any special care requirements or interesting facts.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="attributes">
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Plant Attributes
                      </label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select or add attributes that describe this plant's characteristics and care requirements
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Common Attributes</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {commonAttributes.map((attr) => (
                              <Button
                                key={attr}
                                type="button"
                                variant={attributes.includes(attr) ? "default" : "outline"}
                                size="sm"
                                onClick={() => addCommonAttribute(attr)}
                                className="justify-start"
                              >
                                {attr}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Custom Attributes</h4>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add custom attribute..."
                              value={attributeInput}
                              onChange={(e) => setAttributeInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  addAttribute()
                                }
                              }}
                            />
                            <Button type="button" onClick={addAttribute} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {attributes.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Selected Attributes</h4>
                            <div className="flex flex-wrap gap-2">
                              {attributes.map((attribute, index) => (
                                <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                                  {attribute}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-muted-foreground hover:text-foreground ml-1"
                                    onClick={() => removeAttribute(attribute)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media">
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Image</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/plant-image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a URL to a high-quality image of the plant. If left empty, a placeholder will be used.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedValues.image_url && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Image Preview
                      </label>
                      <div className="relative h-48 w-full max-w-md border rounded-lg overflow-hidden">
                        <Image
                          src={watchedValues.image_url || "/placeholder.svg"}
                          alt="Plant preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Image Guidelines:</strong> Use high-quality images that clearly show the plant's
                      characteristics. Avoid images with watermarks or copyrighted content.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </TabsContent>

              {/* Navigation and Submit */}
              <div className="flex justify-between items-center p-6 border-t">
                <div className="flex gap-2">
                  {currentTab !== "basic" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tabs = ["basic", "details", "attributes", "media"]
                        const currentIndex = tabs.indexOf(currentTab)
                        if (currentIndex > 0) {
                          setCurrentTab(tabs[currentIndex - 1])
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  {currentTab !== "media" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tabs = ["basic", "details", "attributes", "media"]
                        const currentIndex = tabs.indexOf(currentTab)
                        if (currentIndex < tabs.length - 1) {
                          setCurrentTab(tabs[currentIndex + 1])
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" type="button" onClick={() => router.push("/contribute")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Contribution"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>
      </Card>
    </div>
  )
}
