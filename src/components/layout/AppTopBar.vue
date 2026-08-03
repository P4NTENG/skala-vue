<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

defineOptions({
  name: 'AppTopBar',
})

const route = useRoute()
const practiceMenu = ref(null)
const weatherMenu = ref(null)

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
]

const practicePageModules = import.meta.glob('../../pages/practices/**/*.vue')
const practiceGroups = createPracticeGroups(Object.keys(practicePageModules))

const weatherPageModules = import.meta.glob('../../pages/weathers/*.vue')
const weatherPages = Object.keys(weatherPageModules)
  .map((pagePath) => {
    const fileName = pagePath.split('/').pop()?.replace(/\.vue$/, '')
    if (!fileName) return null

    return {
      label: formatPageLabel(fileName),
      to: `/weathers/${fileName}`,
    }
  })
  .filter((item) => item !== null)

function createPracticeGroups(pagePaths) {
  const groups = new Map()

  for (const pagePath of pagePaths) {
    const relativePath = pagePath.split('/pages/practices/')[1]?.replace(/\.vue$/, '')

    if (!relativePath || relativePath.includes('[')) {
      continue
    }

    const segments = relativePath.split('/')
    const groupName = segments.shift()
    const fileName = segments.at(-1)

    if (!groupName || !fileName) {
      continue
    }

    const routeSegments = fileName === 'index' ? [groupName, ...segments.slice(0, -1)] : [groupName, ...segments]
    const item = {
      label: fileName === 'index' ? 'Overview' : formatPageLabel(fileName),
      to: `/practices/${routeSegments.join('/')}`,
    }

    if (!groups.has(groupName)) {
      groups.set(groupName, [])
    }

    groups.get(groupName).push(item)
  }

  return [...groups.entries()]
    .sort(([firstGroup], [secondGroup]) => firstGroup.localeCompare(secondGroup))
    .map(([groupName, items]) => ({
      label: formatGroupLabel(groupName),
      description: `${items.length}개 실습`,
      items: items.sort((firstItem, secondItem) => firstItem.label.localeCompare(secondItem.label)),
    }))
}

