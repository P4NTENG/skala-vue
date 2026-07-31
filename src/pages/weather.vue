<script setup>
import { computed, ref } from 'vue'

defineOptions({
  name: 'WeatherPage',
})

const searchTerm = ref('')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const weatherPresentation = {
  맑음: { color: 'warning', icon: 'mdi-weather-sunny' },
  비: { color: 'info', icon: 'mdi-weather-rainy' },
  구름: { color: 'secondary', icon: 'mdi-weather-cloudy' },
}

const filteredWeatherList = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()

  if (!keyword) {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.toLowerCase().includes(keyword))
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <VCard color="secondary">
          <VCardItem>
            <VCardTitle>도시별 날씨</VCardTitle>
            <VCardSubtitle>Vuetify 컴포넌트로 구성한 날씨 검색 예제입니다.</VCardSubtitle>

            <template #append>
              <VIcon icon="mdi-weather-partly-cloudy" size="48" />
            </template>
          </VCardItem>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard max-width="720" variant="outlined">
          <VCardText>
            <VTextField
              id="search-input"
              v-model="searchTerm"
              clearable
              hide-details
              label="도시 검색"
              placeholder="검색할 도시 이름 입력"
              prepend-inner-icon="mdi-magnify"
            />
          </VCardText>

          <VCardActions>
            <VChip color="primary" prepend-icon="mdi-map-marker" variant="tonal">
              검색 중인 도시: {{ searchTerm.trim() || '전체' }}
            </VChip>
          </VCardActions>
        </VCard>
      </VCol>

      <VCol cols="12" aria-live="polite">
        <VRow v-if="filteredWeatherList.length">
          <VCol
            v-for="city in filteredWeatherList"
            :key="city.id"
            cols="12"
            md="6"
            sm="6"
          >
            <VCard
              height="100%"
              hover
              tabindex="0"
              @click="showDetail(city.name, city.status)"
              @keydown.enter="showDetail(city.name, city.status)"
            >
              <VCardItem>
                <template #prepend>
                  <VAvatar
                    :color="weatherPresentation[city.status].color"
                    size="48"
                    variant="tonal"
                  >
                    <VIcon :icon="weatherPresentation[city.status].icon" />
                  </VAvatar>
                </template>

                <VCardTitle>{{ city.name }}</VCardTitle>
                <VCardSubtitle>현재 관측 정보</VCardSubtitle>

                <template #append>
                  <VChip
                    :color="weatherPresentation[city.status].color"
                    size="small"
                    variant="tonal"
                  >
                    {{ city.status }}
                  </VChip>
                </template>
              </VCardItem>

              <VCardText>
                <VListItem
                  :subtitle="city.temp >= 25 ? '다소 더운 날씨입니다.' : '선선한 날씨입니다.'"
                  :title="`${city.temp}℃`"
                />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <VAlert
          v-else
          color="info"
          icon="mdi-map-search-outline"
          title="검색 결과가 없습니다"
          variant="tonal"
        >
          다른 도시 이름으로 검색해보세요.
        </VAlert>
      </VCol>
    </VRow>
  </VContainer>
</template>
