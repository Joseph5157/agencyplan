<template>
  <main class="min-h-screen bg-white">
    <section class="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Template One</p>
      <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ schoolName }}
      </h1>
      <p class="mt-6 max-w-2xl text-lg text-slate-600">
        Public frontend foundation is ready. Phase 3 section rendering will be implemented next.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  school: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
}>();

const schoolName = computed(() => {
  const fromSchool = props.school?.name;
  if (typeof fromSchool === "string" && fromSchool.trim()) {
    return fromSchool;
  }

  const fromSettings = props.settings?.school_name;
  if (typeof fromSettings === "string" && fromSettings.trim()) {
    return fromSettings;
  }

  return "School Website";
});
</script>