function formatGroupLabel(value) {
  return value
    .split(/[-_.]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatPageLabel(value) {
  if (value.startsWith('v-')) {
    return value
  }

  return formatGroupLabel(value)
}

function closePracticeMenu() {
  practiceMenu.value?.removeAttribute('open')
}

function closeWeatherMenu() {
  weatherMenu.value?.removeAttribute('open')
}
</script>

<template>
  <header class="top-bar">
    <div class="top-bar__inner">
      <RouterLink class="brand" to="/" aria-label="SKALA Vue Lab 홈">
        <span class="brand__mark" aria-hidden="true">SV</span>
        <span class="brand__copy">
          <strong>SKALA</strong>
          <small>Vue Lab</small>
        </span>
      </RouterLink>

      <nav class="top-bar__nav" aria-label="주요 메뉴">
        <RouterLink
          v-for="(item, index) in navigationItems"
          :key="item.to"
          class="top-bar__link"
          :to="item.to"
        >
          <span class="top-bar__index" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          {{ item.label }}
        </RouterLink>

        <details
          ref="practiceMenu"
          class="practice-menu"
          :class="{ 'practice-menu--active': route.path.startsWith('/practices/') }"
        >
          <summary class="top-bar__link practice-menu__trigger">
            <span class="top-bar__index" aria-hidden="true">03</span>
            Practices
            <span class="practice-menu__chevron" aria-hidden="true">⌄</span>
          </summary>

          <div class="practice-menu__panel">
            <div class="practice-menu__heading">
              <span>Practice library</span>
              <strong>폴더별 실습 목록</strong>
            </div>

            <section v-for="group in practiceGroups" :key="group.label" class="practice-group">
              <header class="practice-group__header">
                <strong>{{ group.label }}</strong>
                <span>{{ group.description }}</span>
              </header>

              <div class="practice-group__links">
                <RouterLink
                  v-for="item in group.items"
                  :key="item.to"
                  class="practice-group__link"
                  :to="item.to"
                  @click="closePracticeMenu"
                >
                  {{ item.label }}
                </RouterLink>
              </div>
            </section>
          </div>
        </details>

        <details
          ref="weatherMenu"
          class="practice-menu"
          :class="{ 'practice-menu--active': route.path.startsWith('/weathers/') }"
        >
          <summary class="top-bar__link practice-menu__trigger">
            <span class="top-bar__index" aria-hidden="true">04</span>
            Weather
            <span class="practice-menu__chevron" aria-hidden="true">⌄</span>
          </summary>

          <div class="practice-menu__panel">
            <div class="practice-menu__heading">
              <span>Weather dashboard</span>
              <strong>날씨 대시보드</strong>
            </div>

            <section v-if="weatherPages.length" class="practice-group">
              <div class="practice-group__links practice-group__links--full">
                <RouterLink
                  v-for="item in weatherPages"
                  :key="item.to"
                  class="practice-group__link"
                  :to="item.to"
                  @click="closeWeatherMenu"
                >
                  {{ item.label }}
                </RouterLink>
              </div>
            </section>
          </div>
        </details>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  color: #effaf5;
  background: #1d2a28;
  border-bottom: 3px solid #42b883;
  box-shadow: 0 8px 24px rgba(15, 31, 27, 0.14);
}

.top-bar__inner {
  width: min(100% - 2rem, 1280px);
  min-height: 68px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.brand {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

.brand:hover {
  background: transparent;
}

.brand__mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #13201c;
  background: #42b883;
  border-radius: 10px 2px 10px 2px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(-3deg);
}

.brand__copy {
  display: grid;
  line-height: 1.05;
}

.brand__copy strong {
  font-size: 0.95rem;
  font-weight: 760;
  letter-spacing: 0.14em;
}

.brand__copy small {
  margin-top: 0.25rem;
  color: #9bb8ae;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.top-bar__nav {
  display: flex;
  align-self: stretch;
  overflow: visible;
}

.top-bar__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 1rem;
  color: #bed0ca;
  white-space: nowrap;
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 650;
  cursor: pointer;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.top-bar__link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.top-bar__link::after {
  position: absolute;
  right: 1rem;
  bottom: 0;
  left: 1rem;
  height: 3px;
  background: #42b883;
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 160ms ease;
}

.top-bar__link.router-link-exact-active,
.practice-menu--active > .practice-menu__trigger {
  color: #ffffff;
  background: rgba(66, 184, 131, 0.1);
}

.top-bar__link.router-link-exact-active::after,
.practice-menu--active > .practice-menu__trigger::after {
  transform: scaleX(1);
}

.top-bar__index {
  color: #6f9185;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.practice-menu {
  position: relative;
  display: flex;
}

.practice-menu__trigger {
  height: 100%;
  list-style: none;
}

.practice-menu__trigger::-webkit-details-marker {
  display: none;
}

.practice-menu__chevron {
  margin-left: 0.15rem;
  color: #7fa497;
  font-size: 1rem;
  line-height: 1;
  transition: transform 160ms ease;
}

.practice-menu[open] .practice-menu__trigger {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.practice-menu[open] .practice-menu__chevron {
  transform: rotate(180deg);
}

.practice-menu__panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: min(620px, calc(100vw - 2rem));
  max-height: calc(100vh - 100px);
  padding: 1.25rem;
  overflow-y: auto;
  color: #24332e;
  background: #f7fbf9;
  border: 1px solid #cfe2da;
  border-radius: 14px 4px 14px 4px;
  box-shadow: 0 24px 60px rgba(15, 38, 30, 0.24);
}

.practice-menu__panel::before {
  position: absolute;
  top: -7px;
  right: 2.25rem;
  width: 12px;
  height: 12px;
  background: #f7fbf9;
  border-top: 1px solid #cfe2da;
  border-left: 1px solid #cfe2da;
  content: '';
  transform: rotate(45deg);
}

.practice-menu__heading {
  display: grid;
  margin-bottom: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid #d9e8e2;
}

.practice-menu__heading span {
  color: #4d8c70;
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.practice-menu__heading strong {
  margin-top: 0.15rem;
  color: #182720;
  font-size: 1.05rem;
  font-weight: 750;
}

.practice-group {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1rem;
  padding: 0.9rem 0;
}

.practice-group + .practice-group {
  border-top: 1px solid #dfeae5;
}

.practice-group__header {
  display: grid;
  align-content: start;
  gap: 0.15rem;
  padding-left: 0.75rem;
  border-left: 3px solid #42b883;
}

.practice-group__header strong {
  color: #1d2a28;
  font-size: 0.84rem;
  font-weight: 750;
}

.practice-group__header span {
  color: #71847d;
  font-size: 0.7rem;
}

.practice-group__links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
}

.practice-group__links--full {
  grid-template-columns: 1fr;
}

.practice-group__link {
  padding: 0.5rem 0.65rem;
  color: #40514b;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 600;
  transition:
    color 140ms ease,
    background-color 140ms ease,
    transform 140ms ease;
}

.practice-group__link:hover {
  color: #176b47;
  background: #e7f5ee;
  transform: translateX(2px);
}

.practice-group__link.router-link-exact-active {
  color: #0e5e3b;
  background: #d8f1e5;
}

.brand:focus-visible,
.top-bar__link:focus-visible,
.practice-group__link:focus-visible {
  outline: 2px solid #8ce7bd;
  outline-offset: -4px;
}

@media (max-width: 720px) {
  .top-bar__inner {
    width: 100%;
    min-height: auto;
    display: grid;
    gap: 0;
  }

  .brand {
    padding: 0.8rem 1rem 0.65rem;
  }

  .brand__mark {
    width: 32px;
    height: 32px;
  }

  .top-bar__nav {
    min-width: 0;
    min-height: 44px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .top-bar__link {
    justify-content: center;
    padding: 0 0.7rem;
    font-size: 0.78rem;
  }

  .top-bar__link::after {
    right: 0.7rem;
    left: 0.7rem;
  }

  .practice-menu__panel {
    right: 0;
    width: calc(100vw - 1rem);
    max-height: calc(100vh - 130px);
    padding: 1rem;
    border-radius: 10px 0 10px 10px;
  }

  .practice-menu__panel::before {
    right: 1.25rem;
  }

  .practice-group {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .practice-group__links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 440px) {
  .top-bar__index {
    display: none;
  }

  .practice-group__links {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .top-bar__link,
  .top-bar__link::after,
  .practice-menu__chevron,
  .practice-group__link {
    transition: none;
  }
}
</style>
