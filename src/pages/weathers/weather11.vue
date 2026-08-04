<script setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import Spline from '@/components/ui/spline/Spline.vue'

defineOptions({ name: 'Weather11Page' })

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
      splineCanvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: lastClientX,
        clientY: lastClientY,
        bubbles: true,
      }))
      splineCanvas.dispatchEvent(new PointerEvent('pointermove', {
        clientX: lastClientX,
        clientY: lastClientY,
        bubbles: true,
        pointerId: 1,
        pointerType: 'mouse',
      }))
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
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', description: '화창한 하루', high: 31, low: 19 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', description: '우산을 챙기세요', high: 26, low: 18 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', description: '선선한 바람', high: 28, low: 21 },
  { id: 'city_04', name: '제주', temp: 30, status: '맑음', description: '완벽한 해변 날씨', high: 32, low: 24 },
  { id: 'city_05', name: '강릉', temp: 22, status: '비', description: '동해안 장마', high: 24, low: 17 },
  { id: 'city_06', name: '대전', temp: 27, status: '구름', description: '흐린 오후', high: 29, low: 20 },
  { id: 'city_07', name: '광주', temp: 29, status: '맑음', description: '무더위 주의', high: 33, low: 22 },
  { id: 'city_08', name: '인천', temp: 25, status: '구름', description: '해무 가능성', high: 27, low: 19 },
])

const favorites = ref(loadFavorites())
const unit = ref('celsius')
const sortBy = ref('name')
const loading = ref(false)

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem('weatherFavorites') || '[]') }
  catch { return [] }
}

function simulateLoad() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 800)
}

function toggleFavorite(cityId) {
  const idx = favorites.value.indexOf(cityId)
  if (idx > -1) favorites.value.splice(idx, 1)
  else favorites.value.push(cityId)
}

function isFavorite(cityId) { return favorites.value.includes(cityId) }

function convertTemp(celsius) {
  return unit.value === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}
function tempUnit() { return unit.value === 'celsius' ? '°C' : '°F' }

function selectCity(city) {
  selectedCity.value = city.id === selectedCity.value?.id ? null : city
}

function weatherIcon(status) {
  switch (status) {
    case '맑음': return 'solar:sun-bold-duotone'
    case '비': return 'solar:cloud-rain-bold-duotone'
    case '구름': return 'solar:cloud-bold-duotone'
    default: return 'solar:cloud-bold-duotone'
  }
}

