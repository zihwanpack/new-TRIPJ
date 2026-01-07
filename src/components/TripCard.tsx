import { CirclePlus } from 'lucide-react';
import { Card } from './Card';
import clsx from 'clsx';
import { Typography } from './Typography.tsx';

interface BaseTripCardProps {
  size?: 'small' | 'large' | 'largest' | 'myTrips';
  onClick: () => void;
}

interface AddTripCardProps extends BaseTripCardProps {
  variant: 'add';
  tripImage?: never;
  title?: never;
  date?: never;
  badgeText?: never;
}

interface DisplayTripCardProps extends BaseTripCardProps {
  variant?: 'default';
  tripImage: string;
  title: string;
  date: string;
  badgeText?: string;
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
  myTrips: {
    container: 'w-full min-h-[100px]',
    title: 'text-[16px]',
    date: 'text-[13px]',
  },
} as const;

export const TripCard = ({
  size = 'large',
  onClick,
  variant = 'default',
  tripImage,
  title,
  date,
  badgeText,
}: TripCardProps) => {
  const cardStyles = TRIP_CARD_STYLES[size];

  if (variant === 'add') {
    return (
      <Card
        onClick={onClick}
        className={clsx(
          'flex flex-col items-center justify-center gap-4',
          'border-dashed border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          cardStyles.container
        )}
      >
        <Typography variant="body" color="muted" className="text-center">
          새로운 여행을 <br />
          시작해보세요.
        </Typography>
        <CirclePlus className="size-8 text-primary-base" />
      </Card>
    );
  }

  if (size === 'myTrips') {
    return (
      <Card
        onClick={onClick}
        className={clsx(
          'flex items-center gap-4',
          'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-sm',
          'rounded-2xl px-4',
          cardStyles.container
        )}
      >
        <div className="size-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
          <img
            src={tripImage}
            alt={`${title} 여행 이미지`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <Typography variant="h3" className={clsx(cardStyles.title, 'truncate')}>
              {title}
            </Typography>
            {badgeText && (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                {badgeText}
              </span>
            )}
          </div>

          <Typography
            variant="bodySmall"
            color="muted"
            className={clsx(cardStyles.date, 'mt-1 truncate')}
          >
            {date}
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <Card onClick={onClick} className={clsx('relative', cardStyles.container)}>
      <img
        src={tripImage}
        alt={`${title} 여행 이미지`}
        className="w-full h-full object-cover rounded-2xl"
      />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-4 text-white z-10">
        <Typography variant="h3" className={clsx(cardStyles.title, 'truncate pr-2 text-white')}>
          {title}
        </Typography>
        <Typography variant="bodySmall" className={clsx(cardStyles.date, 'opacity-90 text-white')}>
          {date}
        </Typography>
      </div>
    </Card>
  );
};
