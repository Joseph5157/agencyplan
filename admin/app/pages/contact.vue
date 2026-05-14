<script setup lang="ts">
type ContactForm = {
  address: string;
  phone: string;
  email: string;
  maps_url: string;
  whatsapp: string;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const saving = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const form = reactive<ContactForm>({
  address: "",
  phone: "",
  email: "",
  maps_url: "",
  whatsapp: "",
});

const authHeaders = computed<Record<string, string>>(() => ({
  Accept: "application/json",
  Authorization: `Bearer ${token.value}`,
}));

const resetMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const validateForm = () => {
  if (!form.address.trim()) return "Address is required.";
  if (!form.phone.trim()) return "Phone is required.";
  if (!form.email.trim()) return "Email is required.";
  return "";
};

const loadContact = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<Partial<ContactForm> | null>(`${config.public.apiBase}/school/contact`, {
      headers: authHeaders.value,
    });

    form.address = data?.address ?? "";
    form.phone = data?.phone ?? "";
    form.email = data?.email ?? "";
    form.maps_url = data?.maps_url ?? "";
    form.whatsapp = data?.whatsapp ?? "";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load contact data.";
  } finally {
    loading.value = false;
  }
};

const saveContact = async () => {
  const validationError = validateForm();
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  saving.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/contact`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        address: form.address,
        phone: form.phone,
        email: form.email,
        maps_url: form.maps_url || null,
        whatsapp: form.whatsapp || null,
      },
    });
    successMessage.value = "Contact information saved.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to save contact data.";
  } finally {
    saving.value = false;
  }
};

if (import.meta.client) {
  loadToken();
  if (!token.value) {
    await navigateTo("/login");
  }
}

onMounted(async () => {
  if (!token.value) return;
  await loadContact();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Contact Editor</h2>
      <p class="text-sm text-slate-600">Update school contact information.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid gap-4 md:grid-cols-2" @submit.prevent="saveContact">
      <div class="md:col-span-2">
        <label class="mb-1 block text-sm font-medium text-slate-700">Address *</label>
        <textarea
          v-model="form.address"
          required
          rows="3"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="School address"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
        <input
          v-model="form.phone"
          required
          type="text"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="+91..."
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Email *</label>
        <input
          v-model="form.email"
          required
          type="email"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="contact@school.com"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Google Maps URL</label>
        <input
          v-model="form.maps_url"
          type="url"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
        <input
          v-model="form.whatsapp"
          type="text"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          placeholder="+91..."
        />
      </div>

      <div class="md:col-span-2">
        <button
          type="submit"
          :disabled="loading || saving"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {{ saving ? "Saving..." : "Save Contact Info" }}
        </button>
      </div>
    </form>
  </section>
</template>
