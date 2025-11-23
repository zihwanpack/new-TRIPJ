import type { AppPath, HeaderPath, HeaderText } from '../types/routes.ts';

export const hiddenHeaderPage: readonly AppPath[] = ['/', '/home', '/login'] as const;

export const showFooterPages: readonly AppPath[] = ['/home', '/trip', '/mypage'] as const;

export const headerTitleMap: Record<HeaderPath, HeaderText> = {
  '/add-trip': '여행 추가하기',
  '/trip': '내 여행',
  '/add-event': '이벤트 추가하기',
  '/mypage': '마이페이지',
} as const;
