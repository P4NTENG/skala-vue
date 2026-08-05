<script setup>
import { computed, ref } from 'vue'

defineOptions({
  name: 'WeatherDraftPage',
})

const searchTerm = ref('')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const weatherPresentation = {
  맑음: { accent: '#f59e0b', bg: 'rgba(245,158,11,.12)', icon: 'mdi-weather-sunny' },
  비: { accent: '#3b82f6', bg: 'rgba(59,130,246,.12)', icon: 'mdi-weather-rainy' },
  구름: { accent: '#64748b', bg: 'rgba(100,116,139,.12)', icon: 'mdi-weather-cloudy' },
}

const filteredWeatherList = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()

  if (!keyword) {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.toLowerCase().includes(keyword))
})

const tempDescription = (temp) => {
  return temp >= 25 ? '다소 더운 날씨입니다.' : '선선한 날씨입니다.'
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-draft">
    <!-- Hero header -->
    <div class="draft-hero">
      <div class="draft-hero__content">
        <div class="draft-hero__text">
          <h2 class="draft-hero__title">도시별 날씨</h2>
          <p class="draft-hero__subtitle">도시별 날씨 컴포넌트 검색 예제입니다.</p>
        </div>
        <i class="mdi mdi-weather-partly-cloudy draft-hero__icon"></i>
      </div>
    </div>

    <!-- Search card -->
    <div class="draft-search">
      <div class="draft-search__body">
        <div class="search-field">
          <i class="mdi mdi-magnify search-field__icon"></i>
          <input
            id="search-input"
            v-model="searchTerm"
            type="text"
            class="search-field__input"
            placeholder="검색할 도시 이름 입력"
          />
          <button
            v-if="searchTerm"
            class="search-field__clear"
            @click="searchTerm = ''"
            type="button"
            aria-label="검색어 지우기"
          >
            <i class="mdi mdi-close"></i>
          </button>
        </div>
      </div>
      <div class="draft-search__footer">
        <span class="draft-search__chip">
          <i class="mdi mdi-map-marker-outline"></i>
          검색 중인 도시: {{ searchTerm.trim() || '전체' }}
        </span>
      </div>
    </div>

    <!-- City cards -->
    <div aria-live="polite">
      <div v-if="filteredWeatherList.length" class="draft-grid">
        <div
          v-for="city in filteredWeatherList"
          :key="city.id"
          :class="['draft-card', `draft-card--${city.status}`]"
          tabindex="0"
          role="button"
          :aria-label="`${city.name} — ${city.status}`"
          @click="showDetail(city.name, city.status)"
          @keydown.enter="showDetail(city.name, city.status)"
          @keydown.space.prevent="showDetail(city.name, city.status)"
        >
          <div class="draft-card__header">
            <div
              class="avatar-icon"
              :style="{
                width: '48px',
                height: '48px',
                '--avatar-bg': weatherPresentation[city.status].bg,
                '--avatar-color': weatherPresentation[city.status].accent,
              }"
            >
              <i
                :class="'mdi ' + weatherPresentation[city.status].icon"
                :style="{ fontSize: '24px' }"
              ></i>
            </div>
            <div class="draft-card__titles">
              <h3 class="draft-card__name">{{ city.name }}</h3>
              <p class="draft-card__meta">현재 관측 정보</p>
            </div>
            <span
              class="draft-card__status"
              :style="{
                '--chip-bg': weatherPresentation[city.status].bg,
                '--chip-color': weatherPresentation[city.status].accent,
              }"
            >
              {{ city.status }}
            </span>
          </div>

          <div class="draft-card__temp">
            <div class="draft-card__temp-value">{{ city.temp }}℃</div>
            <p class="draft-card__temp-desc">{{ tempDescription(city.temp) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="draft-empty">
        <i class="mdi mdi-map-search-outline draft-empty__icon"></i>
        <h3 class="draft-empty__title">검색 결과가 없습니다</h3>
        <p class="draft-empty__desc">다른 도시 이름으로 검색해보세요.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Search field (shared) ── */
.search-field {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 12px;
  transition: border-color 0.2s;
}

.search-field:focus-within {
  border-color: #23825a;
  box-shadow: 0 0 0 3px rgba(35, 130, 90, 0.1);
}

.search-field__icon {
  color: #9ca3af;
  font-size: 1.15rem;
  flex-shrink: 0;
  margin-right: 8px;
}

.search-field__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 0.9rem;
  background: transparent;
  color: #1f2937;
  font-family: inherit;
}

.search-field__input::placeholder {
  color: #9ca3af;
}

.search-field__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: #9ca3af;
  flex-shrink: 0;
  margin-left: 8px;
  font-size: 1.1rem;
  padding: 0;
}

.search-field__clear:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #4b5563;
}

/* ── Avatar icon (shared) ── */
.avatar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--avatar-bg);
  color: var(--avatar-color);
  flex-shrink: 0;
}

/* ── Hero ── */
.draft-hero {
  background: linear-gradient(135deg, #1e3a5f 0%, #316b83 40%, #3b82a0 100%);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.draft-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -10%;
  width: 55%;
  height: 140%;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.draft-hero__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.draft-hero__title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.draft-hero__subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.82rem;
  margin: 0;
}

.draft-hero__icon {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

/* ── Search card ── */
.draft-search {
  max-width: 720px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}

.draft-search__body {
  padding: 16px;
}

.draft-search__footer {
  padding: 10px 16px;
  border-top: 1px solid #f3f4f6;
}

.draft-search__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(35, 130, 90, 0.08);
  color: #23825a;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.draft-search__chip .mdi {
  font-size: 1rem;
}

/* ── Grid ── */
.draft-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .draft-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ── City card ── */
.draft-card {
  background: #fff;
  border-radius: 16px;
  border-left: 4px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.draft-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.draft-card:focus-visible {
  outline: 2px solid #23825a;
  outline-offset: 2px;
}

.draft-card--맑음 {
  background: linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%);
  border-left-color: #f59e0b;
}

.draft-card--비 {
  background: linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%);
  border-left-color: #3b82f6;
}

.draft-card--구름 {
  background: linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%);
  border-left-color: #64748b;
}

.draft-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 12px;
}

.draft-card__titles {
  flex: 1;
  min-width: 0;
}

.draft-card__name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.draft-card__meta {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 2px 0 0;
}

.draft-card__status {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 500;
  background: var(--chip-bg);
  color: var(--chip-color);
  flex-shrink: 0;
}

.draft-card__temp {
  padding: 0 20px 20px;
}

.draft-card__temp-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.draft-card__temp-desc {
  font-size: 0.78rem;
  color: #64748b;
  margin: 4px 0 0;
}

/* ── Empty state ── */
.draft-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  text-align: center;
  background: rgba(49, 107, 131, 0.04);
  border-radius: 16px;
}

.draft-empty__icon {
  font-size: 64px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.draft-empty__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 4px;
}

.draft-empty__desc {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .draft-hero {
    padding: 24px 20px;
    border-radius: 12px;
  }

  .draft-hero__title {
    font-size: 1.2rem;
  }

  .draft-hero__icon {
    font-size: 36px;
  }

  .draft-card {
    border-radius: 12px;
  }

  .draft-card__temp-value {
    font-size: 1.75rem;
  }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .draft-card {
    transition: none !important;
  }

  .draft-card:hover {
    transform: none !important;
  }
}
</style>
