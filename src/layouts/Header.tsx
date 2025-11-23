import { X } from 'lucide-react';

type HeaderText = '여행 추가하기' | '내 여행' | '이벤트 추가하기' | '마이페이지';

type HeaderProps = {
  text: HeaderText;
};
export const Header = ({ text }: HeaderProps) => {
  return (
    <header className="">
      <X />
      {text}
    </header>
  );
};
