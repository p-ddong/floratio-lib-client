// src/services/plant.service.server.ts

import axios from "axios"
import { PlantDetail } from "@/types"
import { BASE_API } from '@/constant/API';

// Bạn có thể dùng biến môi trường cho baseURL
const serverAxios = axios.create({
  baseURL: BASE_API, 
})

export async function fetchPlantDetail(id: string): Promise<PlantDetail> {
  const res = await serverAxios.get<PlantDetail>(`/plants/detail/${id}`)
  return res.data
}
