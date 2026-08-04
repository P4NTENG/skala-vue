<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from '@/components/exercises/BaseDashboardCard.vue'
import SearchBar from '@/components/exercises/SearchBar.vue'
import WeatherCard from '@/components/exercises/WeatherCard.vue'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'Weather6Page' })

// ── 반응형 변수 ──
const searchQuery = ref('')
const selectedCityInfo = ref(null)
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
  try {
    return JSON.parse(localStorage.getItem('weatherFavorites') || '[]')
  } catch {
    return []
  }
}

// ── v-show 로딩 상태 토글 ──
function simulateLoad() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 800)
}

// ── 즐겨찾기 토글 ──
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

// ── 온도 변환 ──
function convertTemp(celsius) {
  if (unit.value === 'fahrenheit') return Math.round(celsius * 9 / 5 + 32)
  return celsius
}

function tempUnit() {
  return unit.value === 'celsius' ? '°C' : '°F'
}

// ── Computed ──
const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter(city => city.name.includes(searchQuery.value.trim()))
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
  const temps = list.map(c => c.temp)
  const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
  const highest = list.reduce((a, b) => a.temp > b.temp ? a : b)
  const lowest = list.reduce((a, b) => a.temp < b.temp ? a : b)
  return { avg, highest, lowest }
})

function selectCity(city) {
  selectedCityInfo.value = city
}

// ── Watch ──
watch(sortBy, (newVal) => {
  console.log(`[watch] 정렬 기준 변경: ${newVal}`)
})

watch(favorites, (newVal) => {
  localStorage.setItem('weatherFavorites', JSON.stringify(newVal))
  console.log(`[watch] 즐겨찾기 저장됨: ${newVal.length}개`)
}, { deep: true })

watchEffect(() => {
  console.log(`[watchEffect] 검색어: "${searchQuery.value}" → ${filteredCount.value}개, 정렬: ${sortBy.value}`)
})
</script>

<template>
  <div class="min-h-[100dvh] bg-white pt-24 pb-24 dark:bg-zinc-950">
    <div class="mx-auto max-w-2xl px-6">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white">날씨 대시보드</h1>

      <!-- 통계 -->
      <div class="mt-6 grid grid-cols-3 gap-3">
        <div class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ stats.avg }}{{ tempUnit() }}</p>
          <p class="text-xs text-zinc-400">평균 기온</p>
        </div>
        <div class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-2xl font-bold text-orange-500">{{ stats.highest?.temp || '-' }}{{ tempUnit() }}</p>
          <p class="text-xs text-zinc-400">최고 · {{ stats.highest?.name || '-' }}</p>
        </div>
        <div class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-2xl font-bold text-blue-500">{{ stats.lowest?.temp || '-' }}{{ tempUnit() }}</p>
          <p class="text-xs text-zinc-400">최저 · {{ stats.lowest?.name || '-' }}</p>
        </div>
      </div>

      <!-- 상태바 -->
      <div class="mt-4 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span>즐겨찾기 {{ favoriteCount }}개</span>
        <span>·</span>
        <span>검색 결과 {{ filteredCount }}개</span>
        <span>·</span>
        <!-- v-show 로딩 -->
        <span v-show="loading" class="text-blue-500 animate-pulse">로딩 중...</span>
      </div>

      <!-- 컨트롤: 단위 + 정렬 -->
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <!-- v-model 단위 -->
        <select v-model="unit" class="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
          <option value="celsius">섭씨 °C</option>
          <option value="fahrenheit">화씨 °F</option>
        </select>

        <!-- v-model 정렬 -->
        <select v-model="sortBy" class="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
          <option value="name">이름순</option>
          <option value="temp">기온순</option>
        </select>

        <button
          class="rounded-lg border border-zinc-200 px-3 py-2 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          @click="simulateLoad"
        >
          {{ loading ? '로딩 중...' : '새로고침' }}
        </button>
      </div>

      <!-- 검색 -->
      <BaseDashboardCard class="mt-4">
        <SearchBar :model-value="searchQuery" @update-query="searchQuery = $event" />
      </BaseDashboardCard>

      <!-- 결과 -->
      <BaseDashboardCard class="mt-4">
        <template v-if="searchQuery.trim() === ''">
          <p class="mb-4 text-sm text-zinc-400">전체 {{ weatherList.length }}개</p>
        </template>
        <template v-else-if="filteredCount > 0">
          <p class="mb-4 text-sm text-zinc-400">"{{ searchQuery }}" 검색 결과 {{ filteredCount }}개</p>
        </template>
        <template v-else>
          <div class="py-8 text-center text-zinc-400">일치하는 도시가 없습니다.</div>
        </template>

        <div class="space-y-2">
          <div
            v-for="city in sortedWeatherList"
            :key="city.id"
            class="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800 dark:hover:bg-blue-950"
            @click="selectCity(city)"
          >
            <span class="text-lg font-semibold text-zinc-800 dark:text-white">{{ city.name }}</span>
            <span class="text-sm text-zinc-500">{{ convertTemp(city.temp) }}{{ tempUnit() }}</span>
            <span class="ml-auto rounded-full bg-zinc-200 px-3 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">{{ city.status }}</span>
            <!-- v-bind 즐겨찾기 아이콘 -->
            <button
              class="ml-1 rounded-full p-1 transition-all hover:scale-110"
              :class="isFavorite(city.id) ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-600'"
              @click.stop="toggleFavorite(city.id)"
            >
              <Icon :icon="isFavorite(city.id) ? 'solar:star-bold' : 'solar:star-linear'" class="size-4" />
            </button>
          </div>
        </div>
      </BaseDashboardCard>
    </div>
  </div>
</template>
