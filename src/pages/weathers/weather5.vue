<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from '@/components/exercises/BaseDashboardCard.vue'
import SearchBar from '@/components/exercises/SearchBar.vue'
import WeatherCard from '@/components/exercises/WeatherCard.vue'
import DesignTestimonials from '@/components/ui/design-testimonials/DesignTestimonials.vue'
import { AuroraBackground } from '@/components/ui/aurora-background'

defineOptions({ name: 'Weather5Page' })

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
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    description: '우산을 챙기세요',
    high: 26,
    low: 18,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    description: '선선한 바람',
    high: 28,
    low: 21,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 30,
    status: '맑음',
    description: '완벽한 해변 날씨',
    high: 32,
    low: 24,
  },
  {
    id: 'city_05',
    name: '강릉',
    temp: 22,
    status: '비',
    description: '동해안 장마',
    high: 24,
    low: 17,
  },
  {
    id: 'city_06',
    name: '대전',
    temp: 27,
    status: '구름',
    description: '흐린 오후',
    high: 29,
    low: 20,
  },
])

const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const testimonials = computed(() =>
  weatherList.value.map((city) => ({
    company: city.name,
    quote: `${city.temp}°`,
    author: `${city.high}° / ${city.low}°`,
    role: city.status,
    description: city.description,
    status: city.status,
  })),
)

const selectedIndex = ref(-1)
const currentStatus = ref('맑음')

function onActiveChange(idx) {
  currentStatus.value = weatherList.value[idx]?.status || '맑음'
}

function selectCity(city) {
  selectedCityInfo.value = city
  const idx = weatherList.value.findIndex((c) => c.id === city.id)
  selectedIndex.value = idx
  currentStatus.value = city.status
}

watch(selectedCityInfo, (newCity) => {
  if (newCity) console.log(`[watch] 선택된 도시: ${newCity.name}`)
})

watchEffect(() => {
  console.log(
    `[watchEffect] 검색어: "${searchQuery.value}" → ${filteredWeatherList.value.length}개`,
  )
})
</script>

<template>
  <AuroraBackground
    :radial-gradient="true"
    class="!min-h-[100dvh] !justify-start !pt-4"
    :status="currentStatus"
  >
    <div class="w-full">
      <DesignTestimonials
        title="날씨"
        :testimonials="testimonials"
        :duration="4000"
        :selected="selectedIndex"
        @update:active="onActiveChange"
      />

      <div class="mx-auto max-w-2xl px-4 space-y-4 mt-4">
        <BaseDashboardCard>
          <SearchBar :model-value="searchQuery" @update-query="searchQuery = $event" />
        </BaseDashboardCard>

        <BaseDashboardCard>
          <template v-if="searchQuery.trim() === ''">
            <p class="mb-4 text-sm text-zinc-400">전체 도시 목록 ({{ weatherList.length }}개)</p>
            <div class="space-y-2">
              <WeatherCard
                v-for="city in weatherList"
                :key="city.id"
                :city="city"
                @select-card="selectCity"
              />
            </div>
          </template>
          <template v-else-if="filteredWeatherList.length > 0">
            <p class="mb-4 text-sm text-zinc-400">
              "{{ searchQuery }}" 검색 결과 ({{ filteredWeatherList.length }}개)
            </p>
            <div class="space-y-2">
              <WeatherCard
                v-for="city in filteredWeatherList"
                :key="city.id"
                :city="city"
                @select-card="selectCity"
              />
            </div>
          </template>
          <template v-else>
            <div class="py-8 text-center text-zinc-400">
              "{{ searchQuery }}"와 일치하는 도시가 없습니다.
            </div>
          </template>
        </BaseDashboardCard>
      </div>
    </div>
  </AuroraBackground>
</template>
