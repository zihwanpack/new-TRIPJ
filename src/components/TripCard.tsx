import { useNavigate } from 'react-router-dom';

export interface TripCardProps {
  id: number;
  tripImage: string;
  title: string;
  date: string;
  size: 'small' | 'large';
}

const TRIP_CARD_STYLES = {
  small: {
    container: 'w-[160px] h-[140px]',
    title: 'text-[15px]',
    date: 'text-[11px]',
  },
  large: {
    container: 'w-[180px] h-[220px]',
    title: 'text-[17px]',
    date: 'text-[13px]',
  },
} as const;

export const TripCard = ({ id, tripImage, title, date, size }: TripCardProps) => {
  const cardStyles = TRIP_CARD_STYLES[size];
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/trips/${id}`)}
      className={`flex flex-col relative cursor-pointer flex-shrink-0 snap-start ${cardStyles.container}`}
    >
      <img src={tripImage} alt="여행 이미지" className="w-full h-full object-cover rounded-2xl" />
      <div className="absolute bottom-3 left-4 text-white">
        <p className={`${cardStyles.title} font-semibold`}>{title}</p>
        <p className={`${cardStyles.date}`}>{date}</p>
      </div>
    </article>
  );
};
