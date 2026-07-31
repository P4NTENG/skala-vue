<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'AppTopBar',
})

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Sample One', to: '/practices/basic/SampleOne' },
  { label: 'Sample Two', to: '/practices/basic/SampleTwo' },
]
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
          <span class="top-bar__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          {{ item.label }}
        </RouterLink>
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
  overflow-x: auto;
  scrollbar-width: none;
}

.top-bar__nav::-webkit-scrollbar {
  display: none;
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

.top-bar__link.router-link-exact-active {
  color: #ffffff;
  background: rgba(66, 184, 131, 0.1);
}

.top-bar__link.router-link-exact-active::after {
  transform: scaleX(1);
}

.top-bar__index {
  color: #6f9185;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.brand:focus-visible,
.top-bar__link:focus-visible {
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
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .top-bar__link {
    padding: 0 0.9rem;
    font-size: 0.8rem;
  }

  .top-bar__link::after {
    right: 0.9rem;
    left: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .top-bar__link,
  .top-bar__link::after {
    transition: none;
  }
}
</style>
