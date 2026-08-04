<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import ParticlesBg from '@/components/ui/particles-bg/ParticlesBg.vue'
import MorphingText from '@/components/ui/morphing-text/MorphingText.vue'
import NumberTicker from '@/components/ui/number-ticker/NumberTicker.vue'
import GlareCard from '@/components/ui/glare-card/GlareCard.vue'
import SparklesText from '@/components/ui/sparkles-text/SparklesText.vue'
import BentoGrid from '@/components/ui/bento-grid/BentoGrid.vue'
import BentoGridItem from '@/components/ui/bento-grid/BentoGridItem.vue'

defineOptions({ name: 'Weather8Page' })

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    description: '화창한 하루',
    high: 31,
    low: 19,
    humidity: 45,
    wind: 3.2,
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    description: '우산을 챙기세요',
    high: 26,
    low: 18,
    humidity: 78,
    wind: 5.1,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    description: '선선한 바람',
    high: 28,
    low: 21,
    humidity: 62,
    wind: 4.8,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 30,
    status: '맑음',
    description: '완벽한 해변 날씨',
    high: 32,
    low: 24,
    humidity: 55,
    wind: 6.3,
  },
  {
    id: 'city_05',
    name: '강릉',
    temp: 22,
    status: '비',
    description: '동해안 장마',
    high: 24,
    low: 17,
    humidity: 82,
    wind: 7.2,
  },
  {
    id: 'city_06',
    name: '대전',
    temp: 27,
    status: '구름',
    description: '흐린 오후',
    high: 29,
    low: 20,
    humidity: 58,
    wind: 2.9,
  },
  {
    id: 'city_07',
    name: '광주',
    temp: 29,
    status: '맑음',
    description: '무더위 주의',
    high: 33,
    low: 22,
    humidity: 48,
    wind: 2.1,
  },
  {
    id: 'city_08',
    name: '인천',
    temp: 25,
    status: '구름',
    description: '해무 가능성',
    high: 27,
    low: 19,
    humidity: 71,
    wind: 5.5,
  },
])

const favorites = ref(loadFavorites())
const unit = ref('celsius')
const sortBy = ref('name')
const loading = ref(false)

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem('weatherFavorites') || '[]')
  } catch {
    return []
  }
}

function simulateLoad() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
}

function toggleFavorite(cityId) {
  const idx = favorites.value.indexOf(cityId)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
  } else {
    favorites.value.push(cityId)
  }
}

function isFavorite(cityId) {
  return favorites.value.includes(cityId)
}

function convertTemp(celsius) {
  if (unit.value === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32)
  return celsius
}

function tempUnit() {
  return unit.value === 'celsius' ? '°C' : '°F'
}

function selectCity(city) {
  selectedCityInfo.value = city
}

function weatherColor(status) {
  switch (status) {
    case '맑음':
      return 'text-amber-400'
    case '비':
      return 'text-blue-400'
    case '구름':
      return 'text-zinc-400'
    default:
      return 'text-zinc-400'
  }
}

function weatherIcon(status) {
  switch (status) {
    case '맑음':
      return 'solar:sun-bold-duotone'
    case '비':
      return 'solar:cloud-rain-bold-duotone'
    case '구름':
      return 'solar:cloud-bold-duotone'
    default:
      return 'solar:cloud-bold-duotone'
  }
}

function weatherBg(status) {
  switch (status) {
    case '맑음':
      return 'bg-gradient-to-br from-amber-500/10 to-orange-500/5'
    case '비':
      return 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5'
    case '구름':
      return 'bg-gradient-to-br from-zinc-500/10 to-slate-500/5'
    default:
      return 'bg-gradient-to-br from-zinc-500/10 to-slate-500/5'
  }
}

const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  if (sortBy.value === 'temp') {
    return list.sort((a, b) => b.temp - a.temp)
  }
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

watch(sortBy, (newVal) => {
  console.log(`[watch] 정렬 기준 변경: ${newVal}`)
})

watch(
  favorites,
  (newVal) => {
    localStorage.setItem('weatherFavorites', JSON.stringify(newVal))
    console.log(`[watch] 즐겨찾기 저장됨: ${newVal.length}개`)
  },
  { deep: true },
)

watchEffect(() => {
  console.log(
    `[watchEffect] 검색어: "${searchQuery.value}" → ${filteredCount.value}개, 정렬: ${sortBy.value}`,
  )
})
</script>

