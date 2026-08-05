<script setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import axios from 'axios'
import { useDebounceFn } from '@vueuse/core'
import {
  VisXYContainer,
  VisLine,
  VisArea,
  VisAxis,
  VisCrosshair,
  VisStackedBar,
} from '@unovis/vue'
import {
  CloudLightning,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudFog,
  Sun,
  CloudSun,
  Cloud,
  Search,
  RotateCw,
  TriangleAlert,
  MapPin,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Star,
  Plus,
  X,
  Thermometer,
  Waves,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import Sidebar from '@/components/ui/sidebar/Sidebar.vue'
import SidebarContent from '@/components/ui/sidebar/SidebarContent.vue'
import SidebarFooter from '@/components/ui/sidebar/SidebarFooter.vue'
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader.vue'
import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue'
import SidebarMenu from '@/components/ui/sidebar/SidebarMenu.vue'
import SidebarMenuItem from '@/components/ui/sidebar/SidebarMenuItem.vue'
import SidebarMenuButton from '@/components/ui/sidebar/SidebarMenuButton.vue'
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue'
import { SidebarSeparator } from '@/components/ui/sidebar/utils'
import { useWeatherFavoritesStore } from '@/stores/weatherFavorites'
import AuroraBackground from '@/components/ui/aurora-background/AuroraBackground.vue'
import SnowfallBg from '@/components/ui/snowfall-bg/SnowfallBg.vue'
import ParticlesBg from '@/components/ui/particles-bg/ParticlesBg.vue'

defineOptions({ name: 'Weather13Page' })

// ─── sidebar state (inline, no SidebarProvider component) ───
const sidebarOpen = ref(getSidebarCookie() !== 'false')
const sidebarMobile = ref(false)

function getSidebarCookie() {
  try {
    const m = document.cookie.match(/(^| )sidebar_state=([^;]+)/)
    return m ? m[2] : null
  } catch {
    return null
  }
}
function setSidebarCookie(v) {
  try {
    document.cookie = `sidebar_state=${v}; path=/; max-age=${60 * 60 * 24 * 7}`
  } catch {}
}

function checkMobile() {
  sidebarMobile.value = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  if (sidebarMobile.value) sidebarOpen.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const sidebarState = computed(() => (sidebarOpen.value ? 'expanded' : 'collapsed'))

function toggleSidebar() {
  if (sidebarMobile.value) return
  sidebarOpen.value = !sidebarOpen.value
  setSidebarCookie(String(sidebarOpen.value))
}

provide('sidebarContext', {
  state: sidebarState,
  open: sidebarOpen,
  setOpen: (v) => {
    sidebarOpen.value = v
    setSidebarCookie(String(v))
  },
  openMobile: sidebarMobile,
  setOpenMobile: (v) => {
    sidebarMobile.value = v
  },
  isMobile: sidebarMobile,
  toggleSidebar,
})

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const DEFAULT_CITIES = [
  '서울',
  '수원',
  '부산',
  '제주',
  '대전',
  '광주',
  '인천',
  '울산',
  '대구',
  '청주',
  '전주',
  '포항',
  '여수',
  '춘천',
]

const CITY_COORDS = {
  서울: { lat: 37.5665, lon: 126.978 },
  수원: { lat: 37.2636, lon: 127.0286 },
  부산: { lat: 35.1796, lon: 129.0756 },
  제주: { lat: 33.4996, lon: 126.5312 },
  대전: { lat: 36.3504, lon: 127.3845 },
  광주: { lat: 35.1595, lon: 126.8526 },
  인천: { lat: 37.4563, lon: 126.7052 },
  울산: { lat: 35.5384, lon: 129.3114 },
  대구: { lat: 35.8714, lon: 128.6014 },
  청주: { lat: 36.6424, lon: 127.489 },
  전주: { lat: 35.8242, lon: 127.148 },
  포항: { lat: 36.019, lon: 129.3434 },
  여수: { lat: 34.7604, lon: 127.6622 },
  춘천: { lat: 37.8813, lon: 127.73 },
}

const searchQuery = ref('')
const selectedCity = ref(null)
const weatherList = ref([])
const loading = ref(false)
const detailLoading = ref(false)
const error = ref(null)
const unit = ref(loadUnit())

function loadUnit() {
  try {
    return localStorage.getItem('weather13Unit') || 'celsius'
  } catch {
    return 'celsius'
  }
}
const hourlyData = ref([])
const forecastData = ref([])
const airQuality = ref(null)
const activeTab = ref('now')
const favoritesStore = useWeatherFavoritesStore()
const userCities = ref(loadUserCities())
const searchResults = ref([])
const searchLoading = ref(false)

function loadUserCities() {
  try {
    return JSON.parse(localStorage.getItem('weather13UserCities') || '[]')
  } catch {
    return []
  }
}
function saveUserCities() {
  localStorage.setItem('weather13UserCities', JSON.stringify(userCities.value))
}
function isUserCity(name) {
  return userCities.value.includes(name)
}

const WEATHER_CONDITION_MAP = {
  200: { status: 'Thunderstorm', icon: CloudLightning, color: '#B53333', variant: 'destructive' },
  300: { status: 'Drizzle', icon: CloudDrizzle, color: '#4682D5', variant: 'default' },
  500: { status: 'Rain', icon: CloudRain, color: '#4682D5', variant: 'default' },
  600: { status: 'Snow', icon: CloudSnow, color: '#4682D5', variant: 'secondary' },
  700: { status: 'Haze', icon: CloudFog, color: '#73726C', variant: 'outline' },
  800: { status: 'Clear', icon: Sun, color: '#141413', variant: 'outline' },
  801: { status: 'Partly Cloudy', icon: CloudSun, color: '#141413', variant: 'outline' },
  802: { status: 'Cloudy', icon: Cloud, color: '#141413', variant: 'outline' },
  803: { status: 'Broken Clouds', icon: Cloud, color: '#141413', variant: 'outline' },
  804: { status: 'Overcast', icon: Cloud, color: '#141413', variant: 'secondary' },
}

const AQI_LEVELS = {
  1: { label: 'Good', color: 'text-green-500', bg: 'bg-green-500' },
  2: { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500' },
  3: { label: 'Moderate', color: 'text-orange-500', bg: 'bg-orange-500' },
  4: { label: 'Poor', color: 'text-red-500', bg: 'bg-red-500' },
  5: { label: 'Very Poor', color: 'text-purple-500', bg: 'bg-purple-500' },
}

function getCondition(code) {
  const group = Math.floor(code / 100) * 100
  const condition =
    WEATHER_CONDITION_MAP[code] || WEATHER_CONDITION_MAP[group] || WEATHER_CONDITION_MAP[800]
  if (condition.color === '#141413') {
    try {
      const isDark = localStorage.getItem('theme') === 'dark'
      if (isDark) return { ...condition, color: '#E5E5E0' }
    } catch {}
  }
  return condition
}

function convertTemp(c) {
  if (c == null) return '-'
  return unit.value === 'fahrenheit' ? Math.round((c * 9) / 5 + 32) : Math.round(c)
}
function tempUnit() {
  return unit.value === 'celsius' ? '°C' : '°F'
}

function formatTime(ts) {
  if (!ts) return '--:--'
  return new Date(ts * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function windDir(deg) {
  const d = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return d[Math.round(deg / 45) % 8]
}

function convertWindSpeed(mps) {
  if (unit.value === 'fahrenheit') {
    return `${Math.round(mps * 2.237)} mph`
  }
  return `${Math.round(mps)} m/s`
}

async function fetchCoords(name) {
  if (CITY_COORDS[name]) return CITY_COORDS[name]
  const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: { q: name, limit: 1, appid: apiKey },
  })
  if (!data.length) throw new Error(`"${name}" not found`)
  return { lat: data[0].lat, lon: data[0].lon }
}

async function fetchCurrent(lat, lon) {
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: { lat, lon, units: 'metric', lang: 'kr', appid: apiKey },
  })
  return data
}

async function fetchForecast(lat, lon) {
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: { lat, lon, units: 'metric', lang: 'kr', cnt: 40, appid: apiKey },
  })
  return data
}

