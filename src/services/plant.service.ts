
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { PlantList , Family,Attribute, PlantPaginationParams, PlantPaginationResponse, RawPrediction, RawPredictionResponse, PlantsPrediction} from '@/types';

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

export async function fetchPrediction(file: File): Promise<RawPrediction[]> {
  const form = new FormData();
  form.append("file", file);            

  const { data } = await axios.post<RawPredictionResponse>(
    "http://p-ddong.id.vn/predict",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }, 
  );
  return data.predictions;
}

export async function getPlantsPrediction(scientific_names: string[]): Promise<PlantsPrediction[]> {            

  const { data } = await axios.post<PlantsPrediction[]>(
    "https://be-floratio-lib.onrender.com/plants/find-by-names",
    {scientific_names},
    { headers: { "Content-Type": "application/json" } }, 
  );
  return data;
}