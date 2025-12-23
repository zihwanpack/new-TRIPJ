import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddTripCard = () => {
  const navigate = useNavigate();
  return (
    <article
      className="flex flex-col w-[180px] h-[13  0px] items-center gap-5 justify-center relative cursor-pointer flex-shrink-0 snap-start rounded-2xl border-dashed border-2 border-gray-300"
      onClick={() => navigate('/trips/new')}
    >
      <p className="text-center">
        새로운 여행을 <br />
        시작해보세요.
      </p>
      <CirclePlus className="size-8 text-primary-base" />
    </article>
  );
};
