# 🧳 TRIPJ

> **여행 일정을 함께 계획하고 공유하는 협업 플랫폼**
>
> **프로젝트 기간**: 2025.11.20 ~ 2026.01.21

여행 계획을 세우고, 일정을 관리하며, 동행자들과 공유할 수 있는 웹 애플리케이션입니다.

---

## 📋 목차

- [서비스 소개](#-서비스-소개)
- [기획 배경 및 문제 정의](#-기획-배경-및-문제-정의)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [기술적 고민 & 문제 해결](#-기술적-고민--문제-해결)
- [실행 방법](#-실행-방법)
- [배포 정보](#-배포-정보)

---

## 🎯 서비스 소개

**TRIPJ**는 여행 계획을 체계적으로 관리하고 동행자들과 실시간으로 공유할 수 있는 협업 중심의 여행 관리 플랫폼입니다.

- ✈️ **여행 일정 관리**: 여행 생성부터 상세 일정까지 체계적으로 관리
- 📍 **지도 기반 시각화**: Google Maps를 활용한 여행지 위치 시각화
- 👥 **멤버 협업**: 동행자 초대 및 공동 일정 관리
- 💰 **비용 관리**: 카테고리별 지출 내역 추적 및 관리
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험

---

## 💡 기획 배경 및 문제 정의

### 문제 상황

여행을 계획할 때 많은 사람들이 다음과 같은 어려움을 겪습니다:

1. **일정 관리의 복잡성**
   - 여러 앱과 메모장에 흩어진 정보 관리
   - 날짜, 장소, 시간 등 정보의 불일치
   - 동행자들과의 정보 공유 어려움

2. **협업의 비효율성**
   - 카카오톡, 이메일 등 여러 채널에 분산된 소통
   - 실시간 업데이트 부재
   - 누가 무엇을 계획했는지 추적 어려움

3. **비용 관리의 어려움**
   - 지출 내역의 수기 기록 및 분실 위험
   - 카테고리별 정리 및 정산의 복잡성

### 해결 방안

TRIPJ는 이러한 문제들을 해결하기 위해:

- **중앙화된 일정 관리**: 모든 여행 정보를 한 곳에서 관리
- **실시간 협업**: 동행자들과 공유되는 일정 업데이트
- **시각적 표현**: 지도를 통한 직관적인 여행지 확인
- **체계적인 비용 관리**: 카테고리별 자동 분류 및 정산 지원

---

## ✨ 주요 기능

### 1. 여행 관리 (Trip Management)

- **여행 생성/수정/삭제**
  - 여행 제목, 목적지, 기간 설정
  - 국내/해외 여행 구분
  - 멤버 초대 및 관리

- **여행 목록 조회**
  - 진행 중인 여행
  - 다가오는 여행
  - 다녀온 여행 (커서 기반 페이지네이션)

### 2. 이벤트 관리 (Event Management)

- **이벤트 생성/수정/삭제**
  - 이벤트명, 장소, 날짜/시간 설정
  - 카테고리별 비용 입력 (식비, 교통비, 숙박비 등)
  - Google Maps를 통한 위치 확인

- **지도 시각화**
  - 모든 이벤트 위치를 지도에 마커로 표시
  - 주소를 좌표로 변환하여 정확한 위치 표시
  - 마커 호버 시 이벤트 상세 정보 표시

### 3. 인증 및 사용자 관리

- **소셜 로그인**
  - Google, Kakao, Naver 소셜 로그인 지원
  - JWT 기반 인증 및 자동 토큰 갱신

- **마이페이지**
  - 사용자 정보 관리
  - 여행 히스토리 조회

### 4. UI/UX

- **다크모드 지원**: 시스템 설정에 따른 자동 테마 전환
- **모바일 중심 디자인**: 모바일 환경에 최적화된 레이아웃 (최대 너비 제한: 448px)
- **애니메이션**: Framer Motion을 활용한 부드러운 페이지 전환
- **로딩 상태 관리**: Suspense와 React Query를 활용한 효율적인 데이터 페칭

---

## 🛠 기술 스택

### Frontend

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | React 19 |
| **언어** | TypeScript |
| **빌드 도구** | Vite |
| **라우팅** | React Router DOM |
| **상태 관리** | TanStack Query (서버 상태) |
| **스타일링** | Tailwind CSS |
| **폼 관리** | React Hook Form + Zod |
| **애니메이션** | Framer Motion |
| **HTTP 클라이언트** | Axios |
| **날짜 처리** | date-fns, dayjs |
| **UI 컴포넌트** | Lucide React (아이콘) |

### 개발 도구

- **린터**: ESLint
- **포맷터**: Prettier
- **타입 체크**: TypeScript ESLint 

### 외부 서비스

- **지도**: Google Maps API
- **인증**: 소셜 로그인 (Google, Kakao, Naver)
- **배포**: Vercel

---

## 🔧 기술적 고민 & 문제 해결

### 1. 타입 안정성 확보: Zod + TypeScript

#### 문제 상황
- API 응답 데이터의 타입 불일치로 인한 런타임 에러
- 환경 변수 누락 또는 잘못된 값으로 인한 배포 실패
- 폼 데이터 검증 로직의 중복 및 불일치

#### 해결 방안

**Zod 스키마를 통한 런타임 검증**

```typescript
// API 응답 검증
export const tripSchema = z.object({
  id: z.number(),
  title: z.string(),
  destination: z.enum(DESTINATION_KEYS),
  startDate: z.string(),
  endDate: z.string(),
});

// 환경 변수 검증
export const envSchema = z.object({
  VITE_API_URL: z.url('API URL이 올바르지 않습니다.'),
  VITE_GOOGLE_MAPS_API_KEY: z.string().min(1, 'Google Maps API Key가 올바르지 않습니다.'),
  // ...
});

// 폼 데이터 검증
export const tripFormSchema = z.object({
  title: z.string().min(1, '여행 제목을 입력해주세요').max(30),
  destination: z.enum([...DESTINATION_KEYS, '']),
  // ...
});
```

**통합된 requestHandler 패턴**

모든 API 호출에 Zod 스키마를 적용하여 응답 데이터를 검증:

```typescript
export const requestHandler = async <T>({
  request,
  ErrorClass,
  schema,
}: RequestHandlerParams<T>): Promise<T> => {
  const { data } = await request();
  const parsed = schema.safeParse(data.result);
  
  if (!parsed.success) {
    throw new ErrorClass(`Schema validation failed: ${parsed.error.message}`, 500);
  }
  
  return parsed.data;
};
```

**도입 이유**
- **런타임 안정성**: TypeScript는 컴파일 타임에만 검증하지만, Zod는 런타임에도 검증하여 실제 API 응답이 예상과 다를 때 즉시 감지
- **개발자 경험**: TypeScript 타입을 Zod 스키마에서 자동 추론 (`z.infer<typeof schema>`)

### 2. 자동 토큰 갱신 메커니즘

#### 문제 상황
- Access Token 만료 시 매번 수동으로 로그인해야 하는 불편함
- 401 에러 발생 시 사용자 경험 저하

#### 해결 방안

**Axios 인터셉터를 활용한 자동 토큰 갱신**

```typescript
authenticatedClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as CustomInternalAxiosRequestConfig;

    // 토큰 갱신 API 호출 시 401이면 로그인 페이지로 리다이렉트
    if (error.response?.status === 401 && original.url?.includes('/auth/token')) {
      window.location.href = '/login';
      throw new AuthError('인증에 실패했습니다.', 401);
    }

    // 일반 API 호출 시 401이면 토큰 갱신 후 재시도
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await authenticatedClient.post('/auth/token');
        return authenticatedClient(original); // 원래 요청 재시도
      } catch (err) {
        throw new AuthError('인증에 실패했습니다.', 401);
      }
    }

    return Promise.reject(error);
  }
);
```

**효과**
- 사용자가 인지하지 못하는 사이에 자동으로 토큰 갱신
- 세션 유지 시간 연장으로 사용자 경험 개선

### 3. Google Maps 비동기 로딩 최적화

#### 문제 상황
- Google Maps API 스크립트가 초기 로드 시 모든 페이지에 로드되어 번들 크기 증가
- 지도가 필요한 페이지에서만 로드되어야 함

#### 해결 방안

**동적 스크립트 로딩**

```typescript
export const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLE_MAPS_API_KEY}&language=ko`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps 로드 실패'));
    document.head.appendChild(script);
  });
};
```

**효과**
- 지도가 필요한 컴포넌트에서만 스크립트 로드
- 초기 번들 크기 감소 및 로딩 속도 개선

### 4. 서버 상태 관리: TanStack Query

#### 문제 상황
- 여러 컴포넌트에서 동일한 API 호출 중복
- 캐싱 부재로 인한 불필요한 네트워크 요청
- 로딩/에러 상태 관리의 복잡성

#### 해결 방안

**TanStack Query를 활용한 중앙화된 서버 상태 관리**

```typescript
// Query Options 분리 및 재사용
export const useOngoingTripQueryOptions = () => ({
  staleTime: 1000 * 60 * 5, // 5분
  gcTime: 1000 * 60 * 10, // 10분
});

// Suspense와 함께 사용
const [ongoingQuery, upcomingQuery, pastQuery] = useSuspenseQueries({
  queries: [
    {
      queryKey: tripQueryKeys.ongoing(userId),
      queryFn: () => getMyOnGoingTripApi({ userId }),
      ...useOngoingTripQueryOptions(),
    },
    // ...
  ],
});
```

**효과**
- 자동 캐싱 및 백그라운드 리페칭
- Suspense와의 통합으로 로딩 상태 관리 간소화
- Optimistic Updates를 통한 즉각적인 UI 반영

### 5. 환경 변수 타입 안정성

#### 문제 상황
- 환경 변수 누락 시 런타임 에러 발생
- 잘못된 형식의 환경 변수 값으로 인한 예상치 못한 동작

#### 해결 방안

**Zod를 활용한 환경 변수 검증**

```typescript
export const envSchema = z.object({
  VITE_API_URL: z.url('API URL이 올바르지 않습니다.'),
  VITE_GOOGLE_MAPS_API_KEY: z.string().min(1, 'Google Maps API Key가 올바르지 않습니다.'),
  // ...
});

export const env = envSchema.parse(import.meta.env);
```

**효과**
- 애플리케이션 시작 시점에 환경 변수 검증
- 누락되거나 잘못된 값에 대한 명확한 에러 메시지 제공
- 개발 환경과 프로덕션 환경의 일관성 보장

---

## 🚀 실행 방법

### 사전 요구사항

- **Node.js**: 18.x 이상
- **pnpm**: 8.x 이상 (또는 npm, yarn)

### 로컬 실행 방법

1. **저장소 클론**

```bash
git clone https://github.com/zihwanpack/new-TRIPJ.git
cd new-TRIPJ
```

2. **의존성 설치**

```bash
pnpm install
```

3. **환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# API 설정
VITE_API_URL=https://your-api-url.com

# Google Maps 설정
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_GOOGLE_MAP_ID=your-google-map-id

# 소셜 로그인 Callback URL
VITE_GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback
VITE_KAKAO_CALLBACK_URL=https://your-domain.com/auth/kakao/callback
VITE_NAVER_CALLBACK_URL=https://your-domain.com/auth/naver/callback

# Firebase 설정 (FCM)
VITE_APP_FCM_API_KEY=your-fcm-api-key
VITE_APP_FCM_AUTH_DOMAIN=your-fcm-auth-domain
VITE_APP_FCM_PROJECT_ID=your-fcm-project-id
VITE_APP_FCM_STORAGE_BUCKET=your-fcm-storage-bucket
VITE_APP_FCM_MESSAGING_SENDER_ID=your-fcm-messaging-sender-id
VITE_APP_FCM_APP_ID=your-fcm-app-id
VITE_APP_FCM_MEASUREMENT_ID=your-fcm-measurement-id
```

> ⚠️ **주의**: 환경 변수는 애플리케이션 시작 시 Zod 스키마로 검증됩니다. 필수 환경 변수가 누락되거나 형식이 잘못되면 애플리케이션이 시작되지 않습니다.

4. **개발 서버 실행**

```bash
pnpm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

5. **빌드**

```bash
pnpm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

### 환경 변수 안내

| 변수명 | 설명 | 필수 | 예시 |
|--------|------|------|------|
| `VITE_API_URL` | 백엔드 API 서버 URL | ✅ | `https://api.tripj.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API 키 | ✅ | `AIza...` |
| `VITE_GOOGLE_MAP_ID` | Google Map ID | ✅ | `your-map-id` |
| `VITE_GOOGLE_CALLBACK_URL` | Google 로그인 콜백 URL | ✅ | `https://.../auth/google/callback` |
| `VITE_KAKAO_CALLBACK_URL` | Kakao 로그인 콜백 URL | ✅ | `https://.../auth/kakao/callback` |
| `VITE_NAVER_CALLBACK_URL` | Naver 로그인 콜백 URL | ✅ | `https://.../auth/naver/callback` |
| `VITE_APP_FCM_*` | Firebase Cloud Messaging 설정 | ✅ | - |

> 💡 **팁**: 환경 변수는 `src/schemas/common/envSchema.ts`에서 관리됩니다. 새로운 환경 변수를 추가할 때는 해당 스키마도 함께 업데이트해야 합니다.

---

## 🌐 배포 정보

### 배포 플랫폼

- **Vercel**: 프론트엔드 애플리케이션 배포

### 배포 링크


🔗 **프로덕션**: [https://www.trip-j.store](https://www.trip-j.store)


---

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

---


