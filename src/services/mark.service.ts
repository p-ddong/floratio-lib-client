"use client";

import axiosInstance from "./axiosInstance";
import type { Mark } from "@/types/mark.types"

// ======================
// GET marks của user
// ======================
export const fetchMarkList = async (token: string): Promise<Mark[]> => {
  const { data } = await axiosInstance.get("/marks/list/user", {
    // params: { populate: "plant" },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ======================
// Thêm mark cho một plant
// ======================
export const addMark = async (plantId: string, token: string): Promise<Mark> => {
  const { data } = await axiosInstance.post(
    "/marks/create",
    { plantId: plantId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
};

// ======================
// Xóa một mark
// ======================
export const removeMark = async (markId: string, token: string): Promise<void> => {
  await axiosInstance.delete(`/marks/delete/${markId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