function weatherIconColor(status) {
  switch (status) {
    case '맑음': return 'text-amber-400'
    case '비': return 'text-blue-400'
    case '구름': return 'text-zinc-400'
    default: return 'text-zinc-400'
  }
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

const favoriteCount = computed(() => favorites.value.length)
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

watch(sortBy, (newVal) => { console.log(`[watch] 정렬 기준 변경: ${newVal}`) })

watch(favorites, (newVal) => {
  localStorage.setItem('weatherFavorites', JSON.stringify(newVal))
  console.log(`[watch] 즐겨찾기 저장됨: ${newVal.length}개`)
}, { deep: true })

watchEffect(() => {
  console.log(`[watchEffect] 검색어: "${searchQuery.value}" → ${filteredCount.value}개, 정렬: ${sortBy.value}`)
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
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -20px) scale(1.1); }
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

/* ─── Layout transition container ─── */
.layout-root {
  position: relative;
  z-index: 20;
  min-height: 100dvh;
}

/* ─── City list wrapper: fixed to viewport ─── */
.city-list-wrapper {
  position: fixed;
  pointer-events: auto;
  transition: left 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              max-width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              top 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Default: centered below top section */
.city-list-wrapper:not(.is-sidebar) {
  left: 50%;
  top: 28rem;
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
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
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
  font-size: 0.875rem;   /* text-sm */
  line-height: 1.25rem;
  transition: font-size 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              line-height 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.city-row.is-compact .city-name-text {
  font-size: 0.75rem;    /* text-xs */
  line-height: 1rem;
}

.city-temp-text {
  font-size: 1.25rem;    /* text-xl */
  line-height: 1.75rem;
  transition: font-size 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              line-height 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.city-row.is-compact .city-temp-text {
  font-size: 0.75rem;    /* text-xs */
  line-height: 1rem;
}

.city-icon {
  width: 1.25rem;         /* size-5 */
  height: 1.25rem;
  transition: width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.city-row.is-compact .city-icon {
  width: 1rem;            /* size-4 */
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
.detail-card-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.detail-card-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
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
  background: linear-gradient(90deg, transparent 25%, rgba(255, 255, 255, 0.08) 50%, transparent 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 50ms; }
.stagger-3 { animation-delay: 100ms; }
.stagger-4 { animation-delay: 150ms; }
.stagger-5 { animation-delay: 200ms; }
.stagger-6 { animation-delay: 250ms; }
.stagger-7 { animation-delay: 300ms; }
.stagger-8 { animation-delay: 350ms; }
</style>

<template>
  <div class="min-h-[100dvh] bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
    <!-- Ambience background -->
    <div class="page-ambience">
      <div class="ambience-orb -left-32 top-20 h-96 w-96 bg-gradient-to-br from-amber-400 to-orange-500" />
      <div class="ambience-orb -right-32 top-1/2 h-80 w-80 bg-gradient-to-br from-blue-400 to-cyan-500" />
      <div class="ambience-orb left-1/3 -bottom-20 h-72 w-72 bg-gradient-to-br from-violet-400 to-purple-500" />
    </div>
    <div ref="splineWrapper" class="fixed inset-0 z-10">
      <Spline :scene="sceneUrl" :render-on-demand="true" class="size-full" />
    </div>

    <!-- Single layout that morphs -->
    <div class="layout-root" :class="{ 'pointer-events-none': false }">
      <!-- ─── DETAIL CARD (fixed center, only when city selected) ─── -->
      <Transition name="detail-card">
        <div v-if="selectedCity" class="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center px-4" @click.self="selectedCity = null">
          <div class="glass-card w-full max-w-md rounded-3xl p-10">
            <div class="mb-8 flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                :class="selectedCity.status === '맑음' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : selectedCity.status === '비' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'">
                {{ selectedCity.status }}
              </span>
              <button @click="toggleFavorite(selectedCity.id)"
                class="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
                :class="isFavorite(selectedCity.id) ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-600'">
                <Icon :icon="isFavorite(selectedCity.id) ? 'solar:star-bold' : 'solar:star-linear'" class="size-5" />
              </button>
            </div>

            <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ selectedCity.name }}</h2>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ selectedCity.description }}</p>

            <div class="mt-8 flex items-baseline gap-2 tabular-nums">
              <span class="text-8xl font-black tracking-tighter text-zinc-900 dark:text-white">{{ convertTemp(selectedCity.temp) }}</span>
              <span class="text-3xl font-light text-zinc-400">{{ tempUnit() }}</span>
            </div>

            <div class="mt-6 flex justify-center">
              <Icon :icon="weatherIcon(selectedCity.status)" class="size-20 opacity-15" :class="weatherIconColor(selectedCity.status)" />
            </div>

            <div class="mt-8 grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                <p class="text-xs font-medium text-zinc-400 uppercase mb-1">최고</p>
                <p class="text-lg font-bold text-amber-500 tabular-nums">{{ convertTemp(selectedCity.high) }}°</p>
              </div>
              <div class="rounded-xl bg-zinc-100/50 p-4 text-center dark:bg-zinc-800/30">
                <p class="text-xs font-medium text-zinc-400 uppercase mb-1">최저</p>
                <p class="text-lg font-bold text-blue-500 tabular-nums">{{ convertTemp(selectedCity.low) }}°</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ─── TOP SECTION: header + stats + controls (fade out independently) ─── -->
      <Transition name="fade">
        <div v-if="!selectedCity" class="pointer-events-auto fixed left-1/2 top-20 z-20 w-[calc(100%-2.5rem)] max-w-3xl -translate-x-1/2 px-5">
          <header class="mb-10 text-center">
            <p class="mb-2 font-mono text-xs font-medium tracking-widest text-zinc-400 uppercase dark:text-zinc-500">Weather Dashboard</p>
            <h1 class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">날씨 대시보드</h1>
            <p class="mt-3 max-w-md mx-auto text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              전국 주요 도시의 실시간 기온과 날씨 상태를 확인하세요.
            </p>
          </header>

          <div class="mb-8 grid grid-cols-3 gap-3">
            <div class="stat-card glass-card rounded-2xl p-5">
              <p class="mb-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">평균 기온</p>
              <p class="tabular-nums text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {{ stats.avg }}<span class="ml-0.5 text-lg text-zinc-400">{{ tempUnit() }}</span>
              </p>
            </div>
            <div class="stat-card glass-card rounded-2xl p-5">
              <p class="mb-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">최고</p>
              <p class="tabular-nums text-3xl font-bold tracking-tight text-orange-500">
                {{ stats.highest?.temp || '-' }}<span class="ml-0.5 text-lg text-orange-400/60">{{ tempUnit() }}</span>
              </p>
              <p class="mt-1 text-xs text-zinc-400">{{ stats.highest?.name || '-' }}</p>
            </div>
            <div class="stat-card glass-card rounded-2xl p-5">
              <p class="mb-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">최저</p>
              <p class="tabular-nums text-3xl font-bold tracking-tight text-blue-500">
                {{ stats.lowest?.temp || '-' }}<span class="ml-0.5 text-lg text-blue-400/60">{{ tempUnit() }}</span>
              </p>
              <p class="mt-1 text-xs text-zinc-400">{{ stats.lowest?.name || '-' }}</p>
            </div>
          </div>

          <div class="mb-6 flex flex-wrap items-center gap-3">
            <div class="relative flex-1">
              <Icon icon="solar:magnifer-linear" class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input v-model="searchQuery" type="text" placeholder="도시 이름 검색..."
                class="glass-card w-full rounded-xl py-2.5 pr-4 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 dark:text-white" />
            </div>
            <select v-model="unit" class="glass-card cursor-pointer rounded-xl px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300">
              <option value="celsius">°C</option>
              <option value="fahrenheit">°F</option>
            </select>
            <select v-model="sortBy" class="glass-card cursor-pointer rounded-xl px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300">
              <option value="name">이름순</option>
              <option value="temp">기온순</option>
            </select>
            <button @click="simulateLoad"
              class="glass-card flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98] dark:text-zinc-300">
              <Icon icon="solar:refresh-circle-bold-duotone" class="size-4" :class="{ 'animate-spin': loading }" />
              새로고침
            </button>
          </div>

          <div class="mb-5 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span class="flex items-center gap-1"><Icon icon="solar:star-bold-duotone" class="size-3 text-amber-400" />즐겨찾기 {{ favoriteCount }}개</span>
            <span>·</span><span>검색 결과 {{ filteredCount }}개</span>
            <span v-show="loading" class="ml-auto flex items-center gap-1 text-blue-500"><span class="inline-block size-1.5 rounded-full bg-blue-500 animate-pulse" />로딩 중</span>
          </div>
        </div>
      </Transition>

      <!-- ─── CITY LIST (only rows morph from centered → left sidebar) ─── -->
      <div class="city-list-wrapper" :class="{ 'is-sidebar': selectedCity }">
        <!-- Sidebar back + search -->
        <Transition name="fade">
          <div v-if="selectedCity" class="mb-4 space-y-3">
            <button @click="selectedCity = null"
              class="glass-card flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              <Icon icon="solar:arrow-left-linear" class="size-4" />
              전체 도시
            </button>
            <div class="relative">
              <Icon icon="solar:magnifer-linear" class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400" />
              <input v-model="searchQuery" type="text" placeholder="검색..."
                class="glass-card w-full rounded-lg py-1.5 pr-2 pl-7 text-xs text-zinc-900 placeholder:text-zinc-400 dark:text-white" />
            </div>
          </div>
        </Transition>

        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-2">
          <div v-for="i in 4" :key="i" class="glass-card flex items-center gap-4 rounded-2xl px-5 py-4">
            <div class="skeleton h-5 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div class="skeleton h-4 w-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div class="ml-auto skeleton h-6 w-14 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredCount === 0 && !selectedCity" class="glass-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <Icon icon="solar:map-point-search-bold-duotone" class="mb-4 size-12 text-zinc-300 dark:text-zinc-600" />
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">일치하는 도시가 없습니다</p>
          <p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500">다른 검색어를 시도해보세요</p>
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
            <Icon :icon="weatherIcon(city.status)" class="city-icon shrink-0" :class="weatherIconColor(city.status)" />

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="city-name-text font-semibold text-zinc-900 dark:text-white">{{ city.name }}</span>
                <div class="collapse-col" :class="{ 'is-collapsed': selectedCity }">
                  <span class="whitespace-nowrap text-xs text-zinc-400">{{ city.description }}</span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 items-baseline gap-0.5 tabular-nums">
              <span class="city-temp-text font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">{{ convertTemp(city.temp) }}</span>
              <div class="collapse-col" :class="{ 'is-collapsed': selectedCity }">
                <span class="whitespace-nowrap text-xs font-medium text-zinc-400">{{ tempUnit() }}</span>
              </div>
            </div>

            <div class="collapse-col shrink-0" :class="{ 'is-collapsed': selectedCity }">
              <div class="flex items-center gap-2 pl-2">
                <span class="whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="city.status === '맑음' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : city.status === '비' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'">
                  {{ city.status }}
                </span>
                <button @click.stop="toggleFavorite(city.id)"
                  class="shrink-0 rounded-lg p-1.5 transition-all hover:scale-110 active:scale-95"
                  :class="isFavorite(city.id) ? 'text-amber-400' : 'text-zinc-300 hover:text-zinc-400 dark:text-zinc-600 dark:hover:text-zinc-500'"
                  :aria-label="isFavorite(city.id) ? `${city.name} 즐겨찾기 해제` : `${city.name} 즐겨찾기 추가`">
                  <Icon :icon="isFavorite(city.id) ? 'solar:star-bold' : 'solar:star-linear'" class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
