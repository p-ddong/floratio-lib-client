// src/types/contribution.ts

import { PlantDetail} from "./plant.types";

/** --- User nộp đóng góp ---------------------------------- */
export interface ContributionUser {
  _id: string;
  username: string;
}

/** --- Thông tin cây trong phần data.plant ---------------- */
export interface ContributionPlant {
  scientific_name: string;
  common_name: string[];
  description: string;
  attributes: string[];
  images: string[];         // 🔸 mảng ảnh (cover lấy images[0])
  family: string;           // 🔸 tên họ thực vật
}

/** --- data wrapper --------------------------------------- */
export interface ContributionData {
  plant: PlantDetail;
  newImages: string[];      // ảnh mới bổ sung (nếu type === "update")
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
  image_urls?: string[];
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