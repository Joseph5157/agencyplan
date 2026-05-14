<script setup lang="ts">
type HeroContent = {
  heading: string;
  subheading: string | null;
  cta_text: string | null;
  cta_link: string | null;
};

type HeroSlide = {
  id: number;
  image_path: string;
  sort_order: number;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const saving = ref(false);
const uploading = ref(false);
const deletingSlideId = ref<number | null>(null);
const successMessage = ref("");
const errorMessage = ref("");
const slides = ref<HeroSlide[]>([]);

const form = reactive<HeroContent>({
  heading: "",
  subheading: "",
  cta_text: "",
  cta_link: "",
});

const canAddSlides = computed(() => slides.value.length < 5);
const authHeaders = computed<Record<string, string>>(() => ({
  Accept: "application/json",
  Authorization: `Bearer ${token.value}`,
}));
const apiOrigin = computed(() => new URL(config.public.apiBase).origin);

const resetMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const imageUrl = (path: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
  return `${apiOrigin.value}/storage/${path}`;
};

const loadHero = async () => {
  loading.value = true;
  resetMessages();

  try {
    const response = await $fetch<{ content: HeroContent | null; slides: HeroSlide[] }>(
      `${config.public.apiBase}/school/hero`,
      { headers: authHeaders.value },
    );

    form.heading = response?.content?.heading ?? "";
    form.subheading = response?.content?.subheading ?? "";
    form.cta_text = response?.content?.cta_text ?? "";
    form.cta_link = response?.content?.cta_link ?? "";
    slides.value = Array.isArray(response?.slides) ? response.slides : [];
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load hero data.";
  } finally {
    loading.value = false;
  }
};

const saveHero = async () => {
  saving.value = true;
  resetMessages();

  try {
    await $fetch(`${config.public.apiBase}/admin/hero`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        heading: form.heading,
        subheading: form.subheading || null,
        cta_text: form.cta_text || null,
        cta_link: form.cta_link || null,
      },
    });
    successMessage.value = "Hero content saved successfully.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to save hero content.";
  } finally {
    saving.value = false;
  }
};

const onUploadSlide = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];
  input.value = "";

  if (!file) return;
  if (!canAddSlides.value) {
    errorMessage.value = "You can upload a maximum of 5 hero slides.";
    return;
  }

  uploading.value = true;
  resetMessages();

  try {
    const uploadData = new FormData();
    uploadData.append("section", "hero");
    uploadData.append("file", file);

    const uploadRes = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      body: uploadData,
    });

    await $fetch(`${config.public.apiBase}/admin/hero/slides`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        image_path: uploadRes.path,
        sort_order: slides.value.length,
      },
    });

    await loadHero();
    successMessage.value = "Hero slide uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to upload hero slide.";
  } finally {
    uploading.value = false;
  }
};

const deleteSlide = async (slideId: number) => {
  deletingSlideId.value = slideId;
  resetMessages();

  try {
    await $fetch(`${config.public.apiBase}/admin/hero/slides/${slideId}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    slides.value = slides.value.filter((slide) => slide.id !== slideId);
    successMessage.value = "Hero slide deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete hero slide.";
  } finally {
    deletingSlideId.value = null;
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
  await loadHero();
});
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Hero Editor</h2>
        <p class="text-sm text-slate-600">Manage heading, CTA, and hero slides (max 5).</p>
      </div>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4" @submit.prevent="saveHero">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Main heading</label>
          <input
            v-model="form.heading"
            type="text"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            placeholder="Enter main heading"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Subheading</label>
          <input
            v-model="form.subheading"
            type="text"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            placeholder="Enter subheading"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">CTA button text</label>
            <input
              v-model="form.cta_text"
              type="text"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
              placeholder="Admissions Open"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">CTA button link</label>
            <input
              v-model="form.cta_link"
              type="url"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
              placeholder="https://example.com/admissions"
            />
          </div>
        </div>

        <div class="pt-1">
          <button
            type="submit"
            :disabled="saving || loading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {{ saving ? "Saving..." : "Save Hero Content" }}
          </button>
        </div>
      </form>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Hero Slides</h3>
          <span class="text-xs font-medium text-slate-500">{{ slides.length }}/5</span>
        </div>

        <label
          class="block rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-600"
          :class="canAddSlides ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50' : 'cursor-not-allowed opacity-60'"
        >
          <input type="file" accept="image/*" class="hidden" :disabled="!canAddSlides || uploading" @change="onUploadSlide" />
          {{ uploading ? "Uploading..." : canAddSlides ? "Upload new slide image" : "Slide limit reached (5/5)" }}
        </label>

        <div v-if="loading" class="text-sm text-slate-500">Loading slides...</div>
        <ul v-else class="space-y-3">
          <li v-if="slides.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            No slides added yet.
          </li>
          <li v-for="slide in slides" :key="slide.id" class="overflow-hidden rounded-lg border border-slate-200">
            <img :src="imageUrl(slide.image_path)" alt="Hero slide preview" class="h-36 w-full object-cover" />
            <div class="flex items-center justify-between bg-white px-3 py-2">
              <p class="truncate text-xs text-slate-500">{{ slide.image_path }}</p>
              <button
                type="button"
                :disabled="deletingSlideId === slide.id"
                class="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                @click="deleteSlide(slide.id)"
              >
                {{ deletingSlideId === slide.id ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
