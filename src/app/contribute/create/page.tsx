"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronLeft, Loader2, Save, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContributionPreview } from "../../../components/ContributeComponent/contribution-preview"
import { BasicInfoTab } from "../../../components/ContributeComponent/basic-info-tab"
import { DescriptionTab } from "../../../components/ContributeComponent/description-tab"
import { AttributesTab } from "../../../components/ContributeComponent/attributes-tab"
import { MediaTab } from "../../../components/ContributeComponent/media-tab"

import { useAppSelector } from "@/store"
import { buildContributeFormData } from "@/utils/buildContributeFormData";
import { createContribution } from "@/services/contribute.service";
import { PlantPayload } from "@/types"
import { toast } from "sonner"

const contributionSchema = z.object({
  scientific_name: z.string().min(1, "Scientific name is required"),
  family: z.string().min(1, "Family name is required"),
  image_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  contribution_type: z.enum(["create", "update"], {
    required_error: "Please select a contribution type",
  }),
})

type ContributionFormValues = z.infer<typeof contributionSchema>

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

export default function NewContributionPage() {

  const families   = useAppSelector((s) => s.plant.families)
  const attributesMaster = useAppSelector((s) => s.plant.attributes)
  // const token = useAppSelector((s) => s.auth.token);

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [attributes, setAttributes] = useState<string[]>([])
  const [familySearch, setFamilySearch] = useState("")
  const [attributeSearch, setAttributeSearch] = useState("")
  const [commonNames, setCommonNames] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState("basic")
  const [previewMode, setPreviewMode] = useState(false)
  const [speciesDescription, setSpeciesDescription] = useState<SpeciesSection[]>([])
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([])

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      scientific_name: "",
      family: "",
      image_url: "",
      contribution_type: "create",
    },
  })

  const watchedValues = form.watch()

  const saveDraft = async () => {
    setIsDraft(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Draft saved:", {
        ...watchedValues,
        common_names: commonNames,
        attributes: attributes,
        species_description: speciesDescription,
        images: uploadedImages,
      })
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setIsDraft(false)
    }
  }

async function onSubmit(data: ContributionFormValues) {
  setIsSubmitting(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""
  try {
    // Tách ảnh file & url
    const imageFiles = uploadedImages
      .filter((img) => img.type === "file" && img.file)
      .map((img) => img.file!);

    const imageUrls = uploadedImages
      .filter((img) => img.type === "url" && img.url)
      .map((img) => img.url!);

    // Chuẩn bị plant payload
    const plantPayload: PlantPayload = {
      scientific_name: data.scientific_name,
      common_name: commonNames,
      description: "", // lấy từ form nếu có
      family: data.family,
      attributes,
      species_description: speciesDescription,
      // image_urls chỉ cần nếu BE hỗ trợ
    };

    // Build FormData
    const formData = buildContributeFormData({
      plant: plantPayload,
      message: "Contribute Sample Message Update",
      type: data.contribution_type, // "create" | "update"
      // plant_ref: (data.contribution_type === "update" ? plantId : undefined),
      files: imageFiles,
      imageUrls,
    });
    toast.loading("Submitting contributions…")

    // Gọi API
    await createContribution(formData,token);
    toast.success('Create Success')

    router.push("/contribute?success=true");
  } catch (err) {
    console.error("Error submitting contribution:", err);
    toast.error("Submit contribution failed, please try again.")
  } finally {
    setIsSubmitting(false);
  }
}

  // Preview mode now uses the separate component
  if (previewMode) {
    return (
      <ContributionPreview
        scientificName={watchedValues.scientific_name}
        familyName={watchedValues.family}
        contributionType={watchedValues.contribution_type}
        commonNames={commonNames}
        attributes={attributes}
        speciesDescription={speciesDescription}
        uploadedImages={uploadedImages}
        onBackToEdit={() => setPreviewMode(false)}
        onSaveDraft={saveDraft}
        onSubmit={form.handleSubmit(onSubmit)}
        isDraft={isDraft}
        isSubmitting={isSubmitting}
      />
    )
  }

  return (
    <div className="p-8">
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
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Basic Information Tab */}
              <TabsContent value="basic">
                <BasicInfoTab
                  form={form}
                  commonNames={commonNames}
                  setCommonNames={setCommonNames}
                  familySearch={familySearch}
                  setFamilySearch={setFamilySearch}
                  families={families}
                />
              </TabsContent>

              {/* Species Description Tab */}
              <TabsContent value="description">
                <DescriptionTab speciesDescription={speciesDescription} setSpeciesDescription={setSpeciesDescription} />
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="attributes">
                <AttributesTab
                  attributes={attributes}
                  setAttributes={setAttributes}
                  attributeSearch={attributeSearch}
                  setAttributeSearch={setAttributeSearch}
                  allAttributes={attributesMaster}
                />
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media">
                <MediaTab uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
              </TabsContent>

              {/* Navigation and Submit */}
              <div className="flex justify-between items-center p-6 border-t">
                <div className="flex gap-2">
                  {currentTab !== "basic" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tabs = ["basic", "description", "attributes", "media"]
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
                        const tabs = ["basic", "description", "attributes", "media"]
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