<style scoped>
.mystical-page {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
}

.mystical-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.04) 0%, transparent 60%);
}

.dark .mystical-bg {
  background:
    radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 60%);
}

.glass-card {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
}

.dark .glass-card {
  background: rgba(24, 24, 27, 0.65);
  border-color: rgba(255, 255, 255, 0.08);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
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
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}

.weather-card-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.weather-card-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.weather-card-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.weather-card-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>

<template>
  <div class="mystical-page bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
    <!-- Particle background -->
    <ParticlesBg
      :quantity="80"
      :color="'#8b5cf6'"
      :staticity="30"
      :ease="80"
      class="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60"
    />

    <!-- Mystical radial gradient -->
    <div class="mystical-bg" />

    <div class="relative z-10 mx-auto max-w-5xl px-5 pt-28 pb-24">
      <!-- Header -->
      <header class="mb-12 text-center">
        <p
          class="mb-3 font-mono text-xs font-medium tracking-[0.3em] text-violet-500 uppercase dark:text-violet-400"
        >
          Mystical Weather
        </p>
        <SparklesText
          text="날씨 대시보드"
          :sparkles-count="12"
          :colors="{ first: '#8b5cf6', second: '#ec4899' }"
          class="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
        />
        <p class="mt-3 mx-auto max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          전국 주요 도시의 실시간 기온과 날씨 상태를 확인하세요.
        </p>
      </header>

      <!-- Stats: Bento Grid -->
      <BentoGrid class="mb-8 md:grid-cols-3">
        <BentoGridItem
          class="col-span-1 row-span-1 bg-gradient-to-br from-violet-500/8 to-purple-500/5 dark:from-violet-500/15 dark:to-purple-500/10"
        >
          <template #header>
            <p class="text-xs font-medium text-zinc-400 dark:text-zinc-500">평균 기온</p>
          </template>
          <template #icon>
            <div class="flex items-baseline gap-1 tabular-nums">
              <NumberTicker
                :value="stats.avg"
                :duration="1.2"
                :decimal-places="0"
                class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
              />
              <span class="text-lg text-zinc-400">{{ tempUnit() }}</span>
            </div>
          </template>
        </BentoGridItem>

        <BentoGridItem
          class="col-span-1 row-span-1 bg-gradient-to-br from-amber-500/8 to-orange-500/5 dark:from-amber-500/15 dark:to-orange-500/10"
        >
          <template #header>
            <p class="text-xs font-medium text-zinc-400 dark:text-zinc-500">최고 기온</p>
          </template>
          <template #icon>
            <div class="flex items-baseline gap-1 tabular-nums">
              <NumberTicker
                :value="stats.highest?.temp || 0"
                :duration="1.2"
                :decimal-places="0"
                class="text-4xl font-bold tracking-tight text-amber-500"
              />
              <span class="text-lg text-amber-400/60">{{ tempUnit() }}</span>
            </div>
            <p class="mt-1 text-xs text-zinc-400">{{ stats.highest?.name || '-' }}</p>
          </template>
        </BentoGridItem>

        <BentoGridItem
          class="col-span-1 row-span-1 bg-gradient-to-br from-blue-500/8 to-cyan-500/5 dark:from-blue-500/15 dark:to-cyan-500/10"
        >
          <template #header>
            <p class="text-xs font-medium text-zinc-400 dark:text-zinc-500">최저 기온</p>
          </template>
          <template #icon>
            <div class="flex items-baseline gap-1 tabular-nums">
              <NumberTicker
                :value="stats.lowest?.temp || 0"
                :duration="1.2"
                :decimal-places="0"
                class="text-4xl font-bold tracking-tight text-blue-500"
              />
              <span class="text-lg text-blue-400/60">{{ tempUnit() }}</span>
            </div>
            <p class="mt-1 text-xs text-zinc-400">{{ stats.lowest?.name || '-' }}</p>
          </template>
        </BentoGridItem>
      </BentoGrid>

      <!-- Controls -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <div class="relative flex-1">
          <Icon
            icon="solar:magnifer-linear"
            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
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
          class="glass-card flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98] dark:text-zinc-300"
          @click="simulateLoad"
        >
          <Icon
            icon="solar:refresh-circle-bold-duotone"
            class="size-4"
            :class="{ 'animate-spin': loading }"
          />
          새로고침
        </button>
      </div>

      <!-- Status bar -->
      <div class="mb-5 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
        <span class="flex items-center gap-1">
          <Icon icon="solar:star-bold-duotone" class="size-3 text-amber-400" />
          즐겨찾기 {{ favoriteCount }}개
        </span>
        <span>·</span>
        <span>검색 결과 {{ filteredCount }}개</span>
        <span v-show="loading" class="ml-auto flex items-center gap-1 text-violet-500">
          <span class="inline-block size-1.5 rounded-full bg-violet-500 animate-pulse" />
          로딩 중
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div v-for="i in 6" :key="i" class="glass-card rounded-2xl p-5">
          <div class="skeleton mb-3 h-4 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div class="skeleton mb-2 h-8 w-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div class="skeleton h-3 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>

      <!-- Weather grid with GlareCard -->
      <div v-else>
        <!-- Empty state -->
        <div
          v-if="filteredCount === 0"
          class="glass-card flex flex-col items-center justify-center rounded-2xl py-16 text-center"
        >
          <Icon
            icon="solar:map-point-search-bold-duotone"
            class="mb-4 size-12 text-zinc-300 dark:text-zinc-600"
          />
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            일치하는 도시가 없습니다
          </p>
          <p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500">다른 검색어를 시도해보세요</p>
        </div>

        <!-- City grid -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GlareCard
            v-for="city in sortedWeatherList"
            :key="city.id"
            class="cursor-pointer"
            @click="selectCity(city)"
          >
            <div
              class="glass-card relative flex h-full flex-col justify-between rounded-[48px] p-6"
            >
              <!-- Favorite button -->
              <button
                class="absolute top-4 right-4 z-10 rounded-lg p-1.5 transition-all hover:scale-110 active:scale-95"
                :class="
                  isFavorite(city.id)
                    ? 'text-amber-400'
                    : 'text-zinc-300 hover:text-zinc-400 dark:text-zinc-600 dark:hover:text-zinc-500'
                "
                :aria-label="
                  isFavorite(city.id) ? `${city.name} 즐겨찾기 해제` : `${city.name} 즐겨찾기 추가`
                "
                @click.stop="toggleFavorite(city.id)"
              >
                <Icon
                  :icon="isFavorite(city.id) ? 'solar:star-bold' : 'solar:star-linear'"
                  class="size-4"
                />
              </button>

              <!-- Weather icon + status -->
              <div>
                <div
                  class="mb-4 flex size-12 items-center justify-center rounded-xl"
                  :class="weatherBg(city.status)"
                >
                  <Icon
                    :icon="weatherIcon(city.status)"
                    class="size-6"
                    :class="weatherColor(city.status)"
                  />
                </div>
                <h3 class="text-lg font-bold text-zinc-900 dark:text-white">{{ city.name }}</h3>
                <p class="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  {{ city.description }}
                </p>
              </div>

              <!-- Temperature -->
              <div class="mt-4">
                <div class="flex items-baseline gap-1 tabular-nums">
                  <span class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {{ convertTemp(city.temp) }}
                  </span>
                  <span class="text-sm font-medium text-zinc-400">{{ tempUnit() }}</span>
                </div>
                <div class="mt-2 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                  <span class="flex items-center gap-1">
                    <Icon icon="solar:arrow-up-bold" class="size-3 text-amber-400" />
                    {{ convertTemp(city.high) }}°
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon icon="solar:arrow-down-bold" class="size-3 text-blue-400" />
                    {{ convertTemp(city.low) }}°
                  </span>
                </div>
              </div>

              <!-- Status badge -->
              <div class="mt-3">
                <span
                  class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="
                    city.status === '맑음'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : city.status === '비'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  "
                >
                  {{ city.status }}
                </span>
              </div>
            </div>
          </GlareCard>
        </div>
      </div>

      <!-- MorphingText footer -->
      <div class="mt-16 text-center">
        <MorphingText
          :texts="['맑은 하루', '비 오는 날', '흐린 날씨', '선선한 바람', '화창한 오후']"
          :morph-time="2"
          :cool-down-time="0.8"
          class="text-sm text-zinc-400 dark:text-zinc-500"
        />
      </div>
    </div>
  </div>
</template>
