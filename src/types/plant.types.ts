export interface PlantDetail {
  scientific_name: string;
  common_name: string[];
  description?: string;
  family: Family;
  attributes: Attribute[];
  images: string[];
  species_description: SpeciesSection[];
}

export interface SpeciesSection {
  section: string;
  details: SpeciesDetail[];
}

export interface SpeciesDetail {
  label: string;
  content: string;
}

export interface PlantList {
  _id: string;
  scientific_name: string;
  family: string;
  image: string;
  common_name: string[];
  attributes: string[];
}

export interface Family {
  _id: string
  name: string
}

export interface Attribute {
  _id: string
  name: string
}

export interface PlantPaginationParams {
  page?: number;          // 1-based
  limit?: number;         // số item / trang
  search?: string;        // chuỗi tìm kiếm
  family?: string;        // _id của family
  attributes?: string[];    // các _id attribute, ngăn cách dấu phẩy
}

export interface PlantPaginationResponse {
  page:        number;
  pageSize:    number;
  totalPages:  number;
  totalItems:  number;
  data:        PlantList[];
}