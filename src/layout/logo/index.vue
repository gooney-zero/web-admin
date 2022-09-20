<script setup lang="ts">
const title = import.meta.env.VITE_TITLE
</script>

<template>
  <router-link class="flex justify-center items-center" to="/">
    <NAvatar
      round
    />
    <!-- src="https://s1.ax1x.com/2020/05/18/YfWf7n.png" -->

    <h2 class="ml-2 font-bold text-black  flex-shrink-0">
      {{ title }}
    </h2>
  </router-link>
</template>

<style scoped>

</style>
