<script setup lang="ts">
type SchoolInfo = {
  id: number;
  name: string;
  domain: string;
  template: string;
  is_active: boolean;
};

type SettingsForm = {
  logo_path: string;
  favicon_path: string;
  tagline: string;
  meta_title: string;
  meta_description: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  copyright_text: string;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const saving = ref(false);
const uploadingLogo = ref(false);
const uploadingFavicon = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const school = ref<SchoolInfo | null>(null);
const logoFile = ref<File | null>(null);
const faviconFile = ref<File | null>(null);

const form = reactive<SettingsForm>({
  logo_path: "",
  favicon_path: "",
  tagline: "",
  meta_title: "",
  meta_description: "",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  copyright_text: "",
});

const authHeaders = computed<Record<string, string>>(() => ({
  Accept: "application/json",
  Authorization: `Bearer ${token.value}`,
}));
const apiOrigin = computed(() => new URL(config.public.apiBase).origin);

const resetMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const assetUrl = (path: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
  return `${apiOrigin.value}/storage/${path}`;
};

const loadData = async () => {
  loading.value = true;
  resetMessages();
  try {
    const [schoolRes, settingsRes] = await Promise.all([
      $fetch<SchoolInfo>(`${config.public.apiBase}/school`, { headers: authHeaders.value }),
      $fetch<Partial<SettingsForm> | null>(`${config.public.apiBase}/school/settings`, { headers: authHeaders.value }),
    ]);

    school.value = schoolRes;
    form.logo_path = settingsRes?.logo_path ?? "";
    form.favicon_path = settingsRes?.favicon_path ?? "";
    form.tagline = settingsRes?.tagline ?? "";
    form.meta_title = settingsRes?.meta_title ?? "";
    form.meta_description = settingsRes?.meta_description ?? "";
    form.facebook_url = settingsRes?.facebook_url ?? "";
    form.instagram_url = settingsRes?.instagram_url ?? "";
    form.youtube_url = settingsRes?.youtube_url ?? "";
    form.copyright_text = settingsRes?.copyright_text ?? "";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load settings.";
  } finally {
    loading.value = false;
  }
};

const uploadAsset = async (file: File, target: "logo_path" | "favicon_path") => {
  if (target === "logo_path") uploadingLogo.value = true;
  else uploadingFavicon.value = true;
  resetMessages();
  try {
    const payload = new FormData();
    payload.append("section", "settings");
    payload.append("file", file);
    const res = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      body: payload,
    });
    form[target] = res.path;
    successMessage.value = target === "logo_path" ? "Logo uploaded." : "Favicon uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Asset upload failed.";
  } finally {
    if (target === "logo_path") uploadingLogo.value = false;
    else uploadingFavicon.value = false;
  }
};

watch(logoFile, async (file) => {
  if (!file) return;
  await uploadAsset(file, "logo_path");
  logoFile.value = null;
});

watch(faviconFile, async (file) => {
  if (!file) return;
  await uploadAsset(file, "favicon_path");
  faviconFile.value = null;
});

const saveSettings = async () => {
  saving.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/settings`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        logo_path: form.logo_path || null,
        favicon_path: form.favicon_path || null,
        tagline: form.tagline || null,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        facebook_url: form.facebook_url || null,
        instagram_url: form.instagram_url || null,
        youtube_url: form.youtube_url || null,
        copyright_text: form.copyright_text || null,
      },
    });
    successMessage.value = "Settings saved.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to save settings.";
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
  await loadData();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Settings</h2>
      <p class="text-sm text-slate-600">Manage school branding and SEO settings.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{{ successMessage }}</p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage }}</p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid gap-4 md:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">School Name (Read-only)</label>
        <input :value="school?.name || ''" disabled type="text" class="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Template (Read-only)</label>
        <input :value="school?.template || ''" disabled type="text" class="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600" />
        <p class="mt-1 text-xs text-amber-700">Contact Syed Websites to change template.</p>
      </div>
      <div class="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Admin cannot change template, layout, colors, fonts, CSS, or section order from this page.
      </div>
    </div>

    <form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid gap-4 md:grid-cols-2" @submit.prevent="saveSettings">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Logo</label>
        <ImageUploader v-model="logoFile" />
        <p class="text-xs text-slate-500">{{ uploadingLogo ? "Uploading logo..." : "Upload logo image" }}</p>
        <img v-if="form.logo_path" :src="assetUrl(form.logo_path)" alt="Logo preview" class="h-20 rounded-md border border-slate-200 object-contain bg-white p-2" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Favicon</label>
        <ImageUploader v-model="faviconFile" />
        <p class="text-xs text-slate-500">{{ uploadingFavicon ? "Uploading favicon..." : "Upload favicon image" }}</p>
        <img v-if="form.favicon_path" :src="assetUrl(form.favicon_path)" alt="Favicon preview" class="h-16 w-16 rounded-md border border-slate-200 object-contain bg-white p-2" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Tagline</label>
        <input v-model="form.tagline" type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Meta Title</label>
        <input v-model="form.meta_title" type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>
      <div class="md:col-span-2">
        <label class="mb-1 block text-sm font-medium text-slate-700">Meta Description</label>
        <textarea v-model="form.meta_description" rows="3" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Facebook URL</label>
        <input v-model="form.facebook_url" type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Instagram URL</label>
        <input v-model="form.instagram_url" type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">YouTube URL</label>
        <input v-model="form.youtube_url" type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Copyright Text</label>
        <input v-model="form.copyright_text" type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
      </div>

      <div class="md:col-span-2">
        <button type="submit" :disabled="loading || saving || uploadingLogo || uploadingFavicon" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
          {{ saving ? "Saving..." : "Save Settings" }}
        </button>
      </div>
    </form>
  </section>
</template>
