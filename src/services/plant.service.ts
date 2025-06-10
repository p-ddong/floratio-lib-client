
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
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") qs.append(k, String(v));
  });

  const res = await axiosInstance.get<PlantPaginationResponse>(
    `plants/pagination?${qs.toString()}`,
  );
  return res.data;
};