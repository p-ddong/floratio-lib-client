// src/services/plant.server.ts
// 👈 gắn server-only để Next.js không cho client bundle lẫn lộn
import "server-only";

import { PlantList, PlantDetail, Family, Attribute } from "@/types";
import { BASE_API } from "@/constant/API";

/**
 * Hàm trợ giúp chung – dùng native fetch để tận dụng cơ chế cache & revalidate
 * @param path    phần path sau BASE_API
 * @param reval   số giây Next.js tự revalidate (mặc định 60s)
 */
async function getJSON<T>(path: string, reval = 0): Promise<T>{
  const res = await fetch(`${BASE_API}${path}`, {
    // Tích hợp caching của App Router
    next: { revalidate: reval },
    // force-cache (mặc định) đủ dùng cho GET
  });

  if (!res.ok) {
    // Ghi log hoặc Sentry tại đây nếu muốn
    throw new Error(`Failed to fetch ${BASE_API} ${path} – ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/* ---------- API cụ thể ---------- */
export const fetchPlantList      = () => getJSON<PlantList[]>("plants/list");
export const fetchFamiliesList   = () => getJSON<Family[]>("plants/families/list");
export const fetchAttributesList = () => getJSON<Attribute[]>("plants/attributes/list");
export const fetchPlantDetail    = (id: string) =>
  getJSON<PlantDetail>(`plants/detail/${id}`);
