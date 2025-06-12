"use client"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { Attribute } from "@/types"

interface AttributesTabProps {
  attributes: string[]
  setAttributes: (attributes: string[]) => void
  attributeSearch: string
  setAttributeSearch: (search: string) => void
  allAttributes: Attribute[] 
}

export function AttributesTab({ attributes, setAttributes, attributeSearch, setAttributeSearch, allAttributes }: AttributesTabProps) {
  // Filter common attributes based on search
  const filtered = allAttributes.filter((a) =>
  a.name.toLowerCase().includes(attributeSearch.toLowerCase()),
)

  const addAttribute = (attrId: string) => {
  if (!attributes.includes(attrId)) setAttributes([...attributes, attrId])
  }  

  const removeAttribute = (attribute: string) => {
    setAttributes(attributes.filter((a) => a !== attribute))
  }

  return (
    <CardContent className="space-y-6 pb-6">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Plant Attributes</h4>
          <div className="mb-3">
            <Input
              placeholder="Search attributes..."
              value={attributeSearch}
              onChange={(e) => setAttributeSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filtered.length > 0 ? (
                filtered.map((attr) => (
                  <Button
                    key={attr._id}
                    type="button"
                    variant={
                      attributes.includes(attr._id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => addAttribute(attr._id)}
                    className="justify-start"
                  >
                    {attr.name}
                  </Button>
                ))
              ) : (
                <div className="col-span-full text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No attributes found
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
  
            {filtered.length > 0
              ? `Showing ${filtered.length} of ${filtered.length} attributes • Selected: ${attributes.length}`
              : `No matches for "${attributeSearch}"`}
          </p>
        </div>

        {attributes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Selected Attributes ({attributes.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {attributes.map((id) => {
                const attr = allAttributes.find((a) => a._id === id);
                if (!attr) return null;
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="gap-1 px-3 py-1"
                  >
                    {attr.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttribute(id)}
                      className="h-auto p-0 text-muted-foreground hover:text-foreground ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}
