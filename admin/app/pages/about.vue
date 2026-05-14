<script setup lang="ts">
type AboutPayload = {
  heading: string;
  description: string;
  image_path: string | null;
  principal_name: string | null;
  principal_message: string | null;
  principal_photo: string | null;
  established_year: string | null;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const saving = ref(false);
const uploadingAboutImage = ref(false);
const uploadingPrincipalPhoto = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const aboutImageFile = ref<File | null>(null);
const principalPhotoFile = ref<File | null>(null);

const form = reactive<AboutPayload>({
  heading: "",
  description: "",
  image_path: null,
  principal_name: null,
  principal_message: null,
  principal_photo: null,
  established_year: null,
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

const imageUrl = (path: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
  return `${apiOrigin.value}/storage/${path}`;
};

const loadAbout = async () => {
  loading.value = true;
  resetMessages();

  try {
    const data = await $fetch<Partial<AboutPayload> | null>(`${config.public.apiBase}/school/about`, {
      headers: authHeaders.value,
    });

    form.heading = data?.heading ?? "";
    form.description = data?.description ?? "";
    form.image_path = data?.image_path ?? null;
    form.principal_name = data?.principal_name ?? null;
    form.principal_message = data?.principal_message ?? null;
    form.principal_photo = data?.principal_photo ?? null;
    form.established_year = data?.established_year ?? null;
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load About data.";
  } finally {
    loading.value = false;
  }
};

const uploadImage = async (file: File, target: "image_path" | "principal_photo") => {
  const isAboutImage = target === "image_path";
  if (isAboutImage) uploadingAboutImage.value = true;
  else uploadingPrincipalPhoto.value = true;
  resetMessages();

  try {
    const formData = new FormData();
    formData.append("section", "about");
    formData.append("file", file);

    const res = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      body: formData,
    });

    form[target] = res.path;
    successMessage.value = isAboutImage ? "About image uploaded." : "Principal photo uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Image upload failed.";
  } finally {
    if (isAboutImage) uploadingAboutImage.value = false;
    else uploadingPrincipalPhoto.value = false;
  }
};

watch(aboutImageFile, async (file) => {
  if (!file) return;
  await uploadImage(file, "image_path");
  aboutImageFile.value = null;
});

watch(principalPhotoFile, async (file) => {
  if (!file) return;
  await uploadImage(file, "principal_photo");
  principalPhotoFile.value = null;
});

const saveAbout = async () => {
  saving.value = true;
  resetMessages();

  try {
    await $fetch(`${config.public.apiBase}/admin/about`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        heading: form.heading,
        description: form.description,
        image_path: form.image_path,
        principal_name: form.principal_name || null,
        principal_message: form.principal_message || null,
        principal_photo: form.principal_photo,
        established_year: form.established_year || null,
      },
    });

    successMessage.value = "About content saved successfully.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to save About content.";
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
  await loadAbout();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">About Editor</h2>
      <p class="text-sm text-slate-600">Update About section and principal profile content.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <form class="grid gap-6 lg:grid-cols-2" @submit.prevent="saveAbout">
      <div class="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">About heading</label>
          <input
            v-model="form.heading"
            type="text"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            placeholder="About our school"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">About description</label>
          <RichTextEditor v-model="form.description" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">About image</label>
          <ImageUploader v-model="aboutImageFile" />
          <p class="text-xs text-slate-500">{{ uploadingAboutImage ? "Uploading..." : "Choose image to upload." }}</p>
          <img
            v-if="form.image_path"
            :src="imageUrl(form.image_path)"
            alt="About image preview"
            class="h-40 w-full rounded-md border border-slate-200 object-cover"
          />
        </div>
      </div>

      <div class="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Principal name</label>
          <input
            v-model="form.principal_name"
            type="text"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            placeholder="Principal name"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Principal message</label>
          <RichTextEditor v-model="form.principal_message" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Principal photo</label>
          <ImageUploader v-model="principalPhotoFile" />
          <p class="text-xs text-slate-500">{{ uploadingPrincipalPhoto ? "Uploading..." : "Choose image to upload." }}</p>
          <img
            v-if="form.principal_photo"
            :src="imageUrl(form.principal_photo)"
            alt="Principal photo preview"
            class="h-40 w-full rounded-md border border-slate-200 object-cover"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Established year</label>
          <input
            v-model="form.established_year"
            type="text"
            maxlength="10"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            placeholder="1998"
          />
        </div>
      </div>

      <div class="lg:col-span-2">
        <button
          type="submit"
          :disabled="loading || saving || uploadingAboutImage || uploadingPrincipalPhoto"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {{ saving ? "Saving..." : "Save About Content" }}
        </button>
      </div>
    </form>
  </section>
</template>
