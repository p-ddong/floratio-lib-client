// utils/buildContributeFormData.ts
import type { PlantPayload } from "@/types/contribute.types";

interface BuildOptions {
  mode: "create" | "update";
  plant: PlantPayload;
  message: string;
  // ↓ chỉ dùng khi create
  plant_ref?: string;       // _id cây gốc
  urlImages?: string[];     // ảnh mới dạng URL
  // ↓ chỉ dùng khi update
  keepImages?: string[];    // ảnh giữ nguyên
  files: File[];            // ảnh file mới
}

export function buildUpdateContriubuteFormData(opts: BuildOptions) {
  const fd = new FormData();

  /* 1. Message */
  fd.append("c_message", opts.message ?? "");

  /* 2. JSON payload */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    plant: {
      ...opts.plant,
      images: opts.keepImages ?? [],      // giữ ảnh cũ (update) – rỗng ở create
    },
  };

  if (opts.mode === "create") {
    fd.append("type", "create");          // ← KHÔNG gửi ở update
    data.plant_ref = opts.plant_ref ?? null;
    data.plant.image_urls = opts.urlImages ?? [];
  }

  fd.append("data", JSON.stringify(data));

  /* 3. Files */
  opts.files.forEach((f) => fd.append("new_images", f));

  return fd;
}
