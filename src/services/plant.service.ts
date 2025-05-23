"use client";

import axiosInstance from './axiosInstance';
import { PlantList , Family,Attribute} from '@/types';

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