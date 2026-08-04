import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherFavoritesStore = defineStore('weatherFavorites', () => {
  // ─── state ───────────────────────────────────────────────
  const favorites = ref(load())

  // ─── getters ─────────────────────────────────────────────
  const favoriteCount = computed(() => favorites.value.length)

  function isFavorite(cityId) {
    return favorites.value.includes(cityId)
  }

  // ─── actions ─────────────────────────────────────────────
  function toggle(cityId) {
    const idx = favorites.value.indexOf(cityId)
    if (idx > -1) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(cityId)
    }
    save(favorites.value)
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem('weatherFavorites') || '[]')
    } catch {
      return []
    }
  }

  function save(data) {
    localStorage.setItem('weatherFavorites', JSON.stringify(data))
  }

  return { favorites, favoriteCount, isFavorite, toggle }
})
