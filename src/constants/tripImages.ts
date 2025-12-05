import beach from '@/assets/home/beach.webp';
import busan from '@/assets/home/busan.webp';
import china from '@/assets/home/china.webp';
import chungbuk from '@/assets/home/chungbuk.webp';
import chungnam from '@/assets/home/chungnam.webp';
import daegu from '@/assets/home/daegu.webp';
import daejeon from '@/assets/home/daejeon.webp';
import gangwon from '@/assets/home/gangwon.webp';
import gwangju from '@/assets/home/gwangju.webp';
import gyeongbuk from '@/assets/home/gyeongbuk.webp';
import gyeonggi from '@/assets/home/gyeonggi.webp';
import gyeongnam from '@/assets/home/gyeongnam.webp';
import incheon from '@/assets/home/incheon.webp';
import japan from '@/assets/home/japan.webp';
import jeju from '@/assets/home/jeju.webp';
import jeonbuk from '@/assets/home/jeonbuk.webp';
import jeonnam from '@/assets/home/jeonnam.webp';
import LA from '@/assets/home/LA.webp';
import seoul from '@/assets/home/seoul.webp';
import ulsan from '@/assets/home/ulsan.webp';

export const TRIP_IMAGE_PATHS = {
  BEACH: beach,
  'domestic busan': busan,
  'overseas china': china,
  'domestic chungbuk': chungbuk,
  'domestic chungnam': chungnam,
  'domestic daegu': daegu,
  'domestic daejeon': daejeon,
  'domestic gangwon': gangwon,
  'domestic gwangju': gwangju,
  'domestic gyeongbuk': gyeongbuk,
  'domestic gyeonggi': gyeonggi,
  'domestic gyeongnam': gyeongnam,
  'domestic incheon': incheon,
  'overseas japan': japan,
  'domestic jeju': jeju,
  'domestic jeonbuk': jeonbuk,
  'domestic jeonnam': jeonnam,
  'overseas la': LA,
  'domestic seoul': seoul,
  'domestic ulsan': ulsan,
} as const;

export type DestinationKey = keyof typeof TRIP_IMAGE_PATHS;
