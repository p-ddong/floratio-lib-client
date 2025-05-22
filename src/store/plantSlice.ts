// src/store/plantSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { PlantList,Family,Attribute } from "@/types"


interface PlantState {
  list: PlantList[]
  loadingList: boolean

  attributes: Attribute[]
  loadingAttributes: boolean

  families: Family[]
  loadingFamilies: boolean
}

const initialState: PlantState = {
  list: [],
  loadingList: false,

  attributes: [],
  loadingAttributes: false,

  families: [],
  loadingFamilies: false,
}

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    // Plants
    setPlantLoading(state, action: PayloadAction<boolean>) {
      state.loadingList = action.payload
    },
    setPlantList(state, action: PayloadAction<PlantList[]>) {
      state.list = action.payload
      state.loadingList = false
    },

    // Attributes
    setAttributesLoading(state, action: PayloadAction<boolean>) {
      state.loadingAttributes = action.payload
    },
    setAttributesList(state, action: PayloadAction<Attribute[]>) {
      state.attributes = action.payload
      state.loadingAttributes = false
    },

    // Families
    setFamiliesLoading(state, action: PayloadAction<boolean>) {
      state.loadingFamilies = action.payload
    },
    setFamiliesList(state, action: PayloadAction<Family[]>) {
      state.families = action.payload
      state.loadingFamilies = false
    },

    // Optional reset
    clearPlantState(state) {
      state.list = []
      state.attributes = []
      state.families = []
      state.loadingList = false
      state.loadingAttributes = false
      state.loadingFamilies = false
    },
  },
})

export const {
  setPlantLoading,
  setPlantList,

  setAttributesLoading,
  setAttributesList,

  setFamiliesLoading,
  setFamiliesList,

  clearPlantState,
} = plantSlice.actions

export default plantSlice.reducer
