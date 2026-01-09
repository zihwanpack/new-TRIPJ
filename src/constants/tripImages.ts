const BASE_IMAGE_PATH = '/images/';

export const TRIP_IMAGE_PATHS = {
  beach: `${BASE_IMAGE_PATH}/beach.webp`,
  busan: `${BASE_IMAGE_PATH}/Busan.webp`,
  china: `${BASE_IMAGE_PATH}/China.webp`,
  chungbuk: `${BASE_IMAGE_PATH}/chungbuk.webp`,
  chungnam: `${BASE_IMAGE_PATH}/chungnam.webp`,
  daegu: `${BASE_IMAGE_PATH}/daegu.webp`,
  daejeon: `${BASE_IMAGE_PATH}/daejeon.webp`,
  gangwon: `${BASE_IMAGE_PATH}/gangwon.webp`,
  gwangju: `${BASE_IMAGE_PATH}/gwangju.webp`,
  gyeongbuk: `${BASE_IMAGE_PATH}/gyeongbuk.webp`,
  gyeonggi: `${BASE_IMAGE_PATH}/gyeonggi.webp`,
  gyeongnam: `${BASE_IMAGE_PATH}/gyeongnam.webp`,
  incheon: `${BASE_IMAGE_PATH}/incheon.webp`,
  japan: `${BASE_IMAGE_PATH}/Japan.webp`,
  jeju: `${BASE_IMAGE_PATH}/jeju.webp`,
  jeonbuk: `${BASE_IMAGE_PATH}/jeonbuk.webp`,
  jeonnam: `${BASE_IMAGE_PATH}/jeonnam.webp`,
  LA: `${BASE_IMAGE_PATH}/LA.webp`,
  seoul: `${BASE_IMAGE_PATH}/Seoul.webp`,
  ulsan: `${BASE_IMAGE_PATH}/ulsan.webp`,
} as const;

export type DestinationKey = keyof typeof TRIP_IMAGE_PATHS;

export const DESTINATION_KEYS = Object.keys(TRIP_IMAGE_PATHS) as [
  DestinationKey,
  ...DestinationKey[],
];
