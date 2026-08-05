# weather13.vue 개선 제안

> 작성일: 2026-08-05
> 기준 파일: `src/pages/weathers/weather13.vue`
> 완료: #1~#4, #8, #9 (6개)

---

## 현재 상태 요약

| 항목 | 내용 |
|------|------|
| 기본 도시 | 13개 한국 도시 (서울, 수원, 부산, 제주, 대전, 광주, 인천, 울산, 대구, 청주, 전주, 포항, 여수, 춘천) |
| API | OpenWeather (geocoding, current weather, 5d/3h forecast) |
| 탭 | Now / Hourly / 5-Day / Details |
| 단위 | 섭씨(°C) / 화씨(°F) 전환 (기온 + 풍속) |
| 상태 | 로딩(skeleton), 에러, 빈 결과 대응 완료 |
| 특수 기능 | 즐겨찾기(Star toggle, localStorage), 강수확률(POP), 업데이트 시각, 일몰진행도 |

---

## 제안 목록

### Tier 1 — 기존 인프라로 바로 구현 가능

#### 1. 사용자 정의 도시 추가

- **상태**: geocoding API(`geo/1.0/direct`)로 임의 도시 검색 가능
- **구현**:
  - 사이드바 검색창에 도시명 입력 → debounce 후 geocoding API 호출
  - 검색 결과를 dropdown으로 표시, 선택 시 `weatherList`에 추가
  - localStorage에 사용자 추가 도시 영속화 (`DEFAULT_CITIES`와 별도)
- **난이도**: 중

#### 2. 체감온도 Wind Chill / Heat Index 계산

- **상태**: `feels_like`만 표시 중
- **구현**:
  - 기온과 풍속/습도 기반 wind chill(겨울) / heat index(여름) 계산식 적용
  - Now 탭 > 상세 정보에 "Wind Chill" 또는 "Heat Index" 항목 추가
- **난이도**: 중

---

### Tier 2 — 추가 API 호출 필요 (같은 API key 사용 가능)

#### 3. 대기질 지수 (AQI)

- **필요 API**: `http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={key}`
- **무료 티어**: 포함
- **구현**:
  - Details 탭에 AQI 카드 추가 (1~5 등급, PM2.5, PM10, O3 등)
  - 색상 등급별 시각화 (좋음-초록, 보통-노랑, 나쁨-주황, 매우나쁨-빨강)
- **난이도**: 중

---

### Tier 3 — 인프라 추가 필요

#### 4. 시간별 온도/강수 차트

- **의존성**: chart 라이브러리 설치 필요 (`chart.js` + `vue-chartjs` or `recharts`)
- **구현**:
  - Hourly 탭을 차트로 시각화 (꺾은선: 온도, 막대: 강수확률)
  - Forecast 탭도 주간 min/max 막대 차트로 대체
- **난이도**: 중

#### 5. 날씨 기반 동적 배경

- **상태**: 프로젝트에 `AuroraBackground`, `SnowfallBg`, `ParticlesBg`, `GlowBorder` 등 존재
- **구현**:
  - 맑음 → AuroraBackground (맑은 하늘)
  - 비/뇌우 → ParticlesBg (빗방울)
  - 눈 → SnowfallBg
  - 흐림/안개 → GlowBorder 또는 기본 배경
- **난이도**: 중

#### 6. 현재 위치 자동 감지

- **의존성**: `navigator.geolocation` API
- **구현**:
  - 페이지 로드 시 위치 권한 요청
  - 좌표 → reverse geocoding(`geo/1.0/reverse`) → 도시명 획득
  - 자동으로 해당 도시 선택, 로딩 중 fallback은 기존 도시 리스트
- **난이도**: 중

---

### Tier 4 — 고도화

#### 7. 다크/라이트 테마

- **상태**: 프로젝트에 테마 인프라 확인 필요 (Tailwind class-based dark mode)
- **구현**:
  - SidebarFooter 또는 헤더에 테마 토글 추가
  - shadcn-vue의 `DropdownMenu`로 시스템/라이트/다크 선택 제공
- **난이도**: 중 (인프라 선행 확인 필요)

#### 8. 날씨 알림 / 기상 특보

- **필요 API**: OpenWeather OneCall 3.0 (`/data/3.0/onecall`) — 유료 플랜 필요할 수 있음
- **무료 대안**: `data/2.5/weather`의 `alerts` 필드 (일부 지역만 제공)
- **구현**:
  - 기상 특보가 있으면 상단 배너로 표시
  - 경고 아이콘 + 내용 요약
- **난이도**: 상

#### 9. 두 도시 날씨 비교

- **구현**:
  - 사이드바에서 두 도시 선택 가능 (Ctrl+Click)
  - 메인 영역을 좌우 분할하여 동시에 날씨 표시
- **난이도**: 상

---

## 구현 우선순위 요약

| 우선순위 | 기능 | 난이도 | 가성비 |
|----------|------|--------|--------|
| 1 | 사용자 도시 추가 | 중 | 상 |
| 2 | AQI 대기질 | 중 | 중 |
| 3 | 체감온도 상세 계산 | 중 | 중 |
| 4 | 날씨 기반 동적 배경 | 중 | 중 |
| 5 | 현재 위치 감지 | 중 | 중 |
| 6 | 온도 차트 | 중 | 중 |
| 7 | 테마 토글 | 중 | 하 (인프라 미확인) |
| 8 | 날씨 알림 | 상 | 하 (API 제한) |
| 9 | 도시 비교 | 상 | 하 |
