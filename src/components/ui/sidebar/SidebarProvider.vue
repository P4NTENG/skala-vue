<script setup>
import { provide, ref, computed, onMounted, onUnmounted } from 'vue'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  } catch {
    return null
  }
}

function setCookie(name, value) {
  try {
    document.cookie = `${name}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  } catch {
    /* noop */
  }
}

const open = ref(getCookie(SIDEBAR_COOKIE_NAME) !== 'false')
const openMobile = ref(false)

const state = computed(() => (open.value ? 'expanded' : 'collapsed'))

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = typeof window !== 'undefined' ? window.innerWidth < 768 : false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function setOpen(value) {
  open.value = value
  setCookie(SIDEBAR_COOKIE_NAME, String(value))
}

function toggleSidebar() {
  if (isMobile.value) {
    openMobile.value = !openMobile.value
  } else {
    setOpen(!open.value)
  }
}

provide('sidebarContext', {
  state,
  open,
  setOpen,
  openMobile,
  setOpenMobile: (v) => {
    openMobile.value = v
  },
  isMobile,
  toggleSidebar,
})
</script>

<template>
  <slot />
</template>
