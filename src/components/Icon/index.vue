<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <Component :is="icon" />
</template>

<style scoped>

</style>
