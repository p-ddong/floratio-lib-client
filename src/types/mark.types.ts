import { Attribute } from "./plant.types"

export interface MarkPlant  {
    _id: string
    scientific_name: string
    common_name: string[]
    image: string
    attributes: Attribute[]
}

export interface Mark {
  _id: string
  plant: MarkPlant
}