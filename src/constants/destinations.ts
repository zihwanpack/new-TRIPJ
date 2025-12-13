export type RegionType = 'domestic' | 'overseas';

export const DESTINATIONS: Record<RegionType, Record<string, string>> = {
  domestic: {
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
  },
  overseas: {
    japan: '일본',
    china: '중국',
    la: 'LA',
  },
} as const;
