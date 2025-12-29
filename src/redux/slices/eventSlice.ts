import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getEventDetailApi, getMyAllEventsApi } from '../../api/event.ts';
import type { Event } from '../../types/event.ts';

export const fetchAllEvents = createAsyncThunk<
  Event[],
  { tripId: number },
  { rejectValue: string }
>('events/fetchAllEvents', async ({ tripId }, { rejectWithValue }) => {
  try {
    return await getMyAllEventsApi({ tripId });
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const fetchEventDetail = createAsyncThunk<Event, { id: number }, { rejectValue: string }>(
  'events/fetchEventDetail',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await getEventDetailApi({ id });
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export interface EventState {
  eventDetail: Event | null;
  allEvents: Event[];

  isAllEventsLoading: boolean;
  isEventDetailLoading: boolean;

  allEventsError: string | null;
  eventDetailError: string | null;
}

const initialState: EventState = {
  eventDetail: null,
  allEvents: [],

  isAllEventsLoading: false,
  isEventDetailLoading: false,

  allEventsError: null,
  eventDetailError: null,
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearEventDetail: (state) => {
      state.eventDetail = null;
      state.eventDetailError = null;
    },

    resetEventState: () => initialState,
  },
  extraReducers: (builder) => {
    // 이벤트 전체 조회
    builder.addCase(fetchAllEvents.fulfilled, (state, action) => {
      state.allEvents = action.payload;
      state.isAllEventsLoading = false;
    });
    builder.addCase(fetchAllEvents.rejected, (state, action) => {
      state.isAllEventsLoading = false;
      state.allEventsError = action.payload ?? null;
    });
    builder.addCase(fetchAllEvents.pending, (state) => {
      state.isAllEventsLoading = true;
    });
    // 이벤트 상세 조회
    builder.addCase(fetchEventDetail.fulfilled, (state, action) => {
      state.eventDetail = action.payload;
      state.isEventDetailLoading = false;
    });
    builder.addCase(fetchEventDetail.rejected, (state, action) => {
      state.isEventDetailLoading = false;
      state.eventDetailError = action.payload ?? null;
    });
    builder.addCase(fetchEventDetail.pending, (state) => {
      state.isEventDetailLoading = true;
    });
  },
});

export const { resetEventState } = eventSlice.actions;
export default eventSlice.reducer;
