<script setup lang="ts">
type GalleryItem = {
  id?: number;
  image_path: string;
  caption: string | null;
  category: string | null;
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

const gallery = ref<GalleryItem[]>([]);
const newImageFile = ref<File | null>(null);
const uploadedImagePath = ref<string>("");

const newItem = reactive({
  caption: "",
  category: "",
  sort_order: 0,
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

const imageUrl = (path: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
  return `${apiOrigin.value}/storage/${path}`;
};

const normalize = (items: unknown): GalleryItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item: any, index) => ({
      id: item?.id,
      image_path: String(item?.image_path ?? ""),
      caption: item?.caption ?? "",
      category: item?.category ?? "",
      sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
};

const loadGallery = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<unknown>(`${config.public.apiBase}/school/gallery`, {
      headers: authHeaders.value,
    });
    gallery.value = normalize(data);
    newItem.sort_order = gallery.value.length;
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load gallery images.";
  } finally {
    loading.value = false;
  }
};

const uploadImage = async (file: File) => {
  uploading.value = true;
  resetMessages();
  try {
    const formData = new FormData();
    formData.append("section", "gallery");
    formData.append("file", file);

    const res = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      body: formData,
    });

    uploadedImagePath.value = res.path;
    successMessage.value = "Image uploaded. Fill metadata and add to gallery.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Image upload failed.";
  } finally {
    uploading.value = false;
  }
};

watch(newImageFile, async (file) => {
  if (!file) return;
  await uploadImage(file);
  newImageFile.value = null;
});

const addGalleryRecord = async () => {
  if (!uploadedImagePath.value) {
    errorMessage.value = "Upload an image first.";
    return;
  }

  adding.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/gallery`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        image_path: uploadedImagePath.value,
        caption: newItem.caption || null,
        category: newItem.category || null,
        sort_order: newItem.sort_order,
      },
    });

    uploadedImagePath.value = "";
    newItem.caption = "";
    newItem.category = "";
    newItem.sort_order = gallery.value.length;
    await loadGallery();
    successMessage.value = "Gallery image added.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to add gallery image.";
  } finally {
    adding.value = false;
  }
};

const deleteImage = async (id?: number) => {
  if (!id) return;
  deletingId.value = id;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/gallery/${id}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    gallery.value = gallery.value.filter((item) => item.id !== id);
    successMessage.value = "Gallery image deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete gallery image.";
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
  await loadGallery();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Gallery Manager</h2>
      <p class="text-sm text-slate-600">Upload images and manage gallery metadata.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Gallery Image</h3>
      <div class="space-y-2">
        <ImageUploader v-model="newImageFile" />
        <p class="text-xs text-slate-500">{{ uploading ? "Uploading..." : "Upload image first" }}</p>
      </div>

      <img
        v-if="uploadedImagePath"
        :src="imageUrl(uploadedImagePath)"
        alt="New gallery preview"
        class="h-36 w-full max-w-sm rounded-md border border-slate-200 object-cover"
      />

      <form class="grid gap-3 md:grid-cols-3" @submit.prevent="addGalleryRecord">
        <input
          v-model="newItem.caption"
          type="text"
          placeholder="Caption"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <input
          v-model="newItem.category"
          type="text"
          placeholder="Category"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <input
          v-model.number="newItem.sort_order"
          type="number"
          min="0"
          placeholder="Sort order"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <button
          type="submit"
          :disabled="adding || uploading"
          class="md:col-span-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {{ adding ? "Adding..." : "Add To Gallery" }}
        </button>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Gallery Grid</h3>

      <div v-if="loading" class="text-sm text-slate-500">Loading gallery...</div>
      <div v-else-if="gallery.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        No gallery images yet.
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in gallery" :key="item.id" class="overflow-hidden rounded-lg border border-slate-200">
          <img :src="imageUrl(item.image_path)" alt="Gallery image" class="h-40 w-full object-cover" />
          <div class="space-y-1 p-3">
            <p class="truncate text-sm font-medium text-slate-800">{{ item.caption || "No caption" }}</p>
            <p class="text-xs text-slate-500">Category: {{ item.category || "Uncategorized" }}</p>
            <p class="text-xs text-slate-500">Sort: {{ item.sort_order }}</p>
          </div>
          <div class="border-t border-slate-200 p-3">
            <button
              type="button"
              :disabled="deletingId === item.id"
              class="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              @click="deleteImage(item.id)"
            >
              {{ deletingId === item.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
