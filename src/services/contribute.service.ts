"use client";
import axiosInstance from "./axiosInstance";
import { Contribution } from "@/types";

export const fetchContributeList = async (token: string) =>
  (await axiosInstance.get<Contribution[]>("/contributes/list", {
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

export const updateContributionStatus = async (
  id: string,
  status: "approved" | "rejected",
  token: string
) =>
  (await axiosInstance.patch(`/contributes/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  })).data;
