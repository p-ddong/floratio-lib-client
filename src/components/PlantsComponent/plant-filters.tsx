// src/components/PlantFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface PlantFiltersProps {
  families: { value: string; label: string }[];
  attributes: { value: string; label: string }[];
  onFilterChange: (filters: {
    search: string;
    family: string;
    attribute: string[];
  }) => void;
}

export function PlantFilters({
  families,
  attributes,
  onFilterChange,
}: PlantFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState<string[]>([]);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [attributeOpen, setAttributeOpen] = useState(false);

  const clearAll = () => {
    setSearchQuery("");
    setSelectedFamily("");
    setSelectedAttribute([]);
  };

  // Khi bất kỳ filter nào thay đổi, gọi callback
  useEffect(() => {
    onFilterChange({
      search: searchQuery.trim().toLowerCase(),
      family: selectedFamily,
      attribute: selectedAttribute,
    });
  }, [searchQuery, selectedFamily, selectedAttribute, onFilterChange]);

  const hasActive = !!(searchQuery || selectedFamily || selectedAttribute.length > 0);

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Plants</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Family & Attribute */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Family */}
        <div className="flex-1 space-y-2">
          <Label>Family</Label>
          <Popover open={familyOpen} onOpenChange={setFamilyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={familyOpen}
                className="w-full justify-between"
              >
                {selectedFamily
                  ? families.find((f) => f.value === selectedFamily)?.label
                  : "All families"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search families..." />
                <CommandList>
                  <CommandEmpty>No family found.</CommandEmpty>
                  <CommandGroup>
                    {families.map((f) => (
                      <CommandItem
                        key={f.value}
                        value={f.value}
                        onSelect={(val) => {
                          setSelectedFamily(val === selectedFamily ? "" : val);
                          setFamilyOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedFamily === f.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {f.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Attribute */}
        <div className="flex-1 space-y-2">
          <Label>Attribute</Label>
          <Popover open={attributeOpen} onOpenChange={setAttributeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={attributeOpen}
                className="w-full justify-between"
              >
                {selectedAttribute
                  ? `${selectedAttribute.length} selected`
                  : "All attributes"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search attributes..." />
                <CommandList>
                  <CommandEmpty>No attribute found.</CommandEmpty>
                  <CommandGroup>
                    {attributes.map((a) => {
                      const checked = selectedAttribute.includes(a.value);
                      return (
                        <CommandItem
                          key={a.value}
                          value={a.value}
                          onSelect={() => {
                            setSelectedAttribute(
                              (prev) =>
                                checked
                                  ? prev.filter((id) => id !== a.value) // bỏ
                                  : [...prev, a.value] // thêm
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              checked ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {a.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear */}
        {hasActive && (
          <Button variant="outline" onClick={clearAll} className="shrink-0">
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {hasActive && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove search filter</span>
              </Button>
            </Badge>
          )}
          {selectedFamily && (
            <Badge variant="secondary" className="gap-1">
              Family: {families.find((f) => f.value === selectedFamily)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedFamily("")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove family filter</span>
              </Button>
            </Badge>
          )}
          {selectedAttribute.map((id) => {
            const label = attributes.find((a) => a.value === id)?.label ?? id;
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                {label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setSelectedAttribute((prev) => prev.filter((v) => v !== id))
                  }
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove attribute filter</span>
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
