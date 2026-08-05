# weather13.vue 개선 제안

> 작성일: 2026-08-05
> 기준 파일: `src/pages/weathers/weather13.vue`
> 완료: #1~#4, #8, #9 (6개) + 사용자 도시 추가 (7개) + 체감온도, AQI (9개)

---

## 현재 상태 요약

| 항목 | 내용 |
|------|------|
| 기본 도시 | 13개 한국 도시 + 사용자 추가 도시 (영구 저장) |
| API | OpenWeather (geocoding, current weather, 5d/3h forecast) |
| 탭 | Now / Hourly / 5-Day / Details |
| 단위 | 섭씨(°C) / 화씨(°F) 전환 (기온 + 풍속) |
| 상태 | 로딩(skeleton), 에러, 빈 결과 대응 완료 |
| 특수 기능 | 즐겨찾기, 강수확률(POP), 업데이트 시각, 일몰진행도, 도시 추가/제거, 체감온도(Wind Chill/Heat Index), 대기질(AQI), 단위·좌표 영속화 |

---

## 제안 목록

### Tier 3 — 인프라 추가 필요

#### 1. 시간별 온도/강수 차트

- **의존성**: chart 라이브러리 설치 필요 (`chart.js` + `vue-chartjs` or `recharts`)
- **구현**:
  - Hourly 탭을 차트로 시각화 (꺾은선: 온도, 막대: 강수확률)
  - Forecast 탭도 주간 min/max 막대 차트로 대체
- **난이도**: 중

#### 2. 날씨 기반 동적 배경

- **상태**: 프로젝트에 `AuroraBackground`, `SnowfallBg`, `ParticlesBg`, `GlowBorder` 등 존재
- **구현**:
  - 맑음 → AuroraBackground (맑은 하늘)
  - 비/뇌우 → ParticlesBg (빗방울)
  - 눈 → SnowfallBg
  - 흐림/안개 → GlowBorder 또는 기본 배경
- **난이도**: 중

#### 3. 현재 위치 자동 감지

- **의존성**: `navigator.geolocation` API
- **구현**:
  - 페이지 로드 시 위치 권한 요청
  - 좌표 → reverse geocoding(`geo/1.0/reverse`) → 도시명 획득
  - 자동으로 해당 도시 선택, 로딩 중 fallback은 기존 도시 리스트
- **난이도**: 중

---

### Tier 4 — 고도화

#### 4. 다크/라이트 테마

- **상태**: 프로젝트에 테마 인프라 확인 필요 (Tailwind class-based dark mode)
- **구현**:
  - SidebarFooter 또는 헤더에 테마 토글 추가
  - shadcn-vue의 `DropdownMenu`로 시스템/라이트/다크 선택 제공
- **난이도**: 중 (인프라 선행 확인 필요)

#### 5. 날씨 알림 / 기상 특보

- **필요 API**: OpenWeather OneCall 3.0 (`/data/3.0/onecall`) — 유료 플랜 필요할 수 있음
- **무료 대안**: `data/2.5/weather`의 `alerts` 필드 (일부 지역만 제공)
- **구현**:
  - 기상 특보가 있으면 상단 배너로 표시
  - 경고 아이콘 + 내용 요약
- **난이도**: 상

#### 6. 두 도시 날씨 비교

- **구현**:
  - 사이드바에서 두 도시 선택 가능 (Ctrl+Click)
  - 메인 영역을 좌우 분할하여 동시에 날씨 표시
- **난이도**: 상

---

## 구현 우선순위 요약

| 우선순위 | 기능 | 난이도 | 가성비 |
|----------|------|--------|--------|
| 1 | 날씨 기반 동적 배경 | 중 | 중 |
| 2 | 현재 위치 감지 | 중 | 중 |
| 3 | 온도 차트 | 중 | 중 |
| 4 | 테마 토글 | 중 | 하 (인프라 미확인) |
| 5 | 날씨 알림 | 상 | 하 (API 제한) |
| 6 | 도시 비교 | 상 | 하 |
