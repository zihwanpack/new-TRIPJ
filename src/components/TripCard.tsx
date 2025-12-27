import { CirclePlus } from 'lucide-react';
import { Card } from './Card';

interface BaseTripCardProps {
  size?: 'small' | 'large' | 'largest';
  onClick: () => void;
}

interface AddTripCardProps extends BaseTripCardProps {
  variant: 'add';
  tripImage?: never;
  title?: never;
  date?: never;
}

interface DisplayTripCardProps extends BaseTripCardProps {
  variant?: 'default';
  tripImage: string;
  title: string;
  date: string;
}

export type TripCardProps = AddTripCardProps | DisplayTripCardProps;

const TRIP_CARD_STYLES = {
  small: {
    container: 'w-[160px] h-[120px]',
    title: 'text-[15px]',
    date: 'text-[11px]',
  },
  large: {
    container: 'w-[180px] h-[130px]',
    title: 'text-[17px]',
    date: 'text-[13px]',
  },
  largest: {
    container: 'w-[300px] h-[130px]',
    title: 'text-[20px]',
    date: 'text-[16px]',
  },
} as const;

export const TripCard = (props: TripCardProps) => {
  const { size = 'large', onClick, variant = 'default' } = props;
  const cardStyles = TRIP_CARD_STYLES[size];

  if (variant === 'add') {
    return (
      <Card
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-4 border-dashed border-2 border-gray-300 hover:bg-gray-50 transition-colors ${cardStyles.container}`}
      >
        <p className="text-center text-gray-600 font-medium text-sm">
          새로운 여행을 <br />
          시작해보세요.
        </p>
        <CirclePlus className="size-8 text-primary-base" />
      </Card>
    );
  }

  const { tripImage, title, date } = props;

  return (
    <Card onClick={onClick} className={`relative ${cardStyles.container}`}>
      <img
        src={tripImage}
        alt={`${title} 여행 이미지`}
        className="w-full h-full object-cover rounded-2xl"
      />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-4 text-white z-10">
        <p className={`${cardStyles.title} font-semibold truncate pr-2`}>{title}</p>
        <p className={`${cardStyles.date} opacity-90`}>{date}</p>
      </div>
    </Card>
  );
};
