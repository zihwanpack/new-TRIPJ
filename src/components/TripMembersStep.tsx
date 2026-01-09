import { Search, Loader2, X, UserPlus, Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { TripFormValues } from '../schemas/tripSchema.ts';
import { useMemo, useState, type ChangeEvent } from 'react';
import type { UserSummary } from '../types/user.ts';
import { useDebounce } from '../hooks/useDebounce.tsx';
import { Button } from './Button.tsx';
import { CTA } from './CTA.tsx';
import { Input } from './Input.tsx';
import { Typography } from './Typography.tsx';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { userQueryKeys } from '../constants/queryKeys.ts';
import { getSearchUsersApi, getUsersByEmailApi } from '../api/user.ts';

interface TripMembersStepProps {
  setStep: (step: number) => void;
}

export const TripMembersStep = ({ setStep }: TripMembersStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();
  const members = watch('members');
  const [searchValue, setSearchValue] = useState<string>('');
  const [locallyAddedUsers, setLocallyAddedUsers] = useState<UserSummary[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const {
    data: usersByEmails = [],
    isLoading: isUsersByEmailsLoading,
    isError: isUsersByEmailsError,
    error: usersByEmailsError,
  } = useQuery({
    queryKey: userQueryKeys.byEmails(members),
    queryFn: () => getUsersByEmailApi(members),
    enabled: members.length > 0,
  });

  const {
    data: searchedUsers = [],
    isLoading: isSearchUsersLoading,
    isError: isSearchUsersError,
    error: searchUsersError,
  } = useQuery({
    queryKey: userQueryKeys.search(debouncedSearchValue),
    queryFn: () => getSearchUsersApi(debouncedSearchValue),
    enabled: debouncedSearchValue.trim().length > 0,
  });

  const selectedMembers = useMemo(() => {
    const allUsers = [...usersByEmails, ...locallyAddedUsers];

    return members.map((email) => {
      return allUsers.find((user) => user.email === email);
    });
  }, [usersByEmails, locallyAddedUsers, members]);

  const addMember = (user: UserSummary) => {
    if (!members.includes(user.email)) {
      setValue('members', [...members, user.email]);

      setLocallyAddedUsers((prev) => [...prev, user]);
    }
    setSearchValue('');
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
        <Typography variant="h1">누구와 함께 가나요?</Typography>
        <Typography variant="helper" color="muted">
          일행을 추가하면 여행 계획을 공유할 수 있어요
        </Typography>
      </div>

      <div className="mx-4 mt-6 relative z-20">
        <div className="flex items-center justify-start gap-3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white dark:bg-slate-900">
          <Search className="size-5 text-gray-400 dark:text-gray-500" />
          <Input
            containerClassName="min-w-5/6"
            type="text"
            value={searchValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            placeholder="이메일로 검색"
          />
          {isSearchUsersLoading && <Loader2 className="size-5 text-primary-base animate-spin" />}
        </div>
        {isUsersByEmailsLoading && (
          <div className="mx-4 mt-4 text-sm text-gray-400">멤버 정보를 불러오는 중...</div>
        )}

        {isUsersByEmailsError && (
          <div className="mx-4 mt-4 text-sm text-red-500">
            {(usersByEmailsError as Error)?.message ?? '멤버 정보를 불러오지 못했습니다.'}
          </div>
        )}
        {!isSearchUsersLoading && searchedUsers && searchedUsers.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl max-h-60 z-50">
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
                      ? 'bg-gray-50 dark:bg-slate-800 cursor-default opacity-60'
                      : 'hover:bg-primary-50 dark:hover:bg-slate-800 cursor-pointer'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {user.nickname}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{user.email}</span>
                  </div>
                  {isAdded ? (
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Check size={14} /> 추가됨
                    </span>
                  ) : (
                    <UserPlus size={18} className="text-gray-300 dark:text-gray-500" />
                  )}
                </Button>
              );
            })}
          </div>
        )}
        {debouncedSearchValue &&
          !isSearchUsersLoading &&
          searchedUsers &&
          searchedUsers.length === 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-md p-4 text-center text-gray-400 dark:text-gray-500 text-sm z-50">
              검색 결과가 없습니다.
            </div>
          )}
        {isSearchUsersError && (
          <div className="text-red-500 text-sm mt-1 px-1">{searchUsersError.message}</div>
        )}
      </div>

      <div className="mx-4 mt-70 flex flex-wrap gap-2 dark:bg-slate-900">
        {selectedMembers.map((member) => (
          <div
            key={member?.email}
            className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-primary-dark dark:bg-slate-800 text-white rounded-full text-sm font-medium border border-blue-100 cursor-pointer"
          >
            <span className="text-slate-900 dark:text-slate-100">{member?.nickname}</span>
            <Button
              type="button"
              onClick={() => removeMember(member?.email ?? '')}
              className="p-0.5 hover:bg-primary-dark dark:hover:bg-primary-dark rounded-full transition-colors cursor-pointer"
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
