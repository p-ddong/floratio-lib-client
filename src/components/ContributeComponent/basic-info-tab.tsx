"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent } from "@/components/ui/card"
import { Family } from "@/types"

interface BasicInfoTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  commonNames: string[]
  setCommonNames: (names: string[]) => void
  familySearch: string
  setFamilySearch: (search: string) => void
  families: Family[]
}

export function BasicInfoTab({ form, commonNames, setCommonNames, familySearch, setFamilySearch, families }: BasicInfoTabProps) {
  const [commonNameInput, setCommonNameInput] = useState("")

  // Filter plant families based on search
  const filteredFamilies = families.filter((f) =>
  f.name.toLowerCase().includes(familySearch.toLowerCase()),
)

  const addCommonName = () => {
    if (commonNameInput.trim() && !commonNames.includes(commonNameInput.trim())) {
      setCommonNames([...commonNames, commonNameInput.trim()])
      setCommonNameInput("")
    }
  }

  const removeCommonName = (name: string) => {
    setCommonNames(commonNames.filter((n) => n !== name))
  }

  return (
    <CardContent className="space-y-6 pb-6">
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
                <SelectItem value="create">New Plant Species</SelectItem>
                <SelectItem value="update">Update Existing Plant</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {`Choose whether you're adding a new plant or updating information for an existing one`}
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
        name="family"
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
                <div className="p-2">
                  <Input
                    placeholder="Search families..."
                    value={familySearch}
                    onChange={(e) => setFamilySearch(e.target.value)}
                    className="mb-2"
                  />
                </div>
                {filteredFamilies.length > 0 ? (
                  filteredFamilies.map((family) => (
                    <SelectItem key={family._id} value={family._id}>
                      {family.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No families found</div>
                )}
              </SelectContent>
            </Select>
            <FormDescription>Select the taxonomic family this plant belongs to</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  )
}
