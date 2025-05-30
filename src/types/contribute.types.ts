// src/types/contribution.ts

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
  plant: ContributionPlant;
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
