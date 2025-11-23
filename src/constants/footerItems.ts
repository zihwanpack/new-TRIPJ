import onHouse from '@/assets/navigation/onHouse.svg';
import offHouse from '@/assets/navigation/offHouse.svg';
import offSuitcaseRolling from '@/assets/navigation/offSuitcaseRolling.svg';
import onSuitcaseRolling from '@/assets/navigation/onSuitcaseRolling.svg';
import onUser from '@/assets/navigation/onUser.svg';
import offUser from '@/assets/navigation/offUser.svg';
import type { FooterItem } from '../types/routes.ts';

export const FOOTER_ITEMS: FooterItem[] = [
  { label: '홈', offEmoji: offHouse, onEmoji: onHouse, path: '/' },
  { label: '내 여행', offEmoji: offSuitcaseRolling, onEmoji: onSuitcaseRolling, path: '/trip' },
  { label: '마이페이지', offEmoji: offUser, onEmoji: onUser, path: '/mypage' },
] as const;
