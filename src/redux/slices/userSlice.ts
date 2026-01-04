import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { UserSummary } from '../../types/user.ts';
import { getSearchUsersApi, getUsersByEmailApi } from '../../api/user.ts';

export const getSearchUsers = createAsyncThunk<
  UserSummary[],
  { query: string },
  { rejectValue: string }
>('user/getSearchUsers', async ({ query }, { rejectWithValue }) => {
  try {
    return await getSearchUsersApi(query);
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const getUsersByEmails = createAsyncThunk<UserSummary[], string[], { rejectValue: string }>(
  'user/getUsersByEmails',
  async (emails, { rejectWithValue }) => {
    try {
      return await getUsersByEmailApi(emails);
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export interface UserState {
  searchedUsers: UserSummary[];
  usersByEmails: UserSummary[];

  isSearchUsersLoading: boolean;
  isUsersByEmailsLoading: boolean;

  searchUsersError: string | null;
  usersByEmailsError: string | null;
}

const initialState: UserState = {
  searchedUsers: [],
  usersByEmails: [],

  isSearchUsersLoading: false,
  isUsersByEmailsLoading: false,

  searchUsersError: null,
  usersByEmailsError: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSearchedUsers: (state) => {
      state.searchedUsers = [];
      state.searchUsersError = null;
    },
    clearUsersByEmails: (state) => {
      state.usersByEmails = [];
      state.usersByEmailsError = null;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSearchUsers.fulfilled, (state, action) => {
      state.searchedUsers = action.payload;
      state.isSearchUsersLoading = false;
    });
    builder.addCase(getSearchUsers.rejected, (state, action) => {
      state.isSearchUsersLoading = false;
      state.searchUsersError = action.payload ?? null;
    });
    builder.addCase(getSearchUsers.pending, (state) => {
      state.isSearchUsersLoading = true;
    });

    builder.addCase(getUsersByEmails.fulfilled, (state, action) => {
      state.usersByEmails = action.payload;
      state.isUsersByEmailsLoading = false;
    });
    builder.addCase(getUsersByEmails.rejected, (state, action) => {
      state.isUsersByEmailsLoading = false;
      state.usersByEmailsError = action.payload ?? null;
    });
    builder.addCase(getUsersByEmails.pending, (state) => {
      state.isUsersByEmailsLoading = true;
    });
  },
});

export const { clearSearchedUsers, clearUsersByEmails, resetUserState } = userSlice.actions;
export default userSlice.reducer;
