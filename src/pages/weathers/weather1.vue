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
  맑음: { accent: '#f59e0b', bg: 'rgba(245,158,11,.12)', icon: 'mdi-weather-sunny' },
  비: { accent: '#3b82f6', bg: 'rgba(59,130,246,.12)', icon: 'mdi-weather-rainy' },
  구름: { accent: '#64748b', bg: 'rgba(100,116,139,.12)', icon: 'mdi-weather-cloudy' },
}

const weatherAtmosphere = {
  맑음: {
    accent: '#f59e0b',
    gradient: 'linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)',
    shadow: 'rgba(245, 158, 11, 0.22)',
  },
  비: {
    accent: '#3b82f6',
    gradient: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%)',
    shadow: 'rgba(59, 130, 246, 0.22)',
  },
  구름: {
    accent: '#64748b',
    gradient: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)',
    shadow: 'rgba(100, 116, 139, 0.22)',
  },
}

const filteredWeatherList = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()

  if (!keyword) {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.toLowerCase().includes(keyword))
})

const tempColor = (temp) => {
  if (temp >= 30) return '#dc2626'
  if (temp >= 25) return '#d97706'
  if (temp >= 15) return '#475569'
  if (temp >= 5) return '#2563eb'
  return '#1e40af'
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather2">
    <!-- Hero — atmospheric sky banner -->
    <section class="hero">
      <div class="hero__atmosphere"></div>
      <div class="hero__inner">
        <div class="hero__icon-ring">
          <i class="mdi mdi-weather-partly-cloudy" :style="{ fontSize: '36px' }"></i>
        </div>
        <h1 class="hero__title">도시별 날씨</h1>
        <p class="hero__sub">실시간 기상 관측 대시보드</p>

        <div class="hero__search">
          <div class="search-field">
            <i class="mdi mdi-magnify search-field__icon"></i>
            <input
              id="search-input"
              v-model="searchTerm"
              type="text"
              class="search-field__input"
              placeholder="도시 이름으로 검색..."
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

        <div class="hero__meta">
          <span class="hero__meta-item">
            <i class="mdi mdi-map-marker-outline" :style="{ fontSize: '16px' }"></i>
            {{ searchTerm.trim() || '전체 도시' }}
          </span>
          <span class="hero__meta-divider"></span>
          <span class="hero__meta-item">
            <i class="mdi mdi-dots-grid" :style="{ fontSize: '16px' }"></i>
            {{ filteredWeatherList.length }}개 관측
          </span>
        </div>
      </div>
    </section>

    <!-- City cards grid -->
    <section class="grid-section">
      <div v-if="filteredWeatherList.length" class="grid-section__cards">
        <div
          v-for="(city, index) in filteredWeatherList"
          :key="city.id"
          :class="['city-card', `city-card--${city.status}`]"
          :style="{
            animationDelay: `${index * 0.12}s`,
            '--accent': weatherAtmosphere[city.status].accent,
            '--gradient': weatherAtmosphere[city.status].gradient,
            '--shadow': weatherAtmosphere[city.status].shadow,
          }"
          tabindex="0"
          role="button"
          :aria-label="`${city.name} — ${city.status}, ${city.temp}도`"
          @click="showDetail(city.name, city.status)"
          @keydown.enter="showDetail(city.name, city.status)"
          @keydown.space.prevent="showDetail(city.name, city.status)"
        >
          <div class="city-card__icon-wrap">
            <div
              class="avatar-icon"
              :style="{
                '--avatar-bg': weatherPresentation[city.status].bg,
                '--avatar-color': weatherPresentation[city.status].accent,
              }"
            >
              <i
                :class="'mdi ' + weatherPresentation[city.status].icon"
                :style="{ fontSize: '32px' }"
              ></i>
            </div>
          </div>

          <div class="city-card__reading" :style="{ color: tempColor(city.temp) }">
            <span class="city-card__value">{{ city.temp }}</span>
            <span class="city-card__unit">℃</span>
          </div>

          <div class="city-card__header">
            <h3 class="city-card__name">{{ city.name }}</h3>
            <span
              class="city-card__chip"
              :style="{
                '--chip-bg': weatherPresentation[city.status].bg,
                '--chip-color': weatherPresentation[city.status].accent,
              }"
            >
              {{ city.status }}
            </span>
          </div>

          <p class="city-card__desc">
            {{ city.temp >= 25 ? '다소 더운 날씨입니다' : '선선한 날씨입니다' }}
          </p>

          <div class="city-card__bar"></div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state__icon">
          <i class="mdi mdi-cloud-search-outline" :style="{ fontSize: '72px' }"></i>
        </div>
        <h2 class="empty-state__title">검색 결과가 없습니다</h2>
        <p class="empty-state__desc">다른 도시 이름으로 검색해보세요</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.weather2 {
  --hero-deep: #0b2d45;
  --hero-mid: #143c5a;
  --hero-light: #1e5a7a;
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── Search field ── */
.search-field {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 999px;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.search-field__icon {
  color: #94a3b8;
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-right: 8px;
}

.search-field__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 0;
  font-size: 0.95rem;
  background: transparent;
  color: #1e293b;
  font-family: inherit;
}

.search-field__input::placeholder {
  color: #94a3b8;
}

.search-field__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 50%;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
  margin-left: 8px;
  font-size: 1rem;
  padding: 0;
}

