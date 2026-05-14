<script setup lang="ts">
const model = defineModel<File | null>({ default: null });

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  model.value = input.files?.[0] ?? null;
};
</script>

<template>
  <div class="space-y-2">
    <input
      type="file"
      accept="image/*"
      class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      @change="onChange"
    />
    <p class="text-xs text-slate-500">Placeholder uploader for upcoming section forms.</p>
  </div>
</template>

