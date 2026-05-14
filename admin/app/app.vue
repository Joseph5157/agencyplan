<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const { token, loadToken, clearToken } = useAuthToken();

const schoolName = ref("School");
const adminEmail = ref("Admin");

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
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

const isLoginPage = computed(() => route.path === "/login");

const isActiveLink = (to: string) => {
  if (to === "/dashboard") return route.path === "/dashboard";
  return route.path === to || route.path.startsWith(`${to}/`);
};

const loadHeaderContext = async () => {
  if (!import.meta.client) return;
  loadToken();
  if (!token.value || isLoginPage.value) return;

  try {
    const [schoolRes, meRes] = await Promise.all([
      $fetch<{ name?: string }>(`${config.public.apiBase}/school`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token.value}` },
      }),
      $fetch<{ email?: string }>(`${config.public.apiBase}/admin/me`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token.value}` },
      }),
    ]);
    schoolName.value = schoolRes?.name || "School";
    adminEmail.value = meRes?.email || "Admin";
  } catch {
    schoolName.value = "School";
    adminEmail.value = "Admin";
  }
};

const logout = async () => {
  clearToken();
  await navigateTo("/login");
};

onMounted(loadHeaderContext);
watch(() => route.path, loadHeaderContext);
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <template v-if="isLoginPage">
      <main class="mx-auto max-w-6xl px-4 py-10">
        <NuxtPage />
      </main>
    </template>

    <template v-else>
      <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 class="text-xl font-semibold tracking-tight">School Platform Admin</h1>
            <p class="text-xs text-slate-500">{{ schoolName }} · {{ adminEmail }}</p>
          </div>
          <button
            type="button"
            class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </header>

      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Navigation</p>
          <nav class="space-y-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block rounded-md px-3 py-2 text-sm font-medium transition"
              :class="isActiveLink(link.to) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </aside>

        <main class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <NuxtPage />
        </main>
      </div>
    </template>
  </div>
</template>
