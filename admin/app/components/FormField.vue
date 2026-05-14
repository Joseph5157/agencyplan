<script setup lang="ts">
defineProps<{
  label: string;
  forId?: string;
  hint?: string;
}>();
</script>

<template>
  <div class="space-y-1">
    <label v-if="forId" :for="forId" class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <label v-else class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <slot />
    <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>

