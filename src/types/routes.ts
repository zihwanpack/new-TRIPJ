export type AppPath =
  | '/'
  | '/home'
  | '/login'
  | '/signup'
  | '/add-trip'
  | '/trip'
  | '/add-event'
  | '/mypage';

export type HeaderText = '여행 추가하기' | '내 여행' | '이벤트 추가하기' | '마이페이지';

export type HeaderPath = '/add-trip' | '/trip' | '/add-event' | '/mypage';

export type FooterPath = '/' | '/trip' | '/mypage';

export type FooterLabel = '홈' | '내 여행' | '마이페이지';

export type FooterItem = {
  label: FooterLabel;
  offEmoji: string;
  onEmoji: string;
  path: FooterPath;
};
