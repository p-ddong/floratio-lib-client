// src/provider/ReduxProvider.tsx
"use client"

import { ReactNode, useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { store, useAppDispatch } from "@/store"
import {
  setPlantLoading,
  setPlantList,
  setAttributesLoading,
  setAttributesList,
  setFamiliesLoading,
  setFamiliesList,
} from "@/store/plantSlice"
import {
  fetchPlantList,
  fetchAttributesList,
  fetchFamiliesList,
} from "@/services/plant.service"

interface ReduxProviderProps {
  children: ReactNode
}

function InnerProvider({ children }: ReduxProviderProps) {
  const dispatch = useAppDispatch()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    // Plants
    dispatch(setPlantLoading(true))
    fetchPlantList()
      .then((data) => dispatch(setPlantList(data)))
      .catch(() => dispatch(setPlantList([])))

    // Attributes
    dispatch(setAttributesLoading(true))
    fetchAttributesList()
      .then((data) => dispatch(setAttributesList(data)))
      .catch(() => dispatch(setAttributesList([])))

    // Families
    dispatch(setFamiliesLoading(true))
    fetchFamiliesList()
      .then((data) => dispatch(setFamiliesList(data)))
      .catch(() => dispatch(setFamiliesList([])))
  }, [dispatch])

  return <>{children}</>
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <InnerProvider>{children}</InnerProvider>
    </Provider>
  )
}
