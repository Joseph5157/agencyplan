<script setup lang="ts">
const config = useRuntimeConfig();
const router = useRouter();
const { token, loadToken, setToken } = useAuthToken();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const submitLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await $fetch<{
      access_token: string;
      token_type: string;
      expires_in: number;
    }>(`${config.public.apiBase}/admin/login`, {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (!response?.access_token) {
      errorMessage.value = "Login failed. Please try again.";
      return;
    }

    setToken(response.access_token);
    await router.push("/dashboard");
  } catch (error: any) {
    if (error?.data?.errors?.email?.[0]) {
      errorMessage.value = error.data.errors.email[0];
    } else if (error?.data?.message) {
      errorMessage.value = error.data.message;
    } else {
      errorMessage.value = "Unable to login. Check your credentials and try again.";
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loadToken();
  if (token.value) {
    await router.replace("/dashboard");
  }
});
</script>

<template>
  <section class="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-5 text-xl font-semibold text-slate-900">Admin Login</h2>

    <form class="space-y-4" @submit.prevent="submitLogin">
      <FormField label="Email" for-id="email">
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="admin@school.com"
        />
      </FormField>

      <FormField label="Password" for-id="password">
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="Enter password"
        />
      </FormField>

      <p v-if="errorMessage" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {{ loading ? "Signing in..." : "Login" }}
      </button>
    </form>
  </section>
</template>
