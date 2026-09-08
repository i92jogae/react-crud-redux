import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import type { TypeUseSelectorHook } from "react-redux";

export const useAppSelector: TypeUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;