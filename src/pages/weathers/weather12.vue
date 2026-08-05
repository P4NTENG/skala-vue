<script setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import Spline from '@/components/ui/spline/Spline.vue'
import GlowBorder from '@/components/ui/glow-border/GlowBorder.vue'
import { useWeatherFavoritesStore } from '@/stores/weatherFavorites'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY
const favoritesStore = useWeatherFavoritesStore()

defineOptions({ name: 'Weather12Page' })

const DEFAULT_CITIES = [
  '서울',
  '수원',
  '부산',
  '제주',
  '대전',
  '광주',
  '인천',
  '울산',
  '대구',
  '청주',
  '전주',
  '포항',
  '여수',
  '춘천',
  '통영',
  '진주',
  '순천',
  '군산',
  '안동',
  '경주',
  '원주',
]

const WEATHER_CONDITION_MAP = {
  200: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  201: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  202: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  210: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  211: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  212: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  221: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  230: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  231: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  232: { status: '뇌우', icon: 'solar:cloud-storm-bold-duotone', color: 'text-amber-600' },
  300: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  301: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  302: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  310: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  311: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  312: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  313: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  314: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  321: { status: '이슬비', icon: 'solar:cloud-drizzle-bold-duotone', color: 'text-cyan-400' },
  500: { status: '비', icon: 'solar:cloud-rain-bold-duotone', color: 'text-blue-400' },
  501: { status: '비', icon: 'solar:cloud-rain-bold-duotone', color: 'text-blue-400' },
  502: { status: '폭우', icon: 'solar:cloud-rain-bold-duotone', color: 'text-blue-600' },
  503: { status: '폭우', icon: 'solar:cloud-rain-bold-duotone', color: 'text-blue-600' },
  504: { status: '폭우', icon: 'solar:cloud-rain-bold-duotone', color: 'text-blue-600' },
  511: { status: '진눈깨비', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  520: { status: '소나기', icon: 'solar:cloud-rain-bold-duotone', color: 'text-sky-400' },
  521: { status: '소나기', icon: 'solar:cloud-rain-bold-duotone', color: 'text-sky-400' },
  522: { status: '소나기', icon: 'solar:cloud-rain-bold-duotone', color: 'text-sky-400' },
  531: { status: '소나기', icon: 'solar:cloud-rain-bold-duotone', color: 'text-sky-400' },
  600: { status: '눈', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-200' },
  601: { status: '눈', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-200' },
  602: { status: '폭설', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  611: { status: '진눈깨비', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  612: { status: '진눈깨비', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  613: { status: '진눈깨비', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  615: { status: '진눈깨비', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  616: { status: '진눈깨비', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-300' },
  620: { status: '소낙눈', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-200' },
  621: { status: '소낙눈', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-200' },
  622: { status: '소낙눈', icon: 'solar:cloud-snowfall-bold-duotone', color: 'text-blue-200' },
  701: { status: '안개', icon: 'solar:fog-bold-duotone', color: 'text-zinc-300' },
  711: { status: '연무', icon: 'solar:fog-bold-duotone', color: 'text-zinc-400' },
  721: { status: '연무', icon: 'solar:fog-bold-duotone', color: 'text-zinc-400' },
  731: { status: '먼지', icon: 'solar:fog-bold-duotone', color: 'text-amber-300' },
  741: { status: '안개', icon: 'solar:fog-bold-duotone', color: 'text-zinc-300' },
  751: { status: '황사', icon: 'solar:fog-bold-duotone', color: 'text-orange-300' },
  761: { status: '먼지', icon: 'solar:fog-bold-duotone', color: 'text-amber-300' },
  762: { status: '화산재', icon: 'solar:fog-bold-duotone', color: 'text-zinc-500' },
  771: { status: '돌풍', icon: 'solar:wind-bold-duotone', color: 'text-zinc-400' },
  781: { status: '토네이도', icon: 'solar:tornado-bold-duotone', color: 'text-red-500' },
  800: { status: '맑음', icon: 'solar:sun-bold-duotone', color: 'text-amber-400' },
  801: { status: '구름', icon: 'solar:cloud-sun-bold-duotone', color: 'text-yellow-400' },
  802: { status: '구름', icon: 'solar:cloud-bold-duotone', color: 'text-zinc-400' },
  803: { status: '흐림', icon: 'solar:cloud-bold-duotone', color: 'text-zinc-500' },
  804: { status: '흐림', icon: 'solar:cloud-bold-duotone', color: 'text-zinc-500' },
}

function getConditionInfo(id) {
  return WEATHER_CONDITION_MAP[id] || WEATHER_CONDITION_MAP[800]
}

const splineWrapper = ref(null)
let splineCanvas = null
let rafId = null
let lastClientX = 0
let lastClientY = 0

function findCanvas() {
  if (!splineCanvas) {
    const el = splineWrapper.value
    if (el) splineCanvas = el.querySelector('canvas')
  }
}

function onWindowMouseMove(e) {
  findCanvas()
  if (!splineCanvas) return
  if (splineWrapper.value?.contains(e.target)) return

  lastClientX = e.clientX
  lastClientY = e.clientY

  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      rafId = null
      if (!splineCanvas) return
      splineCanvas.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: lastClientX,
          clientY: lastClientY,
          bubbles: true,
        }),
      )
      splineCanvas.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: lastClientX,
          clientY: lastClientY,
          bubbles: true,
          pointerId: 1,
          pointerType: 'mouse',
        }),
      )
    })
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onWindowMouseMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onWindowMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
})

const searchQuery = ref('')
const selectedCity = ref(null)
const weatherList = ref([])

async function fetchCoordinates(cityName) {
  const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: { q: cityName, limit: 1, appid: apiKey },
  })
  if (!data.length) throw new Error(`"${cityName}" 좌표를 찾을 수 없습니다`)
  return { lat: data[0].lat, lon: data[0].lon }
}

