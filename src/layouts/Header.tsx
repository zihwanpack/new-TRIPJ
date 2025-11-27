import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const { pathname } = useLocation();
  let headerTitle = '';
  switch (pathname) {
    case '/add-trip':
      headerTitle = '여행 추가하기';
      break;
    case '/add-event':
      headerTitle = '이벤트 추가하기';
      break;
    case '/my-trip':
      headerTitle = '내 여행';
      break;
    case '/mypage':
      headerTitle = '마이페이지';
      break;
    default:
      headerTitle = '';
  }
  return (
    <header className="">
      <X />
      {headerTitle}
    </header>
  );
};