async function searchCities(query) {
  const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: { q: query, limit: 5, appid: apiKey },
  })
  return data.map((d) => ({
    name: d.name,
    lat: d.lat,
    lon: d.lon,
    country: d.country,
    state: d.state || '',
  }))
}

async function fetchAirQuality(lat, lon) {
  const { data } = await axios.get(
    'https://api.openweathermap.org/data/2.5/air_pollution',
    { params: { lat, lon, appid: apiKey } },
  )
  return data.list[0]
}

function mapCity(name, current, lat, lon) {
  return {
    id: `${current.dt}_${name}`,
    name,
    lat,
    lon,
    temp: current.main.temp,
    feelsLike: current.main.feels_like,
    humidity: current.main.humidity,
    pressure: current.main.pressure,
    windSpeed: current.wind.speed,
    windDeg: current.wind.deg,
    clouds: current.clouds.all,
    weatherCode: current.weather[0].id,
    description: current.weather[0].description,
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    high: null,
    low: null,
    detailLoaded: false,
  }
}

async function loadAll() {
  loading.value = true
  error.value = null
  try {
    const allCities = [...new Set([...DEFAULT_CITIES, ...userCities.value])]
    const results = await Promise.allSettled(
      allCities.map(async (name) => {
        const c = await fetchCoords(name)
        const cur = await fetchCurrent(c.lat, c.lon)
        return mapCity(name, cur, c.lat, c.lon)
      }),
    )
    weatherList.value = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function loadDetail(city) {
  if (city.detailLoaded) {
    selectedCity.value = city
    return
  }
  detailLoading.value = true
  selectedCity.value = city
  try {
    const forecast = await fetchForecast(city.lat, city.lon)
    forecastData.value = forecast.list
    hourlyData.value = forecast.list.slice(0, 8)
    try {
      airQuality.value = await fetchAirQuality(city.lat, city.lon)
    } catch {
      airQuality.value = null
    }
    const today = new Date().toISOString().slice(0, 10)
    const todayItems = forecast.list.filter((i) => i.dt_txt.startsWith(today))
    if (todayItems.length) {
      const temps = todayItems.map((i) => i.main.temp)
      city.high = Math.max(...temps)
      city.low = Math.min(...temps)
    }
    city.detailLoaded = true
  } catch (e) {
    error.value = e.message
  } finally {
    detailLoading.value = false
  }
}

function selectCity(city) {
  if (city.id === selectedCity.value?.id) resetSelection()
  else loadDetail(city)
}

async function addUserCity(city) {
  userCities.value.push(city.name)
  saveUserCities()
  searchResults.value = []
  searchQuery.value = ''
  try {
    const cur = await fetchCurrent(city.lat, city.lon)
    const newCity = mapCity(city.name, cur, city.lat, city.lon)
    weatherList.value.push(newCity)
    await loadDetail(newCity)
  } catch (e) {
    error.value = e.message
  }
}

function removeUserCity(cityName) {
  const idx = userCities.value.indexOf(cityName)
  if (idx > -1) {
    userCities.value.splice(idx, 1)
    saveUserCities()
  }
  weatherList.value = weatherList.value.filter((c) => c.name !== cityName)
  if (selectedCity.value?.name === cityName) resetSelection()
}

function resetSelection() {
  selectedCity.value = null
  hourlyData.value = []
  forecastData.value = []
  airQuality.value = null
}

const filtered = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((c) => c.name.includes(searchQuery.value.trim()))
})