async function fetchCurrentWeather(lat, lon) {
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: { lat, lon, units: 'metric', lang: 'kr', appid: apiKey },
  })
  return data
}

async function fetchDailyForecast(lat, lon) {
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: { lat, lon, units: 'metric', lang: 'kr', cnt: 8, appid: apiKey },
  })
  return data
}

function mapWeatherBasic(cityName, current, lat, lon) {
  const condition = getConditionInfo(current.weather[0].id)
  return {
    id: `${current.dt}_${cityName}`,
    name: cityName,
    lat,
    lon,
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    status: condition.status,
    description: current.weather[0].description,
    weatherId: current.weather[0].id,
    icon: condition.icon,
    iconColor: condition.color,
    humidity: current.main.humidity,
    pressure: current.main.pressure,
    windSpeed: Math.round(current.wind.speed * 10) / 10,
    windDeg: current.wind.deg,
    clouds: current.clouds.all,
    visibility: current.visibility,
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    rain1h: current.rain?.['1h'] ?? null,
    snow1h: current.snow?.['1h'] ?? null,
    high: null,
    low: null,
    detailLoaded: false,
  }
}

function applyDailyData(city, forecast) {
  const today = new Date().toISOString().slice(0, 10)
  const todayItems = forecast.list.filter((item) => item.dt_txt.startsWith(today))
  if (todayItems.length) {
    const temps = todayItems.map((item) => item.main.temp)
    city.high = Math.round(Math.max(...temps))
    city.low = Math.round(Math.min(...temps))
  }
  city.detailLoaded = true
}

async function fetchCityBasic(cityName) {
  const coords = await fetchCoordinates(cityName)
  const current = await fetchCurrentWeather(coords.lat, coords.lon)
  return mapWeatherBasic(cityName, current, coords.lat, coords.lon)
}

async function fetchAllWeather() {
  loading.value = true
  error.value = null
  try {
    const results = await Promise.all(DEFAULT_CITIES.map(fetchCityBasic))
    weatherList.value = results
  } catch (err) {
    console.error('날씨 데이터 로드 실패:', err)
    error.value = err.message || '알 수 없는 오류가 발생했습니다'
  } finally {
    loading.value = false
  }
}

async function loadCityDetail(city) {
  if (city.detailLoaded) {
    selectedCity.value = city
    return
  }
  detailLoading.value = true
  selectedCity.value = city
  try {
    const forecast = await fetchDailyForecast(city.lat, city.lon)
    applyDailyData(city, forecast)
  } catch (err) {
    console.error(`${city.name} 상세 정보 로드 실패:`, err)
  } finally {
    detailLoading.value = false
  }
}

const unit = ref('celsius')
const sortBy = ref('name')
const loading = ref(false)
const detailLoading = ref(false)
const error = ref(null)

