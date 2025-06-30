"use client";
import axiosInstance from "./axiosInstance";
import { Contribution, ContributionDetail } from "@/types";

export const fetchContributeList = async (token: string) =>
  (await axiosInstance.get<Contribution[]>("/contributes/list", {
    headers: { Authorization: `Bearer ${token}` },
  })).data;

export const fetchContributeDetail = async (id:string,token: string) =>
  (await axiosInstance.get<ContributionDetail>(`/contributes/detail/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })).data;

export const createContribution = async (body: FormData, token: string) =>
  (
    await axiosInstance.post("/contributes/create", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;

export const updateContribution = async (id: string, body: FormData, token: string) =>
  (await axiosInstance.patch(`/contributes/update/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  }));
