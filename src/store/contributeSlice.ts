import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Contribution } from "@/types";
import { fetchContributeList } from "@/services/contribute.service";
import { RootState } from ".";          // đường dẫn store

interface ContributeState {
  list: Contribution[];
  loading: boolean;
  error?: string;
}
const initialState: ContributeState = { list: [], loading: false };

export const getContributions = createAsyncThunk<
  Contribution[],
  void,
  { state: RootState }
>("contribute/getContributions", async (_, { getState }) => {
  const token = getState().auth.token!;     // token đã lưu ở authSlice
  return await fetchContributeList(token);
});

const contributeSlice = createSlice({
  name: "contribute",
  initialState,
  reducers: {
    // ⬇︎ Sửa lại: dùng khối lệnh {}, không trả về mảng
    clearContributeList: (state) => {
      state.list = [];
      state.error = undefined;   // tuỳ, có thể reset luôn lỗi
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContributions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContributions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getContributions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export const { clearContributeList } = contributeSlice.actions;
export default contributeSlice.reducer;
