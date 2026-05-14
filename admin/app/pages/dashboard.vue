<script setup lang="ts">
const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const welcomeName = ref("School Admin");
const schoolName = ref("School");
const schoolId = ref<string | number>("--");
const totalFaculty = ref(0);
const totalGalleryImages = ref(0);
const activeNotices = ref(0);
const errorMessage = ref("");

const quickLinks = [
  { label: "Hero", to: "/hero" },
  { label: "About", to: "/about" },
  { label: "Stats", to: "/stats" },
  { label: "Facilities", to: "/facilities" },
  { label: "Faculty", to: "/faculty" },
  { label: "Gallery", to: "/gallery" },
  { label: "Notices", to: "/notices" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact", to: "/contact" },
  { label: "Settings", to: "/settings" },
];

const authHeaders = computed<Record<string, string>>(() => {
  if (!token.value) return { Accept: "application/json" };
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token.value}`,
  };
});

const fetchCollectionCount = async (path: string) => {
  const result = await $fetch<unknown>(`${config.public.apiBase}${path}`, {
    headers: authHeaders.value,
  });

  return Array.isArray(result) ? result.length : 0;
};

if (import.meta.client) {
  loadToken();
  if (!token.value) {
    await navigateTo("/login");
  }
}

onMounted(async () => {
  if (!token.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const [me, school, facultyCount, galleryCount, noticeCount] = await Promise.all([
      $fetch<{ email: string; school_id: number | string }>(`${config.public.apiBase}/admin/me`, {
        headers: authHeaders.value,
      }),
      $fetch<{ name?: string }>(`${config.public.apiBase}/school`, {
        headers: authHeaders.value,
      }),
      fetchCollectionCount("/school/faculty"),
      fetchCollectionCount("/school/gallery"),
      fetchCollectionCount("/school/notices"),
    ]);

    welcomeName.value = me?.email || "School Admin";
    schoolName.value = school?.name || "School";
    schoolId.value = me?.school_id ?? "--";
    totalFaculty.value = facultyCount;
    totalGalleryImages.value = galleryCount;
    activeNotices.value = noticeCount;
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Unable to load dashboard data. Check API base/domain mapping and try again.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-semibold tracking-tight">Welcome, {{ welcomeName }}</h2>
      <p class="text-sm text-slate-600">{{ schoolName }} · School ID: {{ schoolId }}</p>
    </div>

    <p v-if="errorMessage" class="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {{ errorMessage }}
    </p>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Faculty</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ loading ? "..." : totalFaculty }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Gallery Images</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ loading ? "..." : totalGalleryImages }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Active Notices</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ loading ? "..." : activeNotices }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</h3>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
