<script setup lang="ts">
const router = useRouter();
const { token, loadToken } = useAuthToken();

onMounted(async () => {
  loadToken();
  await router.replace(token.value ? "/dashboard" : "/login");
});
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
    Redirecting...
  </section>
</template>
