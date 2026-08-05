<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import AuroraBackground from '@/components/ui/aurora-background/AuroraBackground.vue'
import ParticlesBg from '@/components/ui/particles-bg/ParticlesBg.vue'
import SparklesText from '@/components/ui/sparkles-text/SparklesText.vue'
import NumberTicker from '@/components/ui/number-ticker/NumberTicker.vue'
import GlareCard from '@/components/ui/glare-card/GlareCard.vue'
import BorderBeam from '@/components/ui/border-beam/BorderBeam.vue'
import MorphingText from '@/components/ui/morphing-text/MorphingText.vue'
import BentoGrid from '@/components/ui/bento-grid/BentoGrid.vue'
import BentoGridItem from '@/components/ui/bento-grid/BentoGridItem.vue'

defineOptions({ name: 'Weather9Page' })

const searchQuery = ref('')
const selectedCityId = ref('city_01')
const unit = ref('celsius')
const sortBy = ref('name')
const loading = ref(false)

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
  if (idx > -1) favorites.value.splice(idx, 1)
  else favorites.value.push(cityId)
}

function isFavorite(cityId) {
  return favorites.value.includes(cityId)
}

function convertTemp(celsius) {
  return unit.value === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}
function tempUnit() {
  return unit.value === 'celsius' ? '°C' : '°F'
}

function selectCity(cityId) {
  selectedCityId.value = cityId
}

const selectedCity = computed(
  () => weatherList.value.find((c) => c.id === selectedCityId.value) || weatherList.value[0],
)

const stats = computed(() => {
  const list = filteredWeatherList.value
  if (!list.length) return { avg: 0, highest: null, lowest: null }
  const temps = list.map((c) => c.temp)
  const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
  const highest = list.reduce((a, b) => (a.temp > b.temp ? a : b))
  const lowest = list.reduce((a, b) => (a.temp < b.temp ? a : b))
  return { avg, highest, lowest }
})

const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  if (sortBy.value === 'temp') return list.sort((a, b) => b.temp - a.temp)
  return list.sort((a, b) => a.name.localeCompare(b.name))
})

const otherCities = computed(() =>
  sortedWeatherList.value.filter((c) => c.id !== selectedCityId.value),
)

