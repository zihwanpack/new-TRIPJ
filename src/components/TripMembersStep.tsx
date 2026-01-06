import { Search, Loader2, X, UserPlus, Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { TripFormValues } from '../schemas/tripSchema.ts';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { UserSummary } from '../types/user.ts';
import { useDebounce } from '../hooks/useDebounce.tsx';
import { Button } from './Button.tsx';
import { CTA } from './CTA.tsx';
import { Input } from './Input.tsx';
import {
  clearSearchedUsers,
  clearUsersByEmails,
  getSearchUsers,
  getUsersByEmails,
  type UserState,
} from '../redux/slices/userSlice.ts';
import { useDispatch, useSelector } from '../redux/hooks/useCustomRedux.tsx';
import clsx from 'clsx';
import type { TripState } from '../redux/slices/tripSlice.ts';

interface TripMembersStepProps {
  setStep: (step: number) => void;
}

export const TripMembersStep = ({ setStep }: TripMembersStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();
  const dispatch = useDispatch();

  const { user: userState, trip: tripState } = useSelector(
    (state: { user: UserState; trip: TripState }) => ({
      user: state.user,
      trip: state.trip,
    })
  );

  const { searchedUsers, isSearchUsersLoading, searchUsersError, usersByEmails } = userState;
  const { tripDetail } = tripState;

  const members = watch('members');
  const [searchValue, setSearchValue] = useState<string>('');
  const [locallyAddedUsers, setLocallyAddedUsers] = useState<UserSummary[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 300);

  useEffect(() => {
    if (!tripDetail?.members?.length) return;
    dispatch(getUsersByEmails(tripDetail.members));

    return () => {
      dispatch(clearUsersByEmails());
    };
  }, [tripDetail?.members]);

  const selectedMembers = useMemo(() => {
    const allUsers = [...usersByEmails, ...locallyAddedUsers];

    return members.map((email) => {
      return allUsers.find((user) => user.email === email);
    });
  }, [usersByEmails, locallyAddedUsers, members]);

  useEffect(() => {
    if (!debouncedSearchValue.trim()) {
      dispatch(clearSearchedUsers());
      return;
    }

    dispatch(getSearchUsers({ query: debouncedSearchValue }));
  }, [debouncedSearchValue, dispatch]);

  const addMember = (user: UserSummary) => {
    if (!members.includes(user.email)) {
      setValue('members', [...members, user.email]);

      setLocallyAddedUsers((prev) => [...prev, user]);
    }
    setSearchValue('');
    dispatch(clearSearchedUsers());
  };

  const removeMember = (email: string) => {
    setValue(
      'members',
      members.filter((m) => m !== email)
    );
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 flex-col justify-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">누구와 함께 가나요?</h1>
        <p className="text-sm text-gray-400">일행을 추가하면 여행 계획을 공유할 수 있어요</p>
      </div>

      <div className="mx-4 mt-6 relative z-20">
        <div className="flex items-center justify-start gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white">
          <Search className="size-5 text-gray-400" />
          <Input
            containerClassName="min-w-5/6"
            type="text"
            value={searchValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            placeholder="이메일로 검색"
          />
          {isSearchUsersLoading && <Loader2 className="size-5 text-primary-base animate-spin" />}
        </div>
        {debouncedSearchValue && searchedUsers && searchedUsers.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 z-50">
            {searchedUsers.map((user) => {
              const isAdded = members.includes(user.email);
              return (
                <Button
                  key={user.id}
                  type="button"
                  onClick={() => !isAdded && addMember(user)}
                  disabled={isAdded}
                  className={clsx(
                    'w-full text-left px-4 py-3 flex items-center justify-between transition-colors',
                    isAdded
                      ? 'bg-gray-50 cursor-default opacity-60'
                      : 'hover:bg-primary-50 cursor-pointer'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{user.nickname}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                  {isAdded ? (
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <Check size={14} /> 추가됨
                    </span>
                  ) : (
                    <UserPlus size={18} className="text-gray-300" />
                  )}
                </Button>
              );
            })}
          </div>
        )}
        {searchValue &&
          debouncedSearchValue &&
          !isSearchUsersLoading &&
          searchedUsers &&
          searchedUsers.length === 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-md p-4 text-center text-gray-400 text-sm z-50">
              검색 결과가 없습니다.
            </div>
          )}
        {searchUsersError && (
          <div className="text-red-500 text-sm mt-1 px-1">{searchUsersError}</div>
        )}
      </div>

      <div className="mx-4 mt-80 flex flex-wrap gap-2">
        {selectedMembers.map((member) => (
          <div
            key={member?.email}
            className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-primary-dark text-white rounded-full text-sm font-medium border border-blue-100 cursor-pointer"
          >
            <span>{member?.nickname}</span>
            <Button
              type="button"
              onClick={() => removeMember(member?.email ?? '')}
              className="p-0.5 hover:bg-primary-dark rounded-full transition-colors cursor-pointer"
            >
              <X size={14} />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <CTA
        setStep={setStep}
        currentStep={3}
        isNecessary={false}
        previousButtonText="이전"
        nextButtonText="다음"
      />
    </div>
  );
};
