import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import plantReducer from './plantSlice';
import contributeReducer from './contributeSlice';
import userReducer from './userSlice';
import markReducer from "./markSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plant: plantReducer,
    contribute: contributeReducer,
    user: userReducer,
    mark: markReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
