import { useDispatch as useDefaultDispatch, useSelector as useDefaultSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/slices/store.ts';
import type { TypedUseSelectorHook } from 'react-redux';

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;
