
import axiosInstance from './axiosInstance';
import { PlantList , Family,Attribute, PlantPaginationParams, PlantPaginationResponse} from '@/types';

export const fetchPlantList = async (): Promise<PlantList[]> => {
  const res = await axiosInstance.get<PlantList[]>("/plants/list");
  return res.data;
};

export const fetchFamiliesList = async (): Promise<Family[]> => {
  const res = await axiosInstance.get<Family[]>("/plants/families/list")
  return res.data
}

export const fetchAttributesList = async (): Promise<Attribute[]> => {
  const res = await axiosInstance.get<Attribute[]>("/plants/attributes/list")
  return res.data
}

// export const fetchPlantDetail = async (id: string): Promise<PlantDetail> => {
//   const res = await axiosInstance.get<PlantDetail>(`/plants/detail/${id}`)
//   return res.data
// }

export const fetchPlantPagination = async (
  params: PlantPaginationParams,
): Promise<PlantPaginationResponse> => {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Bỏ qua ➜ undefined · chuỗi rỗng · mảng rỗng
    if (
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    // Nếu là mảng (attributes) ➜ stringify để backend nhận JSON
    if (Array.isArray(value)) {
      qs.append(key, JSON.stringify(value));      // => ["id1","id2"]
    } else {
      qs.append(key, String(value));
    }
  });

  const { data } = await axiosInstance.get<PlantPaginationResponse>(
    `plants/pagination?${qs.toString()}`,
  );
  return data;
};