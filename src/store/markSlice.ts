import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Mark } from "@/types/mark.types";

interface MarkState {
  list: Mark[];
  loading: boolean;
}

const initialState: MarkState = {
  list: [],
  loading: false,
};

const markSlice = createSlice({
  name: "marks",
  initialState,
  reducers: {
    // Bật / tắt trạng thái loading
    setMarkLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Ghi đè toàn bộ danh sách mark
    setMarkList: (state, action: PayloadAction<Mark[]>) => {
      state.list = action.payload;
      state.loading = false;
    },

    // Thêm mark mới
    addMark: (state, action: PayloadAction<Mark>) => {
      state.list.push(action.payload);
    },

    // Xóa mark theo _id
    removeMark: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((m) => m._id !== action.payload);
    },

    // Dọn state, dùng khi logout chẳng hạn
    resetMarkState: () => initialState,
  },
});

export const {
  setMarkLoading,
  setMarkList,
  addMark,
  removeMark,
  resetMarkState,
} = markSlice.actions;

export default markSlice.reducer;