function weatherColor(status) {
  switch (status) {
    case '맑음':
      return 'text-amber-400'
    case '비':
      return 'text-blue-400'
    case '구름':
      return 'text-zinc-300'
    default:
      return 'text-zinc-300'
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

function weatherBgColor(status) {
  switch (status) {
    case '맑음':
      return 'from-amber-500/20 to-orange-500/10'
    case '비':
      return 'from-blue-500/20 to-cyan-500/10'
    case '구름':
      return 'from-zinc-500/20 to-slate-500/10'
    default:
      return 'from-zinc-500/20 to-slate-500/10'
  }
}

function weatherBeamColors(status) {
  switch (status) {
    case '맑음':
      return { from: '#f59e0b', to: '#fbbf24' }
    case '비':
      return { from: '#3b82f6', to: '#06b6d4' }
    case '구름':
      return { from: '#94a3b8', to: '#64748b' }
    default:
      return { from: '#7c3aed', to: '#06b6d4' }
  }
}

const favoriteCount = computed(() => favorites.value.length)
const filteredCount = computed(() => filteredWeatherList.value.length)

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

<template>
  <div class="relative min-h-[100dvh] bg-[#050510] text-white">
    <!-- Background -->
    <AuroraBackground
      :status="selectedCity.status"
      class="pointer-events-none fixed inset-0 z-0 opacity-40"
    />
    <ParticlesBg
      :quantity="50"
      :color="'#7c3aed'"
      :staticity="60"
      :ease="70"
      class="pointer-events-none fixed inset-0 z-0 opacity-25"
    />

    <!-- Content -->
    <div
      class="relative z-10 mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center px-4 pt-20 pb-16"
    >
      <!-- Header -->
      <header class="mb-8 w-full text-center">
        <p
          class="mb-3 font-mono text-[10px] font-medium tracking-[0.3em] text-violet-400/70 uppercase"
        >
          Atmospheric Observatory
        </p>
        <SparklesText
          :text="selectedCity.name"
          :sparkles-count="6"
          :colors="{ first: '#7c3aed', second: '#06b6d4' }"
          class="mb-3 text-5xl font-black tracking-tight sm:text-6xl"
        />
        <p class="text-sm text-zinc-400/60">
          {{ selectedCity.description }} · {{ selectedCity.status }}
        </p>
      </header>

      <!-- Stats Bento -->
      <BentoGrid class="mb-8 w-full max-w-md md:grid-cols-3">
        <BentoGridItem class="col-span-1 row-span-1 bg-white/[0.03] border border-white/[0.06]">
          <template #header>
            <p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">Avg Temp</p>
          </template>
          <template #icon>
            <div class="flex items-baseline gap-1 tabular-nums">
              <NumberTicker
                :value="stats.avg"
                :duration="1"
                :decimal-places="0"
                class="text-3xl font-bold tracking-tight text-white"
              />
              <span class="text-sm text-zinc-500">{{ tempUnit() }}</span>
            </div>
          </template>
        </BentoGridItem>
        <BentoGridItem class="col-span-1 row-span-1 bg-white/[0.03] border border-white/[0.06]">
          <template #header>
            <p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">High</p>
          </template>
          <template #icon>
            <div class="flex items-baseline gap-1 tabular-nums">
              <span class="text-3xl font-bold tracking-tight text-amber-400">
                {{ stats.highest ? convertTemp(stats.highest.temp) : '–' }}
              </span>
              <span class="text-sm text-amber-400/40">{{ tempUnit() }}</span>
            </div>
            <p class="mt-1 text-[10px] text-zinc-600">{{ stats.highest?.name || '' }}</p>
          </template>
        </BentoGridItem>
        <BentoGridItem class="col-span-1 row-span-1 bg-white/[0.03] border border-white/[0.06]">
          <template #header>
            <p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">Low</p>
          </template>
          <template #icon>
            <div class="flex items-baseline gap-1 tabular-nums">
              <span class="text-3xl font-bold tracking-tight text-blue-400">
                {{ stats.lowest ? convertTemp(stats.lowest.temp) : '–' }}
              </span>
              <span class="text-sm text-blue-400/40">{{ tempUnit() }}</span>
            </div>
            <p class="mt-1 text-[10px] text-zinc-600">{{ stats.lowest?.name || '' }}</p>
          </template>
        </BentoGridItem>
      </BentoGrid>

      <!-- Central Hero Card -->
      <div class="relative mb-10 w-full max-w-sm">
        <div
          class="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br p-[1px]"
          :class="weatherBgColor(selectedCity.status)"
        >
          <BorderBeam
            :size="280"
            :duration="14000"
            :border-width="1.5"
            :color-from="weatherBeamColors(selectedCity.status).from"
            :color-to="weatherBeamColors(selectedCity.status).to"
            :anchor="75"
          />
          <div class="relative rounded-[2.45rem] bg-[#0a0a1a]/95 p-8 backdrop-blur-2xl">
            <!-- Status + favorite -->
            <div class="mb-6 flex items-center justify-between">
              <span
                class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                :class="
                  selectedCity.status === '맑음'
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                    : selectedCity.status === '비'
                      ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                "
              >
                {{ selectedCity.status }}
              </span>
              <button
                class="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
                :class="
                  isFavorite(selectedCity.id)
                    ? 'text-amber-400'
                    : 'text-zinc-600 hover:text-zinc-400'
                "
                @click="toggleFavorite(selectedCity.id)"
              >
                <Icon
                  :icon="isFavorite(selectedCity.id) ? 'solar:star-bold' : 'solar:star-linear'"
                  class="size-5"
                />
              </button>
            </div>

            <!-- Temperature -->
            <div class="flex items-baseline gap-2 tabular-nums">
              <NumberTicker
                :value="convertTemp(selectedCity.temp)"
                :duration="1.2"
                :decimal-places="0"
                class="text-8xl font-black tracking-tighter text-white"
              />
              <span class="text-2xl font-light text-zinc-500">{{ tempUnit() }}</span>
            </div>

            <!-- Detail stats -->
            <div class="mt-6 grid grid-cols-3 gap-3">
              <div class="rounded-xl bg-white/[0.04] p-3 text-center">
                <p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">High</p>
                <p class="mt-0.5 text-sm font-bold text-amber-400/80 tabular-nums">
                  {{ convertTemp(selectedCity.high) }}°
                </p>
              </div>
              <div class="rounded-xl bg-white/[0.04] p-3 text-center">
                <p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">Low</p>
                <p class="mt-0.5 text-sm font-bold text-blue-400/80 tabular-nums">
                  {{ convertTemp(selectedCity.low) }}°
                </p>
              </div>
              <div class="rounded-xl bg-white/[0.04] p-3 text-center">
                <p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">Wind</p>
                <p class="mt-0.5 text-sm font-bold text-violet-400/80 tabular-nums">
                  {{ selectedCity.wind }}<span class="text-[10px] font-normal">m/s</span>
                </p>
              </div>
            </div>

            <!-- Decorative icon -->
            <div class="mt-5 flex items-center justify-center">
              <Icon
                :icon="weatherIcon(selectedCity.status)"
                class="size-14 opacity-15"
                :class="weatherColor(selectedCity.status)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="mb-5 flex w-full max-w-md flex-wrap items-center gap-2">
        <div class="relative flex-1">
          <Icon
            icon="solar:magnifer-linear"
            class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="도시 검색..."
            class="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pr-4 pl-9 text-sm text-white placeholder:text-zinc-600 backdrop-blur-md transition-all focus:border-violet-500/40 focus:bg-white/[0.07] focus:outline-none"
          />
        </div>
        <select
          v-model="unit"
          class="cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 backdrop-blur-md hover:border-white/20 focus:outline-none"
        >
          <option value="celsius">°C</option>
          <option value="fahrenheit">°F</option>
        </select>
        <select
          v-model="sortBy"
          class="cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 backdrop-blur-md hover:border-white/20 focus:outline-none"
        >
          <option value="name">이름순</option>
          <option value="temp">기온순</option>
        </select>
        <button
          class="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-400 backdrop-blur-md transition-all hover:border-white/20 hover:text-white active:scale-[0.98]"
          @click="simulateLoad"
        >
          <Icon
            icon="solar:refresh-circle-bold-duotone"
            class="size-4"
            :class="{ 'animate-spin': loading }"
          />
          갱신
        </button>
      </div>

      <!-- Status bar -->
      <div class="mb-6 flex w-full max-w-md items-center gap-3 text-xs text-zinc-600">
        <span class="flex items-center gap-1">
          <Icon icon="solar:star-bold-duotone" class="size-3 text-amber-500/60" />
          {{ favoriteCount }}
        </span>
        <span class="text-zinc-700">·</span>
        <span>{{ filteredCount }}개 도시</span>
        <span v-show="loading" class="ml-auto flex items-center gap-1.5 text-violet-400/70">
          <span class="inline-block size-1.5 animate-pulse rounded-full bg-violet-400" />
          동기화 중
        </span>
      </div>

      <!-- Loading skeleton -->
      <div
        v-if="loading"
        class="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5"
        >
          <div class="mb-3 h-3 w-12 rounded-full bg-white/[0.06]" />
          <div class="mb-2 h-6 w-10 rounded-lg bg-white/[0.06]" />
          <div class="h-3 w-16 rounded-full bg-white/[0.04]" />
        </div>
      </div>

      <!-- Satellite city grid -->
      <div v-else class="mb-10 w-full max-w-3xl">
        <div
          v-if="otherCities.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.01] py-16 text-center"
        >
          <Icon icon="solar:map-point-search-bold-duotone" class="mb-4 size-12 text-zinc-700" />
          <p class="text-sm font-medium text-zinc-500">일치하는 도시가 없습니다</p>
          <p class="mt-1 text-xs text-zinc-600">다른 검색어를 시도해보세요</p>
        </div>

        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <GlareCard
            v-for="city in otherCities"
            :key="city.id"
            class="cursor-pointer"
            @click="selectCity(city.id)"
          >
            <div
              class="relative flex h-full flex-col justify-between rounded-[32px] p-5 border border-white/[0.06]"
              :class="[isFavorite(city.id) ? 'bg-amber-500/[0.04]' : 'bg-white/[0.01]']"
            >
              <button
                class="absolute top-3 right-3 z-10 rounded-lg p-1 transition-all hover:scale-110 active:scale-95"
                :class="
                  isFavorite(city.id) ? 'text-amber-400' : 'text-zinc-700 hover:text-zinc-400'
                "
                @click.stop="toggleFavorite(city.id)"
              >
                <Icon
                  :icon="isFavorite(city.id) ? 'solar:star-bold' : 'solar:star-linear'"
                  class="size-3.5"
                />
              </button>

              <div>
                <div
                  class="mb-2 flex size-8 items-center justify-center rounded-lg"
                  :class="`bg-gradient-to-br ${weatherBgColor(city.status)}`"
                >
                  <Icon
                    :icon="weatherIcon(city.status)"
                    class="size-4"
                    :class="weatherColor(city.status)"
                  />
                </div>
                <h4 class="text-sm font-bold text-white">{{ city.name }}</h4>
                <p class="mt-0.5 text-[10px] text-zinc-500">{{ city.description }}</p>
              </div>

              <div class="mt-3">
                <span class="text-xl font-bold tracking-tight text-white tabular-nums">
                  {{ convertTemp(city.temp)
                  }}<span class="text-xs font-normal text-zinc-600">{{ tempUnit() }}</span>
                </span>
              </div>
            </div>
          </GlareCard>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <MorphingText
          :texts="['맑은 하늘', '비 내리는 날', '구름 낀 오후', '화창한 아침', '선선한 저녁']"
          :morph-time="3"
          :cool-down-time="1.2"
          class="text-xs tracking-wider text-zinc-600"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

input:focus,
select:focus {
  outline: none;
}
</style>
