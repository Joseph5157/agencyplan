<script setup lang="ts">
type TestimonialItem = {
  id?: number;
  name: string;
  quote: string;
  photo_path: string | null;
  relation: string | null;
  sort_order: number;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const adding = ref(false);
const uploading = ref(false);
const deletingId = ref<number | null>(null);
const successMessage = ref("");
const errorMessage = ref("");

const testimonials = ref<TestimonialItem[]>([]);
const newPhotoFile = ref<File | null>(null);
const newPhotoPath = ref<string>("");

const newItem = reactive<TestimonialItem>({
  name: "",
  quote: "",
  photo_path: null,
  relation: "",
  sort_order: 0,
});

const rowSaving = reactive<Record<number, boolean>>({});
const authHeaders = computed<Record<string, string>>(() => ({
  Accept: "application/json",
  Authorization: `Bearer ${token.value}`,
}));
const apiOrigin = computed(() => new URL(config.public.apiBase).origin);

const resetMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const photoUrl = (path: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
  return `${apiOrigin.value}/storage/${path}`;
};

const normalize = (items: unknown): TestimonialItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item: any, index) => ({
      id: item?.id,
      name: String(item?.name ?? ""),
      quote: String(item?.quote ?? ""),
      photo_path: item?.photo_path ?? null,
      relation: item?.relation ?? "",
      sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
};

const loadTestimonials = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<unknown>(`${config.public.apiBase}/school/testimonials`, {
      headers: authHeaders.value,
    });
    testimonials.value = normalize(data);
    newItem.sort_order = testimonials.value.length;
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load testimonials.";
  } finally {
    loading.value = false;
  }
};

const uploadPhoto = async (file: File) => {
  uploading.value = true;
  resetMessages();
  try {
    const payload = new FormData();
    payload.append("section", "testimonials");
    payload.append("file", file);

    const res = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      body: payload,
    });
    newPhotoPath.value = res.path;
    successMessage.value = "Photo uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Photo upload failed.";
  } finally {
    uploading.value = false;
  }
};

watch(newPhotoFile, async (file) => {
  if (!file) return;
  await uploadPhoto(file);
  newPhotoFile.value = null;
});

const addTestimonial = async () => {
  adding.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/testimonials`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        name: newItem.name,
        quote: newItem.quote,
        photo_path: newPhotoPath.value || null,
        relation: newItem.relation || null,
        sort_order: newItem.sort_order,
      },
    });

    newItem.name = "";
    newItem.quote = "";
    newItem.relation = "";
    newItem.sort_order = testimonials.value.length;
    newPhotoPath.value = "";
    await loadTestimonials();
    successMessage.value = "Testimonial added.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to add testimonial.";
  } finally {
    adding.value = false;
  }
};

const saveTestimonial = async (item: TestimonialItem) => {
  if (!item.id) return;
  rowSaving[item.id] = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/testimonials/${item.id}`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        name: item.name,
        quote: item.quote,
        photo_path: item.photo_path,
        relation: item.relation || null,
        sort_order: item.sort_order,
      },
    });
    successMessage.value = "Testimonial updated.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to update testimonial.";
  } finally {
    rowSaving[item.id] = false;
  }
};

const deleteTestimonial = async (id?: number) => {
  if (!id) return;
  deletingId.value = id;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    testimonials.value = testimonials.value.filter((item) => item.id !== id);
    successMessage.value = "Testimonial deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete testimonial.";
  } finally {
    deletingId.value = null;
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
  await loadTestimonials();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Testimonials Editor</h2>
      <p class="text-sm text-slate-600">Manage testimonials with optional photo.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Testimonial</h3>
      <form class="grid gap-3 md:grid-cols-2" @submit.prevent="addTestimonial">
        <input v-model="newItem.name" required type="text" placeholder="Name" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model="newItem.relation" type="text" placeholder="Relation (optional)" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <textarea v-model="newItem.quote" required rows="3" placeholder="Quote" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model.number="newItem.sort_order" type="number" min="0" placeholder="Sort order" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <div class="space-y-2">
          <ImageUploader v-model="newPhotoFile" />
          <p class="text-xs text-slate-500">{{ uploading ? "Uploading photo..." : "Optional testimonial photo" }}</p>
        </div>
        <div class="md:col-span-2">
          <img v-if="newPhotoPath" :src="photoUrl(newPhotoPath)" alt="New testimonial photo" class="h-24 w-24 rounded-md border border-slate-200 object-cover" />
        </div>
        <button type="submit" :disabled="adding || uploading" class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
          {{ adding ? "Adding..." : "Add Testimonial" }}
        </button>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Testimonials</h3>
      <div v-if="loading" class="text-sm text-slate-500">Loading testimonials...</div>
      <div v-else-if="testimonials.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">No testimonials yet.</div>
      <div v-else class="space-y-4">
        <div v-for="item in testimonials" :key="item.id" class="rounded-lg border border-slate-200 p-4">
          <div class="grid gap-3 md:grid-cols-[100px_1fr]">
            <img v-if="item.photo_path" :src="photoUrl(item.photo_path)" alt="Testimonial photo" class="h-20 w-20 rounded-md border border-slate-200 object-cover" />
            <div class="grid gap-3 md:grid-cols-2">
              <input v-model="item.name" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <input v-model="item.relation" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <textarea v-model="item.quote" rows="3" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <input v-model.number="item.sort_order" type="number" min="0" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <button type="button" :disabled="rowSaving[item.id!]" class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-60" @click="saveTestimonial(item)">
              {{ rowSaving[item.id!] ? "Saving..." : "Save" }}
            </button>
            <button type="button" :disabled="deletingId === item.id" class="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60" @click="deleteTestimonial(item.id)">
              {{ deletingId === item.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
