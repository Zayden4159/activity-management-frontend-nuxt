<script setup lang="ts">
const route = useRoute()

const routeNames: Record<string, string> = {
  '': 'กิจกรรมโค้ดปศินา',
  'reward': 'ประกาศรางวัล',
  'codehunt': 'โค้ดปศินา',
}

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const crumbs = [{ label: 'หน้าหลัก', path: '/' }]

  segments.forEach((seg, i) => {
    crumbs.push({
      label: routeNames[seg] ?? seg,
      path: '/' + segments.slice(0, i + 1).join('/')
    })
  })

  return crumbs
})
</script>

<template>
  <div class="dashboard">

    <header class="dashboard__header flex items-center px-6 border-b border-gray-100 bg-white">
      <nav class="flex items-center gap-1 text-sm">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
          <!-- Separator -->
          <svg v-if="index > 0" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <!-- Last item -->
          <span v-if="index === breadcrumbs.length - 1" class="text-violet-600 font-medium">
            {{ crumb.label }}
          </span>
          <!-- Link -->
          <nuxt-link v-else :to="crumb.path" class="text-gray-400 hover:text-gray-600 transition-colors">
            {{ crumb.label }}
          </nuxt-link>
        </template>
      </nav>
    </header>

    <aside class="dashboard__aside">
      <Appaside />
    </aside>

    <main class="dashboard__main">
      <slot />
    </main>

  </div>
</template>