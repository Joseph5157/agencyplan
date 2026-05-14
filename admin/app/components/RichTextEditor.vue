<script setup lang="ts">
const model = defineModel<string>({ default: "" });
</script>

<template>
  <div class="space-y-2">
    <textarea
      v-model="model"
      rows="6"
      class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      placeholder="Rich text editor placeholder"
    />
    <p class="text-xs text-slate-500">
      Placeholder component. Replace with a constrained rich-text editor in later tasks.
    </p>
  </div>
</template>

