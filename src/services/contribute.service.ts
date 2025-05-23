"use client";
import axiosInstance from "./axiosInstance";
import { Contribution } from "@/types";

export const fetchContributeList = async (token: string) =>
  (await axiosInstance.get<Contribution[]>("/contributes/list", {
    headers: { Authorization: `Bearer ${token}` },
  })).data;

export const createContribution = async (payload: FormData, token: string) =>
  (await axiosInstance.post("/contributes/create", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })).data;

export const updateContributionStatus = async (
  id: string,
  status: "approved" | "rejected",
  token: string
) =>
  (await axiosInstance.patch(`/contributes/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  })).data;
