import { configureStore } from '@reduxjs/toolkit';
import tripReducer from './tripSlice.ts';
import eventReducer from './eventSlice.ts';

export const store = configureStore({ reducer: { trip: tripReducer, event: eventReducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
