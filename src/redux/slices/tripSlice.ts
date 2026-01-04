import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CreateTripRequest, Trip } from '../../types/trip.ts';
import {
  createTripApi,
  deleteTripApi,
  getMyOnGoingTripApi,
  getMyPastTripsApi,
  getMyUpcomingTripsApi,
  getTripDetailApi,
} from '../../api/trip.ts';

export const fetchTripDetail = createAsyncThunk<Trip, { id: number }, { rejectValue: string }>(
  'trips/fetchTripDetail',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await getTripDetailApi({ id });
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const fetchOngoingTrip = createAsyncThunk<Trip, { id: number }, { rejectValue: string }>(
  'trips/fetchOngoingTrip',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await getMyOnGoingTripApi({ id });
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const fetchUpcomingTrips = createAsyncThunk<Trip[], { id: number }, { rejectValue: string }>(
  'trips/fetchUpcomingTrips',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await getMyUpcomingTripsApi({ id });
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const fetchPastTrips = createAsyncThunk<Trip[], { id: number }, { rejectValue: string }>(
  'trips/fetchPastTrips',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await getMyPastTripsApi({ id });
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const fetchAllMyTrips = createAsyncThunk<void, { id: number }, { rejectValue: string }>(
  'trip/fetchAllMyTrips',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      await Promise.allSettled([
        dispatch(fetchOngoingTrip({ id })),
        dispatch(fetchUpcomingTrips({ id })),
        dispatch(fetchPastTrips({ id })),
      ]);
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const deleteTrip = createAsyncThunk<null, { id: number }, { rejectValue: string }>(
  'trip/deleteTrip',
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteTripApi({ id });
      return null;
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const createTrip = createAsyncThunk<
  Trip,
  { trip: CreateTripRequest },
  { rejectValue: string }
>('trip/createTrip', async ({ trip }, { rejectWithValue }) => {
  try {
    return await createTripApi(trip);
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export interface TripState {
  tripDetail: Trip | null;
  pastTrips: Trip[];
  ongoingTrip: Trip | null;
  upcomingTrips: Trip[];
  deleteTrip: Trip | null;
  createTrip: Trip | null;

  isTripDetailLoading: boolean;
  isTripPastLoading: boolean;
  isTripOngoingLoading: boolean;
  isTripUpcomingLoading: boolean;
  isDeleteTripLoading: boolean;
  isCreateTripLoading: boolean;

  tripDetailError: string | null;
  tripPastError: string | null;
  tripOngoingError: string | null;
  tripUpcomingError: string | null;
  deleteTripError: string | null;
  createTripError: string | null;
}

const initialState: TripState = {
  tripDetail: null,
  pastTrips: [],
  ongoingTrip: null,
  upcomingTrips: [],
  deleteTrip: null,
  createTrip: null,

  isTripDetailLoading: false,
  isTripPastLoading: false,
  isTripOngoingLoading: false,
  isTripUpcomingLoading: false,
  isDeleteTripLoading: false,
  isCreateTripLoading: false,

  tripDetailError: null,
  tripPastError: null,
  tripOngoingError: null,
  tripUpcomingError: null,
  deleteTripError: null,
  createTripError: null,
};

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    clearTripDetail: (state) => {
      state.tripDetail = null;
      state.tripDetailError = null;
    },
    resetTripState: () => initialState,
  },

  extraReducers: (builder) => {
    // 여행 상세 조회
    builder.addCase(fetchTripDetail.fulfilled, (state, action) => {
      state.tripDetail = action.payload;
      state.isTripDetailLoading = false;
    });
    builder.addCase(fetchTripDetail.rejected, (state, action) => {
      state.isTripDetailLoading = false;
      state.tripDetailError = action.payload ?? null;
    });
    builder.addCase(fetchTripDetail.pending, (state) => {
      state.isTripDetailLoading = true;
    });
    // 진행 중인 여행 조회
    builder.addCase(fetchOngoingTrip.fulfilled, (state, action) => {
      state.ongoingTrip = action.payload;
      state.isTripOngoingLoading = false;
    });
    builder.addCase(fetchOngoingTrip.rejected, (state, action) => {
      state.isTripOngoingLoading = false;
      state.tripOngoingError = action.payload ?? null;
    });
    builder.addCase(fetchOngoingTrip.pending, (state) => {
      state.isTripOngoingLoading = true;
    });
    // 예정된 여행 조회
    builder.addCase(fetchUpcomingTrips.fulfilled, (state, action) => {
      state.upcomingTrips = action.payload;
      state.isTripUpcomingLoading = false;
    });
    builder.addCase(fetchUpcomingTrips.rejected, (state, action) => {
      state.isTripUpcomingLoading = false;
      state.tripUpcomingError = action.payload ?? null;
    });
    builder.addCase(fetchUpcomingTrips.pending, (state) => {
      state.isTripUpcomingLoading = true;
    });
    // 지나간 여행 조회
    builder.addCase(fetchPastTrips.fulfilled, (state, action) => {
      state.pastTrips = action.payload;
      state.isTripPastLoading = false;
    });
    builder.addCase(fetchPastTrips.rejected, (state, action) => {
      state.isTripPastLoading = false;
      state.tripPastError = action.payload ?? null;
    });
    builder.addCase(fetchPastTrips.pending, (state) => {
      state.isTripPastLoading = true;
    });
    // 여행 삭제
    builder.addCase(deleteTrip.fulfilled, (state, action) => {
      state.deleteTrip = action.payload;
      state.isDeleteTripLoading = false;
    });
    builder.addCase(deleteTrip.rejected, (state, action) => {
      state.isDeleteTripLoading = false;
      state.deleteTripError = action.payload ?? null;
    });
    builder.addCase(deleteTrip.pending, (state) => {
      state.isDeleteTripLoading = true;
    });
    // 여행 생성
    builder.addCase(createTrip.fulfilled, (state, action) => {
      state.createTrip = action.payload;
      state.isCreateTripLoading = false;
    });
    builder.addCase(createTrip.rejected, (state, action) => {
      state.isCreateTripLoading = false;
      state.createTripError = action.payload ?? null;
    });
    builder.addCase(createTrip.pending, (state) => {
      state.isCreateTripLoading = true;
    });
  },
});

export const { clearTripDetail, resetTripState } = tripSlice.actions;
export default tripSlice.reducer;
