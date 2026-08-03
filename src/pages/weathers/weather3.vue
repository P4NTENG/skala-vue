<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

defineOptions({ name: 'Weather3Page' })

// 1. 반응형 상태
const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', description: '화창한 하루' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', description: '우산을 챙기세요' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', description: '선선한 바람' },
  { id: 'city_04', name: '제주', temp: 30, status: '맑음', description: '완벽한 해변 날씨' },
  { id: 'city_05', name: '강릉', temp: 22, status: '비', description: '동해안 장마' },
  { id: 'city_06', name: '대전', temp: 27, status: '구름', description: '흐린 오후' },
  { id: 'city_07', name: '광주', temp: 29, status: '맑음', description: '무더위 주의' },
  { id: 'city_08', name: '인천', temp: 25, status: '구름', description: '해무 가능성' },
])

// 2. Computed: 검색어로 필터링
const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter(city =>
    city.name.includes(searchQuery.value.trim())
  )
})

function selectCity(city) {
  selectedCityInfo.value = city
}

// 3. watch: selectedCityInfo 변화 감시
watch(selectedCityInfo, (newCity) => {
  if (newCity) {
    console.log(`[watch] 선택된 도시: ${newCity.name} (${newCity.temp}°C, ${newCity.status})`)
  }
})

// 3. watchEffect: searchQuery 변화 감시
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}" → ${filteredWeatherList.value.length}개 결과`)
})
</script>

<template>
  <div class="min-h-[100dvh] bg-white pt-24 pb-24 dark:bg-zinc-950">
    <div class="mx-auto max-w-2xl px-6">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white">날씨 검색</h1>
      <p class="mt-2 text-zinc-500 dark:text-zinc-400">
        도시 이름을 검색하여 날씨 정보를 확인하세요.
      </p>

      <!-- 선택된 도시 상태바 -->
      <div
        v-if="selectedCityInfo"
        class="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
      >
        선택된 도시: <strong>{{ selectedCityInfo.name }}</strong>
        — {{ selectedCityInfo.temp }}°C, {{ selectedCityInfo.status }}
      </div>

      <!-- 검색 입력 -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="도시 이름을 입력하세요 (예: 서울, 부산)"
        class="mt-6 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-900"
      />

      <!-- 검색 결과 -->
      <div class="mt-6">
        <!-- 검색어 비었음 → 전체 출력 -->
        <template v-if="searchQuery.trim() === ''">
          <p class="mb-4 text-sm text-zinc-400">전체 도시 목록 ({{ weatherList.length }}개)</p>
          <div class="space-y-2">
            <button
              v-for="city in weatherList"
              :key="city.id"
              @click="selectCity(city)"
              class="flex w-full items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800 dark:hover:bg-blue-950"
            >
              <span class="text-lg font-semibold text-zinc-800 dark:text-white">{{ city.name }}</span>
              <span class="text-sm text-zinc-500 dark:text-zinc-400">{{ city.temp }}°C</span>
              <span class="ml-auto rounded-full bg-zinc-200 px-3 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {{ city.status }}
              </span>
            </button>
          </div>
        </template>

        <!-- 검색어 있음 + 결과 있음 -->
        <template v-else-if="filteredWeatherList.length > 0">
          <p class="mb-4 text-sm text-zinc-400">
            "{{ searchQuery }}" 검색 결과 ({{ filteredWeatherList.length }}개)
          </p>
          <div class="space-y-2">
            <button
              v-for="city in filteredWeatherList"
              :key="city.id"
              @click="selectCity(city)"
              class="flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 dark:hover:border-blue-700 dark:hover:bg-blue-950"
            >
              <span class="text-lg font-semibold text-zinc-800 dark:text-white">{{ city.name }}</span>
              <span class="text-sm text-zinc-500 dark:text-zinc-400">{{ city.temp }}°C</span>
              <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ city.description }}</span>
              <span class="ml-auto rounded-full bg-blue-200 px-3 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                {{ city.status }}
              </span>
            </button>
          </div>
        </template>

        <!-- 검색 결과 없음 -->
        <template v-else>
          <div class="rounded-xl border border-zinc-100 bg-zinc-50 px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p class="text-zinc-400 dark:text-zinc-500">
              "{{ searchQuery }}"와 일치하는 도시가 없습니다.
            </p>
            <p class="mt-1 text-sm text-zinc-300 dark:text-zinc-600">
              다른 도시 이름으로 검색해보세요.
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