function convertTemp(celsius) {
  if (celsius == null) return '-'
  return unit.value === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)
}
function tempUnit() {
  return unit.value === 'celsius' ? '°C' : '°F'
}

function selectCity(city) {
  if (city.id === selectedCity.value?.id) {
    selectedCity.value = null
  } else {
    loadCityDetail(city)
  }
}

function weatherIcon(city) {
  return city.icon || 'solar:cloud-bold-duotone'
}

function weatherIconColor(city) {
  return city.iconColor || 'text-zinc-400'
}

function windDirectionLabel(deg) {
  const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
  return dirs[Math.round(deg / 45) % 8]
}

function formatTime(unixTs) {
  if (!unixTs) return '-'
  return new Date(unixTs * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  if (sortBy.value === 'temp') return list.sort((a, b) => b.temp - a.temp)
  return list.sort((a, b) => a.name.localeCompare(b.name))
})

const favoriteCount = computed(() => favoritesStore.favoriteCount)
const filteredCount = computed(() => filteredWeatherList.value.length)

const stats = computed(() => {
  const list = filteredWeatherList.value
  if (!list.length) return { avg: 0, highest: null, lowest: null }
  const temps = list.map((c) => c.temp)
  const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
  const highest = list.reduce((a, b) => (a.temp > b.temp ? a : b))
  const lowest = list.reduce((a, b) => (a.temp < b.temp ? a : b))
  return { avg, highest, lowest }
})

const listStatus = computed(() => {
  if (loading.value)
    return {
      icon: 'solar:refresh-circle-bold-duotone',
      title: '로딩 중…',
      description: '날씨 데이터를 불러오고 있습니다',
      animate: true,
      type: 'loading',
    }
  if (error.value)
    return {
      icon: 'solar:danger-triangle-bold-duotone',
      title: '오류 발생',
      description: error.value,
      type: 'error',
    }
  if (filteredCount.value === 0)
    return {
      icon: 'solar:map-point-search-bold-duotone',
      title: '일치하는 도시가 없습니다',
      description: '다른 검색어를 시도해보세요',
      type: 'empty',
    }
  return null
})

watch(sortBy, (newVal) => {
  console.log(`[watch] 정렬 기준 변경: ${newVal}`)
})

watchEffect(() => {
  console.log(
    `[watchEffect] 검색어: "${searchQuery.value}" → ${filteredCount.value}개, 정렬: ${sortBy.value}`,
  )
})

onMounted(() => {
  fetchAllWeather()
})
</script>

<style scoped>
.page-ambience {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambience-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.12;
  animation: orb-drift 20s ease-in-out infinite alternate;
}

@keyframes orb-drift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(30px, -20px) scale(1.1);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}

.dark .glass-card {
  background: rgba(24, 24, 27, 0.18);
  border-color: rgba(255, 255, 255, 0.06);
}

.glass-card-detail {
  background: rgba(255, 255, 255, 0.38);
}
.dark .glass-card-detail {
  background: rgba(24, 24, 27, 0.38);
}

/* ─── Layout transition container ─── */
.layout-root {
  position: relative;
  z-index: 20;
  min-height: 100dvh;
  transform: translateZ(0);
}

/* ─── City list wrapper: fixed to viewport ─── */
.city-list-wrapper {
  position: fixed;
  pointer-events: auto;
  transition:
    left 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    max-width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    top 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Default: centered below top section */
.city-list-wrapper:not(.is-sidebar) {
  left: 50%;
  top: 30rem;
  bottom: 1rem;
  transform: translateX(-50%);
  width: calc(100% - 2.5rem);
  max-width: 48rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding: 0 1.25rem 1rem;
}
.city-list-wrapper:not(.is-sidebar)::-webkit-scrollbar {
  display: none;
}

/* Sidebar: left edge */
.city-list-wrapper.is-sidebar {
  left: 1.25rem;
  top: 5rem;
  bottom: 1rem;
  transform: translateX(0);
  width: 12rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding: 0;
}
.city-list-wrapper.is-sidebar::-webkit-scrollbar {
  display: none;
}

.sidebar-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.dark .sidebar-header {
  background: rgba(24, 24, 27, 0.8);
}

/* ─── Fade-in/out (헤더, 사이드바 뒤로가기 등 - row 내부에는 더 이상 사용 안 함) ─── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── City rows list container ─── */
.city-rows-list {
  transition: gap 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ─── City row ─── */
.city-row {
  transition:
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    padding 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    gap 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  white-space: nowrap;
}
.city-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
}
.dark .city-row:hover {
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.3);
}

