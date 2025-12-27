import { Search, Loader2, X, UserPlus, Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { TripFormValues } from '../schemas/tripSchema.ts';
import { useState } from 'react';
import type { UserSummary } from '../types/user.ts';
import { getSearchUsersApi, getUsersByEmailApi } from '../api/user.ts';
import { useDebounce } from '../hooks/useDebounce.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import { useFetch } from '../hooks/useFetch.tsx';
import { UserError, TripError } from '../errors/customErrors.ts';
import { Button } from './Button.tsx';
import { CTA } from './CTA.tsx';

interface TripCreateMembersStepProps {
  setStep: (step: number) => void;
}

export const TripCreateMembersStep = ({ setStep }: TripCreateMembersStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();

  const { user: currentUser } = useAuth();

  const members = watch('members') || [];
  const [searchValue, setSearchValue] = useState<string>('');

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const {
    data: users = [],
    isLoading,
    error,
  } = useFetch<UserSummary[], TripError>([debouncedSearchValue, currentUser?.email], async () => {
    if (!debouncedSearchValue.trim()) {
      return [];
    }

    const data = await getSearchUsersApi(debouncedSearchValue);
    return data.filter((u) => u.email !== currentUser?.email);
  });

  const addMember = (user: UserSummary) => {
    if (!members.includes(user.email)) {
      setValue('members', [...members, user.email]);
    }
    setSearchValue('');
  };

  const removeMember = (targetName: string) => {
    setValue(
      'members',
      members.filter((m) => m !== targetName)
    );
  };

  const { data: usersData, isLoading: isUsersLoading } = useFetch<UserSummary[], UserError>(
    [members],
    async () => {
      if (!members || members.length === 0) {
        return [];
      }
      return getUsersByEmailApi(members);
    }
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 flex-col justify-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">누구와 함께 가나요?</h1>
        <p className="text-sm text-gray-400">일행을 추가하면 여행 계획을 공유할 수 있어요</p>
      </div>

      <div className="mx-4 mt-6 relative z-20">
        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white">
          <Search className="size-5 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="이메일로 검색"
            className="w-full outline-none text-slate-700 placeholder:text-gray-300"
          />
          {isLoading && <Loader2 className="size-5 text-primary-base animate-spin" />}
        </div>
        {debouncedSearchValue && users && users.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 z-50">
            {users.map((user) => {
              const isAdded = members.includes(user.email);
              return (
                <Button
                  key={user.id}
                  type="button"
                  onClick={() => !isAdded && addMember(user)}
                  disabled={isAdded}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors
                    ${isAdded ? 'bg-gray-50 cursor-default opacity-60' : 'hover:bg-primary-50 cursor-pointer'}
                  `}
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
        {searchValue && debouncedSearchValue && !isLoading && users && users.length === 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-md p-4 text-center text-gray-400 text-sm z-50">
            검색 결과가 없습니다.
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-1 px-1">{error.message}</div>}
      </div>

      <div className="mx-4 mt-80 flex flex-wrap gap-2">
        {members.map((member) => (
          <div
            key={member}
            className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-primary-dark text-white rounded-full text-sm font-medium border border-blue-100 cursor-pointer"
          >
            {isUsersLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-12 h-3 bg-white/40 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <span>{usersData?.find((user) => user.email === member)?.nickname}</span>
                <Button
                  type="button"
                  onClick={() => removeMember(member)}
                  className="p-0.5 hover:bg-primary-dark rounded-full transition-colors cursor-pointer"
                >
                  <X size={14} />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <CTA setStep={setStep} currentStep={3} isNecessary={false} />
    </div>
  );
};
