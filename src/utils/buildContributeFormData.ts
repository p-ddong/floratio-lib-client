// utils/buildContributeFormData.ts
import type { PlantPayload } from "@/types/contribute.types";

interface BuildOptions {
  plant: PlantPayload;
  message: string;
  type: "create" | "update";
  plant_ref?: string;
  files: File[];                     // danh sách ảnh thực
  imageUrls?: string[];              // nếu có url
}

export function buildContributeFormData(opts: BuildOptions) {
  const formData = new FormData();

  // 1) Trường text
  formData.append("c_message", opts.message);
  formData.append("type", opts.type);

  // 2) Trường JSON (stringify)
  formData.append(
    "data",
    JSON.stringify({
      plant_ref: opts.plant_ref,
      plant: {
        ...opts.plant,
        // image_urls: opts.imageUrls,     // không có thì undefined
      },
    }),
  );

  // 3) File images (nhiều ảnh => key trùng "images")
  opts.files.forEach((file) => {
    formData.append("images", file);    // <-- chính xác key BE yêu cầu
  });

  return formData;
}
