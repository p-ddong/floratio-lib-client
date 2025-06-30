"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Loader2,
  Save,
  Eye,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { ContributionPreview } from "@/components/ContributeComponent/contribution-preview"
import { BasicInfoTab } from "@/components/ContributeComponent/basic-info-tab"
import { DescriptionTab } from "@/components/ContributeComponent/description-tab"
import { AttributesTab } from "@/components/ContributeComponent/attributes-tab"
import { MediaTab } from "@/components/ContributeComponent/media-tab"

import { ContributionDetail, PlantPayload } from "@/types"
import { useAppSelector } from "@/store"
import { updateContribution } from "@/services/contribute.service"
import { buildUpdateContriubuteFormData } from "@/utils/buildUpdateContriubuteFormData"
import { toast } from "sonner"

/* ---------- validation ---------- */
const updateContributionSchema = z.object({
  scientific_name: z.string().min(1, "Scientific name is required"),
  family: z.string().min(1, "Family is required"),      // 💡 đổi từ family_name ➜ family (_id)
  c_message: z.string().optional(),
})
type UpdateContributionFormValues = z.infer<
  typeof updateContributionSchema
>

/* ---------- local helpers ---------- */
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
interface ContributionEditViewProps {
  contribution: ContributionDetail
}

/* ------------------------------------------------------------------ */
export function ContributionEditView({
  contribution,
}: ContributionEditViewProps) {
  const router = useRouter()

  /* --- UI states -------------------------------------------------- */
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")
  const [previewMode, setPreviewMode] = useState(false)

  const [commonNames, setCommonNames] = useState<string[]>([])
  const [attributes, setAttributes] = useState<string[]>([])
  const [speciesDescription, setSpeciesDescription] = useState<
    SpeciesSection[]
  >([])
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([])
  const [existingImages, setExistingImages] = useState<ImageData[]>([])
  const [updateMessage, setUpdateMessage] = useState("")

  /* --- Redux masters --------------------------------------------- */
  const families = useAppSelector((s) => s.plant.families)
  const attributesMaster = useAppSelector((s) => s.plant.attributes)

  /* --- React-hook-form  ------------------------------------------ */
  const form = useForm<UpdateContributionFormValues>({
    resolver: zodResolver(updateContributionSchema),
    defaultValues: {
      scientific_name: contribution.data.plant.scientific_name,
      family: contribution.data.plant.family._id,        // _id
      c_message: contribution.c_message || "",
    },
  })

  /* --- preload contribution data --------------------------------- */
  useEffect(() => {
    form.setValue(
      "scientific_name",
      contribution.data.plant.scientific_name
    )
    form.setValue("family", contribution.data.plant.family._id)
    form.setValue("c_message", contribution.c_message || "")

    setCommonNames(contribution.data.plant.common_name || [])
    // 👉 lưu mảng _id thay vì name
    setAttributes(
      contribution.data.plant.attributes.map((a) => a._id) || []
    )
    setSpeciesDescription(
      contribution.data.plant.species_description || []
    )
    setUpdateMessage(contribution.c_message || "")

    /* images */
    const existImgs: ImageData[] =
      contribution.data.plant.images.map((img, i) => ({
        id: `existing-${i}`,
        type: "url",
        url: img,
        preview: img,
        name: `${contribution.data.plant.scientific_name} – ${i + 1}`,
      }))
    setExistingImages(existImgs)

    if (
      contribution.data.new_images &&
      contribution.data.new_images.length
    ) {
      const newImgs: ImageData[] =
        contribution.data.new_images.map((img, i) => ({
          id: `new-${i}`,
          type: "url",
          url: img,
          preview: img,
          name: `New Image ${i + 1}`,
        }))
      setUploadedImages(newImgs)
    }
  }, [contribution, form])

  const watchedValues = form.watch()

  /* --- handlers --------------------------------------------------- */
  const saveDraft = async () => {
    setIsDraft(true)
    await new Promise((r) => setTimeout(r, 800))
    console.log("Draft", {
      ...watchedValues,
      common_names: commonNames,
      attributes,
      species_description: speciesDescription,
      existing_images: existingImages,
      new_images: uploadedImages,
      update_message: updateMessage,
    })
    setIsDraft(false)
  }

async function onSubmit(data: UpdateContributionFormValues) {
  setIsSubmitting(true);

  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

    /* tách ảnh */
    const fileImgs = uploadedImages
      .filter((i) => i.type === "file" && i.file)
      .map((i) => i.file!);
    const keepImgs = existingImages
      .filter((i) => i.type === "url" && i.url)
      .map((i) => i.url!);

    /* plant payload */
    const plantPayload: PlantPayload = {
      scientific_name: data.scientific_name,
      common_name: commonNames,
      family: data.family,          // _id
      attributes,                   // [_id]
      species_description: speciesDescription,
      description: "",              // nếu có
    };

    /* build form-data (KHÔNG plant_ref) */
    const fd = buildUpdateContriubuteFormData({
      mode: "update",
      plant: plantPayload,
      message: updateMessage,
      keepImages: keepImgs,
      files: fileImgs,
    });

    await toast.promise(
      updateContribution(contribution._id, fd, token),
      {
        loading: "Updating contribution…",
        success: "Update successful!",
        error: "Update failed. Please try again.",
      },
    );

    router.push(`/contribute/${contribution._id}?updated=true`);
  } finally {
    setIsSubmitting(false);
  }
}




  /* --------------- Preview mode ---------------------------------- */
  if (previewMode) {
    return (
      <ContributionPreview
        scientificName={watchedValues.scientific_name}
        familyName={
          families.find((f) => f._id === watchedValues.family)?.name ||
          ""
        }
        contributionType="update"
        commonNames={commonNames}
        attributes={attributes}
        speciesDescription={speciesDescription}
        uploadedImages={uploadedImages}
        existingImages={existingImages}
        onBackToEdit={() => setPreviewMode(false)}
        onSaveDraft={saveDraft}
        onSubmit={form.handleSubmit(onSubmit)}
        isDraft={isDraft}
        isSubmitting={isSubmitting}
      />
    )
  }

  /* --------------- Main edit UI ---------------------------------- */
  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Contribution</h1>
          <p className="text-muted-foreground">
            Update&nbsp;
            <span className="italic">
              {contribution.data.plant.scientific_name}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={saveDraft}
            disabled={isDraft}
          >
            {isDraft ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* status alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong>&nbsp;This contribution is&nbsp;
          <Badge variant="outline" className="mx-1">
            {contribution.status}
          </Badge>
          . Changes will be reviewed before publish.
        </AlertDescription>
      </Alert>

      {/* update message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Message</CardTitle>
          <CardDescription>
            Describe what you are changing
          </CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <Label htmlFor="update-message">Message</Label>
          <Textarea
            id="update-message"
            placeholder="E.g. fixed family, added images…"
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>
      </Card>

      {/* main form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Update Contribution Details
          </CardTitle>
          <CardDescription>
            Make edits to the plant information below.
          </CardDescription>
        </CardHeader>

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full mb-6 px-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* basic */}
              <TabsContent value="basic">
                <BasicInfoTab
                  form={form}
                  commonNames={commonNames}
                  setCommonNames={setCommonNames}
                  familySearch={""}
                  setFamilySearch={() => {}}
                  families={families}
                />
              </TabsContent>

              {/* description */}
              <TabsContent value="description">
                <DescriptionTab
                  speciesDescription={speciesDescription}
                  setSpeciesDescription={setSpeciesDescription}
                />
              </TabsContent>

              {/* attributes */}
              <TabsContent value="attributes">
                <AttributesTab
                  attributes={attributes}
                  setAttributes={setAttributes}
                  attributeSearch={""}
                  setAttributeSearch={() => {}}
                  allAttributes={attributesMaster}
                />
              </TabsContent>

              {/* media */}
              <TabsContent value="media">
                <MediaTab
                  uploadedImages={uploadedImages}
                  setUploadedImages={setUploadedImages}
                  contributionType="update"
                  existingImages={existingImages}
                  setExistingImages={setExistingImages}
                />
              </TabsContent>

              {/* nav buttons */}
              <div className="flex justify-end gap-4 p-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("basic")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Update"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </Card>
    </div>
  )
}
