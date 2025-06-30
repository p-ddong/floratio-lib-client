// src/types/contribution.ts

import { SpeciesSection} from "./plant.types";

/** --- User nộp đóng góp ---------------------------------- */
export interface ContributionUser {
  _id: string;
  username: string;
}

/** --- Thông tin cây trong phần data.plant ---------------- */
export interface ContributionPlant {
  scientific_name: string;
  common_name: string[];
  description?: string;
  attributes: string[];
  images: string[];         // 🔸 mảng ảnh (cover lấy images[0])
  family: string;
  species_description: SpeciesSection[]           // 🔸 tên họ thực vật
}

/** --- data wrapper --------------------------------------- */
export interface ContributionData {
  plant: ContributionPlant;
  new_images: string[];      // ảnh mới bổ sung (nếu type === "update")
}

/** --- enum/union helpers --------------------------------- */
export type ContributionStatus = "pending" | "approved" | "rejected";
export type ContributionType   = "create" | "update";   // 🔸 khớp BE

/** --- Đối tượng Contribution đầy đủ ---------------------- */
export interface Contribution {
  _id: string;
  c_user: ContributionUser;       // 🔸 theo BE (trước đây là user)
  status: ContributionStatus;
  type: ContributionType;
  data: ContributionData;         // 🔸 wrapper chứa plant + newImages
  createdAt: string;
  updatedAt: string;
}


export type ContributeType = "create" | "update";

export interface PlantPayload {
  scientific_name: string;
  common_name: string[];
  description?: string;
  family: string;          // _id của family
  attributes: string[];    // _id của attributes
  species_description: {
    section: string;
    details: { label: string; content: string }[];
  }[];
  // Nếu BE cho phép gửi url ảnh kèm JSON thì thêm:
  images?: string[];
}

export interface ContributeCreateBody {
  c_message: string;   // mô tả / ghi chú
  type: ContributeType;
  data: {
    plant_ref?: string;  // chỉ cần khi type = "update"
    plant: PlantPayload;
  };
  // Với multipart bạn không khai báo images ở đây –
  // chúng được gắn riêng trên FormData với key "images"
}

// Type Contribution Detail
export interface ContributionDetail {
  _id: string
  c_user: {
    _id: string
    username: string
  }
  c_message: string
  type: ContributionType
  status: ContributionStatus
  data: {
    plant: {
      _id: string
      scientific_name: string
      common_name: string[]
      description: string
      family: {
        _id: string
        name: string
      }
      attributes: Array<{
        _id: string
        name: string
      }>
      images: string[]
      species_description: Array<{
        section: string
        details: Array<{
          label: string
          content: string
        }>
      }>
    }
    new_images?: string[]
  }
  createdAt: string
  updatedAt: string
}