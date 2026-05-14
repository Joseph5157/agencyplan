<template>
  <div>
    <div v-if="loading" class="flex min-h-screen items-center justify-center bg-slate-50">
      <p class="text-sm font-medium text-slate-500">Loading school data...</p>
    </div>

    <div v-else-if="error" class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div class="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 class="text-lg font-semibold text-red-800">Unable to load homepage</h2>
        <p class="mt-2 text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <component
      :is="resolvedTemplate"
      v-else
      :school="school"
      :settings="settings"
    />
  </div>
</template>

<script setup lang="ts">
import { resolveHomepageTemplate } from "~/composables/useTemplate";

const { school, settings, template, loading, error, fetchSchoolData } = useSchoolData();

await fetchSchoolData();

const resolvedTemplate = computed(() => resolveHomepageTemplate(template.value));
</script>