.city-row.is-compact {
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
  border-radius: 0.5rem;
}

/* 도시명: 폭이 줄어드는 동안 온도 쪽으로 흘러넘치지 않도록 하드 클리핑 */
.city-name-text {
  display: inline-block;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  transition:
    font-size 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    line-height 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.city-row.is-compact .city-name-text {
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
}

.city-temp-text {
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
  transition:
    font-size 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    line-height 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.city-row.is-compact .city-temp-text {
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
}

.city-icon {
  width: 1.25rem; /* size-5 */
  height: 1.25rem;
  transition:
    width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.city-row.is-compact .city-icon {
  width: 1rem; /* size-4 */
  height: 1rem;
}

/* ─── 접히는 요소(설명/단위/뱃지+버튼): DOM에서 제거하지 않고
       grid-template-columns를 1fr→0fr로 보간해 공간을 매 프레임 연속적으로 반환.
       v-if로 한 번에 제거하던 방식과 달리 "순간이동"이 발생하지 않음 ─── */
.collapse-col {
  display: grid;
  grid-template-columns: 1fr;
  min-width: 0;
  transition: grid-template-columns 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.collapse-col.is-collapsed {
  grid-template-columns: 0fr;
}
.collapse-col > * {
  overflow: hidden;
  min-width: 0;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.collapse-col.is-collapsed > * {
  opacity: 0;
}

/* ─── Detail card ─── */
/* detail 카드: opacity는 진입 시 150ms 만에 끝내고,
   나머지 350ms는 transform만 진행 → 카드가 반투명 상태로 오래 머무는 문제 해결 */
.detail-card-enter-active {
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.15s ease-out;
}

/* 이탈 시에는 opacity를 뒤로 지연시켜, 마지막 120ms 동안만 사라지게 함
   (transform은 0.3s 내내 진행, opacity는 delay 0.18s + duration 0.12s = 0.3s로 총 시간 일치) */
.detail-card-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 1, 1),
    opacity 0.12s ease-in 0.18s;
}

/* dashboard 상단 섹션(stat-card 포함): 동일한 원리 적용
   기존 opacity 0.4s → 진입은 빠르게, 이탈은 뒤로 지연시켜 총 시간(0.4s)은 유지 */
.fade-enter-active {
  transition: opacity 0.15s ease-out;
}
.fade-leave-active {
  transition: opacity 0.15s ease-in 0.25s;
}
.detail-card-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.detail-card-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.stat-card {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.stat-card:hover {
  transform: translateY(-2px);
}

.skeleton {
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.stagger-1 {
  animation-delay: 0ms;
}
.stagger-2 {
  animation-delay: 50ms;
}
.stagger-3 {
  animation-delay: 100ms;
}
.stagger-4 {
  animation-delay: 150ms;
}
.stagger-5 {
  animation-delay: 200ms;
}
.stagger-6 {
  animation-delay: 250ms;
}
.stagger-7 {
  animation-delay: 300ms;
}
.stagger-8 {
  animation-delay: 350ms;
}
</style>

<template>
  <div class="min-h-[100dvh] bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
    <!-- Ambience background -->
    <div class="page-ambience">
      <div
        class="ambience-orb -left-32 top-20 h-96 w-96 bg-gradient-to-br from-amber-400 to-orange-500"
      />
      <div
        class="ambience-orb -right-32 top-1/2 h-80 w-80 bg-gradient-to-br from-blue-400 to-cyan-500"
      />
      <div
        class="ambience-orb left-1/3 -bottom-20 h-72 w-72 bg-gradient-to-br from-violet-400 to-purple-500"
      />
    </div>
    <div ref="splineWrapper" class="fixed inset-0 z-10">
      <Spline :scene="sceneUrl" :render-on-demand="true" class="size-full" />
    </div>

    <!-- Single layout that morphs -->
    <div class="layout-root" :class="{ 'pointer-events-none': false }">
      <!-- ─── DETAIL CARD (fixed center, only when city selected) ─── -->
      <Transition name="detail-card">
        <div
          v-if="selectedCity"
          class="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-4"
        >
          <div
            class="glass-card glass-card-detail pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl p-10"
          >
            <GlowBorder :border-width="2" :border-radius="24" color="rgba(139,92,246,0.4)" />
            <div class="relative z-10">
              <div class="mb-8 flex items-center justify-between">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                  :class="
                    weatherIconColor(selectedCity).replace('text-', 'border-') +
                    '/30 ' +
                    weatherIconColor(selectedCity).replace('text-', 'bg-') +
                    '/10 ' +
                    weatherIconColor(selectedCity)
                  "
                >
                  {{ selectedCity.status }}
                </span>
                <button
                  @click="favoritesStore.toggle(selectedCity.id)"
                  class="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
                  :class="
                    favoritesStore.isFavorite(selectedCity.id)
                      ? 'text-amber-400'
                      : 'text-zinc-400 hover:text-zinc-600'
                  "
                >
                  <Icon
                    :icon="
                      favoritesStore.isFavorite(selectedCity.id)
                        ? 'solar:star-bold'
                        : 'solar:star-linear'
                    "
                    class="size-5"
                  />
                </button>
              </div>

              <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {{ selectedCity.name }}
              </h2>
              <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {{ selectedCity.description }}
              </p>

              <div class="mt-6 flex items-baseline gap-2 tabular-nums">
                <span class="text-8xl font-black tracking-tighter text-zinc-900 dark:text-white">{{
                  convertTemp(selectedCity.temp)
                }}</span>
                <span class="text-3xl font-light text-zinc-400">{{ tempUnit() }}</span>
              </div>

              <p class="mt-1 text-sm text-zinc-400">
                체감 {{ convertTemp(selectedCity.feelsLike) }}{{ tempUnit() }}
              </p>

              <div class="mt-6 flex justify-center">
                <Icon
                  :icon="weatherIcon(selectedCity)"
                  class="size-20 opacity-15"
                  :class="weatherIconColor(selectedCity)"
                />
              </div>

              <div class="mt-8 grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                  <p class="text-xs font-medium text-zinc-400 uppercase mb-1">최고</p>
                  <p
                    v-if="selectedCity.detailLoaded"
                    class="text-lg font-bold text-amber-500 tabular-nums"
                  >
                    {{ convertTemp(selectedCity.high) }}°
                  </p>
                  <div
                    v-else
                    class="mx-auto h-5 w-10 animate-pulse rounded bg-zinc-300/50 dark:bg-zinc-600/50"
                  />
                </div>
                <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                  <p class="text-xs font-medium text-zinc-400 uppercase mb-1">최저</p>
                  <p
                    v-if="selectedCity.detailLoaded"
                    class="text-lg font-bold text-blue-500 tabular-nums"
                  >
                    {{ convertTemp(selectedCity.low) }}°
                  </p>
                  <div
                    v-else
                    class="mx-auto h-5 w-10 animate-pulse rounded bg-zinc-300/50 dark:bg-zinc-600/50"
                  />
                </div>
                <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                  <p class="text-xs font-medium text-zinc-400 uppercase mb-1">습도</p>
                  <p class="text-lg font-bold tabular-nums text-cyan-500">
                    {{ selectedCity.humidity }}%
                  </p>
                </div>
                <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                  <p class="text-xs font-medium text-zinc-400 uppercase mb-1">기압</p>
                  <p class="text-lg font-bold tabular-nums text-violet-400">
                    {{ selectedCity.pressure }} hPa
                  </p>
                </div>
                <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                  <p class="text-xs font-medium text-zinc-400 uppercase mb-1">바람</p>
                  <p class="text-xs font-bold tabular-nums text-zinc-600 dark:text-zinc-300">
                    {{ windDirectionLabel(selectedCity.windDeg) }} {{ selectedCity.windSpeed }}m/s
                  </p>
                </div>
                <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                  <p class="text-xs font-medium text-zinc-400 uppercase mb-1">구름</p>
                  <p class="text-lg font-bold tabular-nums text-zinc-500">
                    {{ selectedCity.clouds }}%
                  </p>
                </div>
                <div
                  v-if="selectedCity.rain1h != null"
                  class="rounded-xl bg-blue-50/50 p-4 text-center dark:bg-blue-900/20 col-span-2"
                >
                  <p class="text-xs font-medium text-blue-400 uppercase mb-1">시간당 강수량</p>
                  <p class="text-lg font-bold tabular-nums text-blue-500">
                    {{ selectedCity.rain1h }} mm
                  </p>
                </div>
                <div
                  v-if="selectedCity.snow1h != null"
                  class="rounded-xl bg-blue-50/50 p-4 text-center dark:bg-blue-900/20 col-span-2"
                >
                  <p class="text-xs font-medium text-blue-400 uppercase mb-1">시간당 적설량</p>
                  <p class="text-lg font-bold tabular-nums text-blue-500">
                    {{ selectedCity.snow1h }} mm
                  </p>
                </div>
              </div>

              <div class="mt-4 flex justify-between text-xs text-zinc-400">
                <span>일출 {{ formatTime(selectedCity.sunrise) }}</span>
                <span>일몰 {{ formatTime(selectedCity.sunset) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ─── TOP SECTION: header + stats + controls (fade out independently) ─── -->
      <Transition name="fade">
        <div
          v-if="!selectedCity"
          class="pointer-events-auto fixed left-1/2 top-20 z-20 w-[calc(100%-2.5rem)] max-w-3xl -translate-x-1/2 px-5"
        >
          <header class="mb-10 text-center">
            <p
              class="mb-2 font-mono text-xs font-medium tracking-widest text-zinc-400 uppercase dark:text-zinc-500"
            >
              Weather Dashboard
            </p>
            <h1 class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              날씨 대시보드
            </h1>
            <p
              class="mt-3 max-w-md mx-auto text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
            >
              전국 주요 도시의 실시간 기온과 날씨 상태를 확인하세요.
            </p>
          </header>

          <div class="mb-8 grid grid-cols-3 gap-3">
            <div class="stat-card glass-card rounded-2xl p-5">
              <p class="mb-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">평균 기온</p>
              <p
                class="tabular-nums text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
              >
                {{ convertTemp(stats.avg)
                }}<span class="ml-0.5 text-lg text-zinc-400">{{ tempUnit() }}</span>
              </p>
            </div>
            <div class="stat-card glass-card rounded-2xl p-5">
              <p class="mb-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">최고</p>
              <p class="tabular-nums text-3xl font-bold tracking-tight text-orange-500">
                {{ convertTemp(stats.highest?.temp) || '-'
                }}<span class="ml-0.5 text-lg text-orange-400/60">{{ tempUnit() }}</span>
              </p>
              <p class="mt-1 text-xs text-zinc-400">{{ stats.highest?.name || '-' }}</p>
            </div>
            <div class="stat-card glass-card rounded-2xl p-5">
              <p class="mb-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">최저</p>
              <p class="tabular-nums text-3xl font-bold tracking-tight text-blue-500">
                {{ convertTemp(stats.lowest?.temp) || '-'
                }}<span class="ml-0.5 text-lg text-blue-400/60">{{ tempUnit() }}</span>
              </p>
              <p class="mt-1 text-xs text-zinc-400">{{ stats.lowest?.name || '-' }}</p>
            </div>
          </div>

          <div class="mb-6 flex flex-wrap items-center gap-3">
            <div class="relative flex-1">
              <Icon
                icon="solar:magnifer-linear"
                class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="도시 이름 검색..."
                class="glass-card w-full rounded-xl py-2.5 pr-4 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 dark:text-white"
              />
            </div>
            <select
              v-model="unit"
              class="glass-card cursor-pointer rounded-xl px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <option value="celsius">°C</option>
              <option value="fahrenheit">°F</option>
            </select>
            <select
              v-model="sortBy"
              class="glass-card cursor-pointer rounded-xl px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <option value="name">이름순</option>
              <option value="temp">기온순</option>
            </select>
            <button
              @click="fetchAllWeather"
              class="glass-card flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98] dark:text-zinc-300"
            >
              <Icon
                icon="solar:refresh-circle-bold-duotone"
                class="size-4"
                :class="{ 'animate-spin': loading }"
              />
              새로고침
            </button>
          </div>

          <div class="mb-5 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span class="flex items-center gap-1"
              ><Icon icon="solar:star-bold-duotone" class="size-3 text-amber-400" />즐겨찾기
              {{ favoriteCount }}개</span
            >
            <span>·</span><span>검색 결과 {{ filteredCount }}개</span>
            <span v-show="loading" class="ml-auto flex items-center gap-1 text-blue-500"
              ><span class="inline-block size-1.5 rounded-full bg-blue-500 animate-pulse" />로딩
              중</span
            >
          </div>
        </div>
      </Transition>

      <!-- ─── CITY LIST (only rows morph from centered → left sidebar) ─── -->
      <div class="city-list-wrapper" :class="{ 'is-sidebar': selectedCity }">
        <!-- Sidebar back + search (sticky) -->
        <Transition name="fade">
          <div
            v-if="selectedCity"
            class="sidebar-header sticky top-0 z-10 pb-3 mb-2 border-b border-zinc-200/60 dark:border-zinc-700/40"
          >
            <button
              @click="selectedCity = null"
              class="glass-card flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <Icon icon="solar:arrow-left-linear" class="size-4" />
              전체 도시
            </button>
            <div class="relative mt-2">
              <Icon
                icon="solar:magnifer-linear"
                class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="검색..."
                class="glass-card w-full rounded-lg py-1.5 pr-2 pl-7 text-xs text-zinc-900 placeholder:text-zinc-400 dark:text-white"
              />
            </div>
          </div>
        </Transition>

        <!-- Unified status: loading / error / empty -->
        <div
          v-if="listStatus"
          class="glass-card flex flex-col items-center justify-center rounded-2xl py-16 text-center"
        >
          <Icon
            :icon="listStatus.icon"
            class="mb-4 size-12"
            :class="{
              'animate-spin text-blue-400': listStatus.type === 'loading',
              'text-red-400': listStatus.type === 'error',
              'text-zinc-300 dark:text-zinc-600': listStatus.type === 'empty',
            }"
          />
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {{ listStatus.title }}
          </p>
          <p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {{ listStatus.description }}
          </p>
        </div>

        <!-- City rows -->
        <div v-else class="city-rows-list flex flex-col" :class="selectedCity ? 'gap-1' : 'gap-2'">
          <div
            v-for="(city, index) in sortedWeatherList"
            :key="city.id"
            class="city-row glass-card flex items-center gap-4 rounded-2xl px-5 py-4"
            :class="[
              selectedCity ? 'is-compact' : `stagger-${index + 1}`,
              selectedCity?.id === city.id ? 'ring-1 ring-violet-400/30 bg-violet-500/5' : '',
            ]"
            @click="selectCity(city)"
          >
            <Icon
              :icon="weatherIcon(city)"
              class="city-icon shrink-0"
              :class="weatherIconColor(city)"
            />

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="city-name-text font-semibold text-zinc-900 dark:text-white">{{
                  city.name
                }}</span>
                <div class="collapse-col" :class="{ 'is-collapsed': selectedCity }">
                  <span class="whitespace-nowrap text-xs text-zinc-400">{{
                    city.description
                  }}</span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 items-baseline gap-0.5 tabular-nums">
              <span
                class="city-temp-text font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums"
                >{{ convertTemp(city.temp) }}</span
              >
              <div class="collapse-col" :class="{ 'is-collapsed': selectedCity }">
                <span class="whitespace-nowrap text-xs font-medium text-zinc-400">{{
                  tempUnit()
                }}</span>
              </div>
            </div>

            <div class="collapse-col shrink-0" :class="{ 'is-collapsed': selectedCity }">
              <div class="flex items-center gap-2 pl-2">
                <span
                  class="whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="
                    weatherIconColor(city).replace('text-', 'bg-') +
                    '/10 ' +
                    weatherIconColor(city).replace('text-', '') +
                    ' ' +
                    weatherIconColor(city)
                  "
                >
                  {{ city.status }}
                </span>
                <button
                  @click.stop="favoritesStore.toggle(city.id)"
                  class="shrink-0 rounded-lg p-1.5 transition-all hover:scale-110 active:scale-95"
                  :class="
                    favoritesStore.isFavorite(city.id)
                      ? 'text-amber-400'
                      : 'text-zinc-300 hover:text-zinc-400 dark:text-zinc-600 dark:hover:text-zinc-500'
                  "
                  :aria-label="
                    favoritesStore.isFavorite(city.id)
                      ? `${city.name} 즐겨찾기 해제`
                      : `${city.name} 즐겨찾기 추가`
                  "
                >
                  <Icon
                    :icon="
                      favoritesStore.isFavorite(city.id) ? 'solar:star-bold' : 'solar:star-linear'
                    "
                    class="size-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
