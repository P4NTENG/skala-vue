# skala-vue

Vue 3 학습 목적으로 만든 실습 + UI 컴포넌트 프로젝트입니다. Vite로 빌드하며, Tailwind CSS v4와 shadcn-vue 스타일 컴포넌트, 다양한 인터랙티브 배경 효과를 사용합니다.

배포: <https://p4nteng.github.io/skala-vue/>

## 페이지 구성

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 홈 (SKALA Front-end) |
| `/practices` | Vue 3 핵심 개념별 실습 페이지 모음 — Basic, Form Data Binding, View Directive, Event Handling, Vue Style |
| `/weathers` | 날씨 시각화 실습 페이지 모음 — `weather0`~`weather13` |
| `/about` | 브랜드 랜딩 데모 (Véloce) |

## Weather13 — 날씨 대시보드

`src/pages/weathers/weather13.vue` — OpenWeatherMap API 기반의 실시간 날씨 대시보드로, 이 프로젝트에서 가장 완성도가 높은 페이지입니다.

### 주요 기능

**사이드바**
- 기본 14개 한국 도시 목록 + 실시간 온도 표시 (`DEFAULT_CITIES` / `CITY_COORDS` 좌표 캐시로 지오코딩 API 호출 절감)
- 도시 검색: 디바운스된 지오코딩 검색 드롭다운 → 클릭으로 **사용자 정의 도시 추가** (`weather13UserCities` localStorage 영속화), 리스트에서 `X` 버튼으로 제거
- 즐겨찾기: 별(★) 토글 → 목록 맨 위 정렬, `weatherFavorites`(Pinia + localStorage) 영속화
- 단위 선택: °C / °F 전환 (`weather13Unit` localStorage 영속화)
- Weather 로고 클릭 → 선택 해제 후 즐겨찾기(Favorites) 뷰로 복귀
- 접이식 사이드바 (256px ↔ 48px 아이콘 모드, 모바일에서는 자동으로 아이콘 모드)

**메인 영역 — 4개 탭**

| 탭 | 내용 |
|---|---|
| **Now** | 대형 온도 표시(96px), 체감온도, 상태(한글 설명), 습도/바람/구름/기압/강수확률 5종 스탯 |
| **Hourly** | 3시간 단위 8개 슬롯 + **온도 추세 영역/라인 차트** + **강수확률 스택 바 차트** (`@unovis/vue`) |
| **5-Day** | 5일 예보, 정규화된 온도 범위 바(`globalMin/globalMax`)로 일별 비교 |
| **Details** | 일출/일몰, 최고/최저, **체감온도(Wind Chill)**, **열지수(Heat Index)**, **낮 진행도 바**, **대기질(AQI + PM2.5/PM10)** |

**공통**
- 단위 변환: 온도 °C↔°F, 풍속 m/s↔mph — 모든 탭에 일관 적용
- 날씨 코드 → 아이콘/색상/배지 매핑 (`WEATHER_CONDITION_MAP`, 200~804)
- 다크모드 반응형: `MutationObserver`로 `.dark` 클래스 감지, 아이콘 색상을 밝은 톤으로 전환 (`DARK_COLORS`)
- 마지막 갱신 시각(Updated) 표시, 새로고침 버튼, 로딩 스켈레톤

### 데이터 소스 (OpenWeatherMap)

| 용도 | 엔드포인트 |
|---|---|
| 도시 좌표 | `geo/1.0/direct` (검색 시에만 호출, 기본 도시는 `CITY_COORDS` 캐시) |
| 현재 날씨 | `data/2.5/weather` |
| 5일 예보 | `data/2.5/forecast` (`cnt: 40`) |
| 대기질 | `data/2.5/air_pollution` |

`lang=kr` 파라미터로 한글 날씨 설명을 받아옵니다.

### 사용한 주요 라이브러리

- **Vue 3** + `vue-router` (파일 기반 자동 라우팅) + **Pinia**
- **Tailwind CSS v4** + **shadcn-vue** (Sidebar, Tabs, Card, Select, Badge, Input, Skeleton 등) + **Reka UI**
- **@unovis/vue** — 시간별 온도/강수 차트 (VisXYContainer, VisArea, VisLine, VisStackedBar, VisCrosshair)
- **@lucide/vue** 아이콘, **axios** HTTP 클라이언트
- 배경 효과: `AuroraBackground`, `SnowfallBg`, `ParticlesBg` (커스텀 UI 컴포넌트)

### 환경 변수

날씨 페이지는 OpenWeatherMap API 키가 필요합니다. `.env` 파일에 설정하세요.

```sh
VITE_OPEN_WEATHER_API_KEY=your_api_key_here
```

---

## 프로젝트 구조

```
src/
├── assets/            # 전역 스타일 (Tailwind v4, 테마 변수)
├── components/
│   ├── layout/        # AppTopBar (다이나믹 아일랜드 네비게이션)
│   └── ui/            # shadcn-vue 기반 UI 컴포넌트 + 배경 효과 컴포넌트
├── lib/               # 유틸리티 (cn 등)
├── pages/
│   ├── index.vue      # 홈
│   ├── about.vue      # 브랜드 랜딩
│   ├── practices/     # Vue 실습 페이지
│   └── weathers/      # 날씨 페이지 (weather0 ~ weather13)
├── router/            # vue-router 자동 라우팅
└── stores/            # Pinia 스토어 (weatherFavorites)
```

## 환경 설정

[Bun](https://bun.sh) 권장 (npm도 사용 가능).

```sh
bun install
```

### 개발 서버 (HMR)

```sh
bun run dev
```

### 프로덕션 빌드

```sh
bun run build
```

### 미리보기

```sh
bun run preview
```

### 린트

```sh
bun run lint
```

## 배포

GitHub Actions(`.github/workflows/deploy.yml`)가 `main` 브랜치 push 시 빌드 후 GitHub Pages로 배포합니다. `base` 경로는 `/skala-vue/`입니다.

> 참고: GitHub Pages는 정적 호스팅이라 딥링크 직접 접속(예: `/skala-vue/weathers/weather13` 새로고침) 시 404가 발생합니다. 앱 내부 링크 이동은 정상 동작하며, `404.html` 폴백 스니펫을 추가하면 딥링크도 지원할 수 있습니다.