.search-field__clear:hover {
  background: rgba(0, 0, 0, 0.12);
  color: #334155;
}

/* ── Avatar icon ── */
.avatar-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--avatar-bg);
  color: var(--avatar-color);
  transition: box-shadow 0.4s var(--ease-out);
}

.city-card:hover .avatar-icon {
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 15%, transparent);
}

.city-card__icon-wrap .mdi {
  transition: transform 0.45s var(--ease-out);
}

.city-card:hover .city-card__icon-wrap .mdi {
  transform: scale(1.12) rotate(-8deg);
}

/* ── Hero ── */
.hero {
  position: relative;
  background: linear-gradient(
    170deg,
    var(--hero-deep) 0%,
    var(--hero-mid) 40%,
    var(--hero-light) 100%
  );
  border-radius: 24px;
  padding: 48px 40px 40px;
  margin-bottom: 32px;
  overflow: hidden;
  isolation: isolate;
}

.hero__atmosphere {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 45% at 75% 25%, rgba(59, 130, 246, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse 35% 35% at 25% 75%, rgba(14, 165, 233, 0.08) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}

.hero__inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero__icon-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 20px;
}

.hero__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.hero__sub {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 28px;
}

.hero__search {
  max-width: 440px;
  margin: 0 auto 20px;
}

.hero__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.hero__meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
}

.hero__meta-item .mdi {
  opacity: 0.55;
}

.hero__meta-divider {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

/* ── Grid ── */
.grid-section__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .grid-section__cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .grid-section__cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ── City cards ── */
.city-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px 24px 0;
  background: var(--gradient);
  border-radius: 20px;
  border-left: 4px solid var(--accent);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  min-height: 310px;
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out);
  animation: cardIn 0.55s var(--ease-out) both;
}

.city-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.city-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 36px var(--shadow);
}

.city-card:active {
  transform: translateY(-2px);
}

.city-card__icon-wrap {
  margin-bottom: 16px;
}

.city-card__reading {
  font-weight: 800;
  line-height: 1;
  transition: transform 0.3s var(--ease-out);
}

.city-card:hover .city-card__reading {
  transform: scale(1.04);
}

.city-card__value {
  font-size: 3.5rem;
  letter-spacing: -0.04em;
  font-feature-settings: 'tnum';
}

.city-card__unit {
  font-size: 1.5rem;
  font-weight: 600;
  opacity: 0.5;
  vertical-align: super;
  margin-left: 2px;
}

.city-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.city-card__name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.city-card__chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--chip-bg);
  color: var(--chip-color);
}

.city-card__desc {
  font-size: 0.8rem;
  color: #64748b;
  margin: 8px 0 24px;
}

.city-card__bar {
  width: 100%;
  height: 4px;
  background: var(--accent);
  border-radius: 0 0 20px 20px;
  opacity: 0.65;
}

/* ── Empty state ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  animation: cardIn 0.4s var(--ease-out) both;
}

.empty-state__icon {
  color: #94a3b8;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state__title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 6px;
}

.empty-state__desc {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

/* ── Entrance animation ── */
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .hero {
    border-radius: 16px;
    padding: 32px 20px 28px;
    margin-bottom: 20px;
  }

  .hero__title {
    font-size: 1.35rem;
  }

  .hero__icon-ring {
    width: 56px;
    height: 56px;
  }

  .city-card {
    padding: 28px 16px 0;
    border-radius: 16px;
    min-height: 252px;
  }

  .city-card__value {
    font-size: 2.75rem;
  }

  .city-card__unit {
    font-size: 1.25rem;
  }

  .city-card__bar {
    border-radius: 0 0 16px 16px;
  }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .city-card {
    animation: none !important;
    transition: none !important;
  }

  .city-card:hover {
    transform: none !important;
  }

  .city-card__icon-wrap .mdi,
  .city-card__reading {
    transition: none !important;
  }

  .city-card:hover .city-card__reading,
  .city-card:hover .city-card__icon-wrap .mdi {
    transform: none !important;
  }
}
</style>