const filteredAndSorted = computed(() => {
  const favorites = filtered.value.filter((c) => favoritesStore.isFavorite(c.name))
  const rest = filtered.value.filter((c) => !favoritesStore.isFavorite(c.name))
  return [...favorites, ...rest]
})

const favoriteCities = computed(() =>
  weatherList.value.filter((c) => favoritesStore.isFavorite(c.name)),
)

function toggleFavorite(city) {
  favoritesStore.toggle(city.name)
}

const debouncedSearch = useDebounceFn(async (query) => {
  searchLoading.value = true
  try {
    const results = await searchCities(query)
    const existingNames = new Set(weatherList.value.map((c) => c.name))
    searchResults.value = results.filter((r) => !existingNames.has(r.name))
  } catch {
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}, 300)

watch(searchQuery, (newVal) => {
  const q = newVal.trim()
  if (q.length < 2) {
    searchResults.value = []
    return
  }
  debouncedSearch(q)
})

watch(unit, (val) => {
  try {
    localStorage.setItem('weather13Unit', val)
  } catch {}
})

const currentPop = computed(() => Math.round((hourlyData.value[0]?.pop ?? 0) * 100))

const chartData = computed(() =>
  hourlyData.value.map((h, i) => ({
    time: h.dt,
    label: i === 0 ? 'Now' : new Date(h.dt * 1000).getHours() + ':00',
    temp: h.main.temp,
    pop: Math.round((h.pop ?? 0) * 100),
  })),
)

function crosshairTemp(d) {
  return `${d.label} — ${Math.round(d.temp)}°`
}

function crosshairPop(d) {
  return `${d.label} — ${d.pop}%`
}

const lastUpdated = computed(() => {
  if (!selectedCity.value) return ''
  return formatTime(Number(selectedCity.value.id.split('_')[0]))
})

const daylightPct = computed(() => {
  if (!selectedCity.value?.sunrise || !selectedCity.value?.sunset) return 0
  const now = Math.floor(Date.now() / 1000)
  const sr = selectedCity.value.sunrise
  const ss = selectedCity.value.sunset
  if (now <= sr) return 0
  if (now >= ss) return 100
  return Math.round(((now - sr) / (ss - sr)) * 100)
})

const daylightRemaining = computed(() => {
  if (!selectedCity.value?.sunset) return ''
  const now = Math.floor(Date.now() / 1000)
  const ss = selectedCity.value.sunset
  if (now >= ss) return ''
  const diff = ss - now
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  return `${h}h ${m}m left`
})

const windChill = computed(() => {
  const t = selectedCity.value?.temp
  const w = selectedCity.value?.windSpeed
  if (t == null || w == null || t > 10 || w < 1.34) return null
  const v = Math.pow(w * 3.6, 0.16)
  return Math.round(13.12 + 0.6215 * t - 11.37 * v + 0.3965 * t * v)
})

const heatIndex = computed(() => {
  const t = selectedCity.value?.temp
  const h = selectedCity.value?.humidity
  if (t == null || h == null || t < 27 || h < 40) return null
  const tf = (t * 9) / 5 + 32
  const r = h
  const hi =
    -42.379 +
    2.04901523 * tf +
    10.14333127 * r -
    0.22475541 * tf * r -
    0.00683783 * tf ** 2 -
    0.05481717 * r ** 2 +
    0.00122874 * tf ** 2 * r +
    0.00085282 * tf * r ** 2 -
    0.00000199 * tf ** 2 * r ** 2
  return Math.round(((hi - 32) * 5) / 9)
})

const statusInfo = computed(() => {
  if (loading.value)
    return { icon: RotateCw, text: 'Loading…', sub: 'Fetching weather data', spin: true }
  if (error.value) return { icon: TriangleAlert, text: 'Error', sub: error.value }
  if (!weatherList.value.length) return null
  if (!filtered.value.length)
    return { icon: MapPin, text: 'No cities found', sub: 'Try a different search' }
  return null
})

const dailyForecast = computed(() => {
  if (!forecastData.value.length) return []
  const map = {}
  forecastData.value.forEach((h) => {
    const date = new Date(h.dt * 1000).toLocaleDateString('ko-KR', {
      weekday: 'long',
      month: 'numeric',
      day: 'numeric',
    })
    if (!map[date]) map[date] = { temps: [], icons: [] }
    map[date].temps.push(h.main.temp)
    map[date].icons.push(h.weather[0].id)
  })
  if (Object.keys(map).length <= 1) return []
  const dayEntries = Object.entries(map).slice(0, 5)
  const allTemps = dayEntries.flatMap(([, d]) => d.temps)
  const globalMin = Math.min(...allTemps)
  const globalMax = Math.max(...allTemps)
  const globalRange = globalMax - globalMin || 1
  return dayEntries.map(([date, data]) => {
    const high = Math.max(...data.temps)
    const low = Math.min(...data.temps)
    return {
      date,
      high,
      low,
      code: data.icons[Math.floor(data.icons.length / 2)],
      barLeft: ((low - globalMin) / globalRange) * 100,
      barWidth: ((high - low) / globalRange) * 100,
    }
  })
})

onMounted(loadAll)

const weatherStatus = computed(() => {
  if (!selectedCity.value) return '맑음'
  const code = selectedCity.value.weatherCode
  if (code === 800 || code === 801) return '맑음'
  const group = Math.floor(code / 100)
  if (group === 2 || group === 3 || group === 5) return '비'
  return '구름'
})

const showSnow = computed(() => {
  if (!selectedCity.value) return false
  return Math.floor(selectedCity.value.weatherCode / 100) === 6
})

const showRain = computed(() => {
  if (!selectedCity.value) return false
  const g = Math.floor(selectedCity.value.weatherCode / 100)
  return g === 2 || g === 3 || g === 5
})
</script>

<template>
  <AuroraBackground
    :status="weatherStatus"
    :radial-gradient="false"
    class="!h-[100dvh] !justify-start !items-stretch"
  >
    <SnowfallBg
      v-if="showSnow"
      :color="'#ccddff'"
      :quantity="80"
      :speed="0.8"
      :max-radius="2.5"
      class="absolute inset-0 z-0"
    />
    <ParticlesBg
      v-if="showRain"
      :color="'#88aadd'"
      :quantity="150"
      :staticity="70"
      class="absolute inset-0 z-0"
    />
    <div
    class="flex h-[100dvh] items-stretch overflow-hidden bg-transparent text-foreground"
    style="
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    "
  >
    <Sidebar collapsible="icon">
      <SidebarHeader class="gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton class="cursor-pointer" @click="resetSelection">
              <CloudSun :size="16" class="text-primary" />
              <span v-if="sidebarState === 'expanded'">Weather</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div v-if="sidebarState === 'expanded'" class="relative px-1">
          <Search
            :size="14"
            class="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
          />
          <Input v-model="searchQuery" placeholder="Search city…" class="h-8 pl-8 text-xs" />
          <div
            v-if="searchResults.length || searchLoading"
            class="absolute left-1 right-1 top-full z-50 mt-1 rounded-md border bg-popover shadow-md"
          >
            <div v-if="searchLoading" class="px-3 py-2 text-xs text-muted-foreground">
              Searching…
            </div>
            <div v-else class="max-h-48 overflow-y-auto">
              <button
                v-for="city in searchResults"
                :key="city.lat + '_' + city.lon"
                class="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-xs hover:bg-accent"
                @click="addUserCity(city)"
              >
                <MapPin :size="12" class="shrink-0 text-muted-foreground" />
                <span class="font-medium">{{ city.name }}</span>
                <span v-if="city.state" class="text-muted-foreground">{{ city.state }},</span>
                <span class="text-muted-foreground">{{ city.country }}</span>
                <Plus :size="12" class="ml-auto shrink-0 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <div v-if="statusInfo" class="flex flex-col items-center gap-2 py-16 text-center">
          <component
            :is="statusInfo.icon"
            :size="32"
            :class="statusInfo.spin ? 'animate-spin text-primary' : 'text-muted-foreground'"
          />
          <p class="text-sm font-semibold">{{ statusInfo.text }}</p>
          <p class="text-xs text-muted-foreground">{{ statusInfo.sub }}</p>
        </div>
        <SidebarMenu v-else>
          <SidebarMenuItem v-for="city in filteredAndSorted" :key="city.id">
            <SidebarMenuButton :isActive="selectedCity?.id === city.id" @click="selectCity(city)">
              <component
                :is="getCondition(city.weatherCode).icon"
                :size="16"
                :style="{ color: getCondition(city.weatherCode).color }"
              />
              <span v-if="sidebarState === 'expanded'">{{ city.name }}</span>
              <span v-if="sidebarState === 'expanded'" class="ml-auto tabular-nums text-xs text-muted-foreground"
                >{{ convertTemp(city.temp) }}{{ tempUnit() }}</span
              >
              <Star
                v-if="sidebarState === 'expanded'"
                :size="13"
                :fill="favoritesStore.isFavorite(city.name) ? 'currentColor' : 'none'"
                class="shrink-0 text-yellow-500"
                @click.stop="toggleFavorite(city)"
              />
              <X
                v-if="isUserCity(city.name) && sidebarState === 'expanded'"
                :size="12"
                class="shrink-0 text-muted-foreground hover:text-destructive"
                @click.stop="removeUserCity(city.name)"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <Select v-if="sidebarState === 'expanded'" v-model="unit">
          <SelectTrigger class="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="celsius">°C</SelectItem>
            <SelectItem value="fahrenheit">°F</SelectItem>
          </SelectContent>
        </Select>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <main class="flex flex-1 flex-col items-stretch overflow-hidden">
        <div v-if="!selectedCity" class="flex flex-1 flex-col items-center justify-center gap-4">
          <template v-if="favoriteCities.length">
            <p class="text-sm font-semibold text-muted-foreground">Favorites</p>
            <div class="grid w-full max-w-md grid-cols-2 gap-3 px-6">
              <Card
                v-for="city in favoriteCities"
                :key="city.id"
                class="cursor-pointer transition-colors hover:bg-accent/50"
                @click="loadDetail(city)"
              >
                <CardContent class="flex items-center gap-3 p-4">
                  <component
                    :is="getCondition(city.weatherCode).icon"
                    :size="28"
                    :style="{ color: getCondition(city.weatherCode).color }"
                  />
                  <div>
                    <p class="text-sm font-semibold">{{ city.name }}</p>
                    <p class="tabular-nums text-lg font-medium">
                      {{ convertTemp(city.temp) }}{{ tempUnit() }}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </template>
          <template v-else>
            <CloudSun :size="64" class="text-muted-foreground/30" />
            <p class="text-lg font-medium">Select a city to view weather</p>
            <p class="text-sm text-muted-foreground">{{ weatherList.length }} cities · real-time OpenWeather data</p>
          </template>
        </div>

        <template v-else>
          <div class="flex items-center justify-between border-b border-border bg-card px-8 py-4">
            <div class="flex items-center gap-2">
              <SidebarTrigger />
              <span class="text-sm font-semibold">{{ selectedCity.name }}</span>
              <Badge :variant="getCondition(selectedCity.weatherCode).variant">
                <component
                  :is="getCondition(selectedCity.weatherCode).icon"
                  :size="12"
                  class="mr-1"
                  :style="{ color: getCondition(selectedCity.weatherCode).color }"
                />
                {{ selectedCity.description }}
              </Badge>
            </div>
            <span class="ml-auto mr-3 text-xs tabular-nums text-muted-foreground">
              Updated {{ lastUpdated }}
            </span>
            <Button variant="ghost" size="icon" :disabled="loading" @click="loadAll()">
              <RotateCw :size="16" :class="{ 'animate-spin': loading }" />
            </Button>
          </div>

          <ScrollArea v-if="detailLoading" class="flex-1">
            <div class="flex flex-col gap-6 px-10 py-8">
              <Card
                ><CardContent class="flex flex-col items-center gap-3 pt-10">
                  <Skeleton class="h-12 w-12 rounded-full" /><Skeleton class="h-24 w-48" /><Skeleton
                    class="h-4 w-32"
                  />
                  <div class="mt-4 grid w-full max-w-md grid-cols-4 gap-3">
                    <Skeleton v-for="i in 4" :key="i" class="h-20 rounded-xl" />
                  </div> </CardContent
              ></Card>
            </div>
          </ScrollArea>

          <ScrollArea v-else class="flex-1">
            <div class="flex flex-col gap-6 px-10 py-8">
              <Tabs v-model="activeTab">
                <TabsList class="mb-4 grid w-full grid-cols-4">
                  <TabsTrigger value="now">Now</TabsTrigger>
                  <TabsTrigger value="hourly">Hourly</TabsTrigger>
                   <TabsTrigger value="forecast">5-Day</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="now">
                  <Card
                    ><CardContent class="flex flex-col items-center gap-2 pt-10">
                      <component
                        :is="getCondition(selectedCity.weatherCode).icon"
                        :size="48"
                        :style="{ color: getCondition(selectedCity.weatherCode).color }"
                      />
                      <div class="flex items-baseline gap-1 tabular-nums">
                        <span class="text-[96px] leading-[1.4] font-medium tracking-[-0.02em]">{{
                          convertTemp(selectedCity.temp)
                        }}</span>
                        <span class="text-xl font-medium text-muted-foreground">{{
                          tempUnit()
                        }}</span>
                      </div>
                      <p class="text-sm text-muted-foreground">
                        Feels like {{ convertTemp(selectedCity.feelsLike) }}{{ tempUnit() }}
                      </p>
                      <p class="text-sm capitalize">{{ selectedCity.description }}</p>
                      <div class="mt-4 grid w-full max-w-lg grid-cols-5 gap-3">
                        <div
                          v-for="stat in [
                            {
                              label: 'Humidity',
                              value: selectedCity.humidity + '%',
                              icon: Droplets,
                            },
                            {
                              label: 'Wind',
                              value:
                                windDir(selectedCity.windDeg) +
                                ' ' +
                                convertWindSpeed(selectedCity.windSpeed),
                              icon: Wind,
                            },
                            { label: 'Clouds', value: selectedCity.clouds + '%', icon: Cloud },
                            {
                              label: 'Pressure',
                              value: selectedCity.pressure + 'hPa',
                              icon: Gauge,
                            },
                            {
                              label: 'Precip.',
                              value: currentPop + '%',
                              icon: CloudRain,
                            },
                          ]"
                          :key="stat.label"
                          class="flex flex-col items-center gap-1 rounded-xl bg-muted p-3"
                        >
                          <component :is="stat.icon" :size="16" class="text-primary" />
                          <span class="tabular-nums text-xs font-semibold leading-[16.8px]">{{
                            stat.value
                          }}</span>
                          <span class="text-xs text-muted-foreground">{{ stat.label }}</span>
                        </div>
                      </div>
                    </CardContent></Card
                  >
                </TabsContent>

                <TabsContent value="hourly">
                  <Card v-if="hourlyData.length"
                    ><CardHeader><CardTitle class="text-sm">Hourly Forecast</CardTitle></CardHeader>
                    <CardContent
                      class="flex gap-4 overflow-x-auto pb-2"
                      style="scrollbar-width: none"
                    >
                      <div
                        v-for="(hour, i) in hourlyData"
                        :key="i"
                        class="flex shrink-0 flex-col items-center gap-2 rounded-xl px-4 py-3"
                        :class="i === 0 ? 'bg-primary/10' : ''"
                        style="min-width: 72px"
                      >
                        <span
                          class="text-xs font-semibold leading-[16.8px]"
                          :class="i === 0 ? 'text-primary' : 'text-muted-foreground'"
                          >{{
                            i === 0
                              ? 'Now'
                              : new Date(hour.dt * 1000).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                })
                          }}</span
                        >
                        <component
                          :is="getCondition(hour.weather[0].id).icon"
                          :size="20"
                          :style="{ color: getCondition(hour.weather[0].id).color }"
                        />
                        <span class="tabular-nums text-sm font-semibold"
                          >{{ convertTemp(hour.main.temp) }}{{ tempUnit() }}</span
                        >
                        <span
                          v-if="hour.pop && hour.pop > 0"
                          class="text-[11px] text-blue-400"
                          >{{ Math.round(hour.pop * 100) }}%</span
                        >
                      </div>
                    </CardContent>
                  </Card>
                  <Card v-if="hourlyData.length" class="mt-4">
                    <CardHeader class="pb-2"><CardTitle class="text-sm">Temperature Trend</CardTitle></CardHeader>
                    <CardContent>
                      <VisXYContainer
                        :data="chartData"
                        :height="160"
                        :margin="{ left: 40, bottom: 24, right: 8, top: 4 }"
                      >
                        <VisArea
                          :x="(d) => d.label"
                          :y="(d) => d.temp"
                          color="var(--chart-2)"
                          :opacity="0.12"
                        />
                        <VisLine
                          :x="(d) => d.label"
                          :y="(d) => d.temp"
                          color="var(--chart-2)"
                        />
                        <VisAxis type="x" />
                        <VisAxis
                          type="y"
                          :tick-format="(v) => convertTemp(v) + tempUnit()"
                        />
                        <VisCrosshair :template="crosshairTemp" />
                      </VisXYContainer>
                    </CardContent>
                  </Card>
                  <Card v-if="hourlyData.length" class="mt-4">
                    <CardHeader class="pb-2"><CardTitle class="text-sm">Precipitation</CardTitle></CardHeader>
                    <CardContent>
                      <VisXYContainer
                        :data="chartData"
                        :height="100"
                        :margin="{ left: 40, bottom: 24, right: 8, top: 4 }"
                      >
                        <VisStackedBar
                          :x="(d) => d.label"
                          :y="[(d) => d.pop]"
                          color="var(--chart-4)"
                          :rounded-corners="4"
                          :bar-padding="0.4"
                        />
                        <VisAxis type="x" />
                        <VisAxis type="y" :tick-format="(v) => v + '%'" />
                        <VisCrosshair :template="crosshairPop" />
                      </VisXYContainer>
                    </CardContent>
                  </Card>
                  <p v-else class="text-center text-sm text-muted-foreground mt-10">
                    Select a city to load hourly forecast
                  </p>
                </TabsContent>

                <TabsContent value="forecast">
                  <Card v-if="dailyForecast.length"
                    ><CardHeader><CardTitle class="text-sm">5-Day Forecast</CardTitle></CardHeader>
                    <CardContent class="flex flex-col gap-2">
                      <div
                        v-for="(day, i) in dailyForecast"
                        :key="day.date"
                        class="flex items-center gap-3 rounded-xl px-4 py-3"
                        :class="i === 0 ? 'bg-primary/10' : ''"
                      >
                        <span class="flex-1 text-sm font-semibold">{{ day.date }}</span>
                        <component
                          :is="getCondition(day.code).icon"
                          :size="20"
                          :style="{ color: getCondition(day.code).color }"
                        />
                        <span class="tabular-nums text-sm text-muted-foreground"
                          >{{ convertTemp(day.low) }}{{ tempUnit() }}</span
                        >
                        <div class="relative h-1.5 w-16 rounded-full bg-border">
                          <div
                            class="absolute h-full rounded-full bg-primary"
                            :style="{
                              left: day.barLeft + '%',
                              width: day.barWidth + '%',
                            }"
                          />
                        </div>
                        <span class="tabular-nums text-sm font-semibold"
                          >{{ convertTemp(day.high) }}{{ tempUnit() }}</span
                        >
                      </div>
                    </CardContent>
                  </Card>
                  <p v-else class="text-center text-sm text-muted-foreground mt-10">
                    Select a city to load 5-day forecast
                  </p>
                </TabsContent>

                <TabsContent value="details">
                  <div class="grid grid-cols-2 gap-3">
                    <Card
                      ><CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                        <Sunrise :size="24" class="text-amber-500" />
                        <div>
                          <p class="text-xs text-muted-foreground">Sunrise</p>
                          <p class="tabular-nums text-sm font-semibold">
                            {{ formatTime(selectedCity.sunrise) }}
                          </p>
                        </div>
                      </CardContent></Card
                    >
                    <Card
                      ><CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                        <Sunset :size="24" class="text-orange-500" />
                        <div>
                          <p class="text-xs text-muted-foreground">Sunset</p>
                          <p class="tabular-nums text-sm font-semibold">
                            {{ formatTime(selectedCity.sunset) }}
                          </p>
                        </div>
                      </CardContent></Card
                    >
                    <template v-if="selectedCity.detailLoaded">
                      <Card
                        ><CardContent class="flex flex-col items-center gap-2 pt-5 text-center"
                          ><ArrowUp :size="24" class="text-red-500" />
                          <div>
                            <p class="text-xs text-muted-foreground">High</p>
                            <p class="tabular-nums text-sm font-semibold">
                              {{ convertTemp(selectedCity.high) }}{{ tempUnit() }}
                            </p>
                          </div></CardContent
                        ></Card
                      >
                        <Card
                        ><CardContent class="flex flex-col items-center gap-2 pt-5 text-center"
                          ><ArrowDown :size="24" class="text-primary" />
                          <div>
                            <p class="text-xs text-muted-foreground">Low</p>
                            <p class="tabular-nums text-sm font-semibold">
                              {{ convertTemp(selectedCity.low) }}{{ tempUnit() }}
                            </p>
                          </div></CardContent
                        ></Card
                      >
                      <Card v-if="windChill !== null">
                        <CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                          <Wind :size="24" class="text-blue-400" />
                          <div>
                            <p class="text-xs text-muted-foreground">Wind Chill</p>
                            <p class="tabular-nums text-sm font-semibold">
                              {{ convertTemp(windChill) }}{{ tempUnit() }}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card v-if="heatIndex !== null">
                        <CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                          <Thermometer :size="24" class="text-orange-500" />
                          <div>
                            <p class="text-xs text-muted-foreground">Heat Index</p>
                            <p class="tabular-nums text-sm font-semibold">
                              {{ convertTemp(heatIndex) }}{{ tempUnit() }}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card class="col-span-2">
                        <CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                          <Sun :size="24" class="text-yellow-500" />
                          <div class="w-full max-w-[220px]">
                            <div
                              class="mb-1 flex justify-between text-xs tabular-nums text-muted-foreground"
                            >
                              <span>{{ formatTime(selectedCity.sunrise) }}</span>
                              <span>{{ formatTime(selectedCity.sunset) }}</span>
                            </div>
                            <div class="h-2 w-full rounded-full bg-border">
                              <div
                                class="h-full rounded-full bg-yellow-500 transition-all"
                                :style="{ width: daylightPct + '%' }"
                              />
                            </div>
                            <p
                              v-if="daylightRemaining"
                              class="mt-1 text-xs tabular-nums text-muted-foreground"
                            >
                              {{ daylightRemaining }}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card v-if="airQuality" class="col-span-2">
                        <CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                          <Waves :size="24" :class="AQI_LEVELS[airQuality.main.aqi].color" />
                          <div>
                            <p class="text-xs text-muted-foreground">Air Quality</p>
                            <p
                              class="text-sm font-semibold"
                              :class="AQI_LEVELS[airQuality.main.aqi].color"
                            >
                              {{ AQI_LEVELS[airQuality.main.aqi].label }}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card v-if="airQuality">
                        <CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                          <div>
                            <p class="text-xs text-muted-foreground">PM2.5</p>
                            <p class="tabular-nums text-sm font-semibold">
                              {{ airQuality.components.pm2_5 }} μg/m³
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card v-if="airQuality">
                        <CardContent class="flex flex-col items-center gap-2 pt-5 text-center">
                          <div>
                            <p class="text-xs text-muted-foreground">PM10</p>
                            <p class="tabular-nums text-sm font-semibold">
                              {{ airQuality.components.pm10 }} μg/m³
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </template>
                    <Card v-else class="col-span-2"
                      ><CardContent class="flex flex-col items-center gap-3 pt-10"
                        ><Skeleton class="h-6 w-24 rounded-full" /><Skeleton
                          class="h-4 w-32" /></CardContent
                    ></Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </template>
      </main>
    </SidebarInset>
  </div>
  </AuroraBackground>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
