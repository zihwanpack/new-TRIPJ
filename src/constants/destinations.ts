export type DomesticEN =
  | 'seoul'
  | 'busan'
  | 'daejeon'
  | 'daegu'
  | 'incheon'
  | 'gwangju'
  | 'gangwon'
  | 'gyeonggi'
  | 'gyeongbuk'
  | 'gyeongnam'
  | 'chungbuk'
  | 'chungnam'
  | 'jeonbuk'
  | 'jeonnam'
  | 'jeju'
  | 'ulsan';

export type DomesticKO =
  | '서울'
  | '부산'
  | '대전'
  | '대구'
  | '인천'
  | '광주'
  | '강원'
  | '경기'
  | '경북'
  | '경남'
  | '충북'
  | '충남'
  | '전북'
  | '전남'
  | '제주'
  | '울산';

export const DOMESTIC_DESTINATIONS: Record<DomesticEN, DomesticKO> = {
  seoul: '서울',
  busan: '부산',
  daejeon: '대전',
  daegu: '대구',
  incheon: '인천',
  gwangju: '광주',
  gangwon: '강원',
  gyeonggi: '경기',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  chungbuk: '충북',
  chungnam: '충남',
  jeonbuk: '전북',
  jeonnam: '전남',
  jeju: '제주',
  ulsan: '울산',
} as const;

export type OverseasEN = 'japan' | 'china' | 'la';
export type OverseasKO = '일본' | '중국' | 'LA';

export const OVERSEAS_DESTINATIONS: Record<OverseasEN, OverseasKO> = {
  japan: '일본',
  china: '중국',
  la: 'LA',
} as const;

export const DESTINATIONS = {
  domestic:DOMESTIC_DESTINATIONS,
  overseas: OVERSEAS_DESTINATIONS,
} as const;


