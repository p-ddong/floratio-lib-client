"use client"

import { useState } from "react"
import { Plus, X, Edit2, Check, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpeciesDetail {
  label: string
  content: string
}

interface SpeciesSection {
  section: string
  details: SpeciesDetail[]
}

interface DescriptionTabProps {
  speciesDescription: SpeciesSection[]
  setSpeciesDescription: (sections: SpeciesSection[]) => void
}

const predefinedSections = [
  "Classifications and Characteristics",
  "Biogeography",
  "Landscaping Features",
  "Plant Care and Propagation",
  "Foliar",
  "Floral (Angiosperm)",
  "Fruit, Seed and Spore",
  "Stem",
  "Root",
]

export function DescriptionTab({ speciesDescription, setSpeciesDescription }: DescriptionTabProps) {
  const [customSectionInput, setCustomSectionInput] = useState("")
  const [showCustomSectionInput, setShowCustomSectionInput] = useState(false)
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)
  const [editingSectionName, setEditingSectionName] = useState("")

  const availablePredefinedSections = predefinedSections.filter(
    (section) => !speciesDescription.find((s) => s.section === section),
  )

  const addPredefinedSection = (sectionName: string) => {
    if (!speciesDescription.find((s) => s.section === sectionName)) {
      setSpeciesDescription([
        ...speciesDescription,
        {
          section: sectionName,
          details: [],
        },
      ])
    }
  }

  const addCustomSection = () => {
    if (customSectionInput.trim() && !speciesDescription.find((s) => s.section === customSectionInput.trim())) {
      setSpeciesDescription([
        ...speciesDescription,
        {
          section: customSectionInput.trim(),
          details: [],
        },
      ])
      setCustomSectionInput("")
      setShowCustomSectionInput(false)
    }
  }

  const startEditingSection = (sectionIndex: number) => {
    setEditingSectionIndex(sectionIndex)
    setEditingSectionName(speciesDescription[sectionIndex].section)
  }

  const saveEditingSection = () => {
    if (editingSectionIndex !== null && editingSectionName.trim()) {
      const updatedSections = [...speciesDescription]
      updatedSections[editingSectionIndex].section = editingSectionName.trim()
      setSpeciesDescription(updatedSections)
      setEditingSectionIndex(null)
      setEditingSectionName("")
    }
  }

  const cancelEditingSection = () => {
    setEditingSectionIndex(null)
    setEditingSectionName("")
  }

  const removeSection = (sectionIndex: number) => {
    setSpeciesDescription(speciesDescription.filter((_, index) => index !== sectionIndex))
  }

  const addDetail = (sectionIndex: number) => {
    const updatedSections = [...speciesDescription]
    updatedSections[sectionIndex].details.push({
      label: "",
      content: "",
    })
    setSpeciesDescription(updatedSections)
  }

  const updateDetail = (sectionIndex: number, detailIndex: number, field: "label" | "content", value: string) => {
    const updatedSections = [...speciesDescription]
    updatedSections[sectionIndex].details[detailIndex][field] = value
    setSpeciesDescription(updatedSections)
  }

  const removeDetail = (sectionIndex: number, detailIndex: number) => {
    const updatedSections = [...speciesDescription]
    updatedSections[sectionIndex].details.splice(detailIndex, 1)
    setSpeciesDescription(updatedSections)
  }

  // Helper function to check if a section is custom (not in predefined list)
  const isCustomSection = (sectionName: string) => {
    return !predefinedSections.includes(sectionName)
  }

  return (
    <CardContent className="space-y-6 pb-6">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Species Description
        </label>
        <p className="text-sm text-muted-foreground mb-4">
          Add detailed information about the plant organized by sections. You can use predefined sections or create
          custom ones.
        </p>

        {/* Add Section Controls */}
        <div className="space-y-4 mb-6">
          {/* Predefined Sections Dropdown */}
          {availablePredefinedSections.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Add Predefined Section</label>
              <Select onValueChange={(value) => addPredefinedSection(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose from predefined sections..." />
                </SelectTrigger>
                <SelectContent>
                  {availablePredefinedSections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Section Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Add Custom Section</label>
            {!showCustomSectionInput ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCustomSectionInput(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Section
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom section name..."
                  value={customSectionInput}
                  onChange={(e) => setCustomSectionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCustomSection()
                    }
                    if (e.key === "Escape") {
                      setShowCustomSectionInput(false)
                      setCustomSectionInput("")
                    }
                  }}
                  autoFocus
                />
                <Button type="button" onClick={addCustomSection} size="sm" disabled={!customSectionInput.trim()}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomSectionInput(false)
                    setCustomSectionInput("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Species Description Sections */}
        <div className="space-y-6">
          {speciesDescription.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {editingSectionIndex === sectionIndex ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingSectionName}
                        onChange={(e) => setEditingSectionName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            saveEditingSection()
                          }
                          if (e.key === "Escape") {
                            cancelEditingSection()
                          }
                        }}
                        className="font-medium text-lg"
                        autoFocus
                      />
                      <Button type="button" size="sm" onClick={saveEditingSection}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={cancelEditingSection}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium text-lg">{section.section}</h4>
                      {isCustomSection(section.section) && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Custom
                        </Badge>
                      )}
                      {isCustomSection(section.section) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingSection(sectionIndex)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
                {editingSectionIndex !== sectionIndex && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {section.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Label</label>
                      <Input
                        placeholder="e.g., Plant Division"
                        value={detail.label}
                        onChange={(e) => updateDetail(sectionIndex, detailIndex, "label", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Content</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Angiosperms (Flowering Seed Plants)"
                          value={detail.content}
                          onChange={(e) => updateDetail(sectionIndex, detailIndex, "content", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDetail(sectionIndex, detailIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDetail(sectionIndex)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Detail
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {speciesDescription.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">
              No sections added yet. Use the controls above to add predefined or custom sections.
            </p>
          </div>
        )}
      </div>

      <Alert>
        <AlertDescription>
          <strong>Tip:</strong> You can use predefined sections for common plant information or create custom sections
          for specialized data. Custom sections can be edited by clicking the edit icon next to their name.
        </AlertDescription>
      </Alert>
    </CardContent>
  )
}
