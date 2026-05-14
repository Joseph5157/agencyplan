<script setup lang="ts">
type FacilityItem = {
  id?: number;
  name: string;
  description: string;
  image_path: string | null;
  sort_order: number;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const adding = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const facilities = ref<FacilityItem[]>([]);
const newFacility = reactive<FacilityItem>({
  name: "",
  description: "",
  image_path: null,
  sort_order: 0,
});

const newImageFile = ref<File | null>(null);
const rowUploadFiles = reactive<Record<number, File | null>>({});
const savingRows = reactive<Record<number, boolean>>({});
const deletingRows = reactive<Record<number, boolean>>({});
const uploadingRows = reactive<Record<number, boolean>>({});
const uploadingNew = ref(false);

const authHeaders = computed<Record<string, string>>(() => ({
  Accept: "application/json",
  Authorization: `Bearer ${token.value}`,
}));
const canAddMore = computed(() => facilities.value.length < 12);
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

const normalize = (list: unknown): FacilityItem[] => {
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any, index) => ({
      id: item?.id,
      name: String(item?.name ?? ""),
      description: String(item?.description ?? ""),
      image_path: item?.image_path ?? null,
      sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
};

const loadFacilities = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<unknown>(`${config.public.apiBase}/school/facilities`, {
      headers: authHeaders.value,
    });
    facilities.value = normalize(data);
    newFacility.sort_order = facilities.value.length;
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load facilities.";
  } finally {
    loading.value = false;
  }
};

const uploadImage = async (file: File): Promise<string> => {
  const payload = new FormData();
  payload.append("section", "facilities");
  payload.append("file", file);

  const response = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      Accept: "application/json",
    },
    body: payload,
  });

  return response.path;
};

watch(newImageFile, async (file) => {
  if (!file) return;
  uploadingNew.value = true;
  resetMessages();
  try {
    newFacility.image_path = await uploadImage(file);
    successMessage.value = "New facility image uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Image upload failed.";
  } finally {
    uploadingNew.value = false;
    newImageFile.value = null;
  }
});

const addFacility = async () => {
  if (!canAddMore.value) {
    errorMessage.value = "Maximum 12 facilities allowed.";
    return;
  }

  adding.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/facilities`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        name: newFacility.name,
        description: newFacility.description,
        image_path: newFacility.image_path,
        sort_order: newFacility.sort_order,
      },
    });
    newFacility.name = "";
    newFacility.description = "";
    newFacility.image_path = null;
    newFacility.sort_order = facilities.value.length;
    await loadFacilities();
    successMessage.value = "Facility added.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to add facility.";
  } finally {
    adding.value = false;
  }
};

const saveFacility = async (item: FacilityItem) => {
  if (!item.id) return;
  savingRows[item.id] = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/facilities/${item.id}`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        name: item.name,
        description: item.description,
        image_path: item.image_path,
        sort_order: item.sort_order,
      },
    });
    successMessage.value = "Facility updated.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to update facility.";
  } finally {
    savingRows[item.id] = false;
  }
};

const deleteFacility = async (item: FacilityItem) => {
  if (!item.id) return;
  deletingRows[item.id] = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/facilities/${item.id}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    facilities.value = facilities.value.filter((f) => f.id !== item.id);
    successMessage.value = "Facility deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete facility.";
  } finally {
    deletingRows[item.id] = false;
  }
};

const uploadRowImage = async (item: FacilityItem) => {
  if (!item.id) return;
  const file = rowUploadFiles[item.id];
  if (!file) return;

  uploadingRows[item.id] = true;
  resetMessages();
  try {
    item.image_path = await uploadImage(file);
    successMessage.value = "Facility image uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Facility image upload failed.";
  } finally {
    uploadingRows[item.id] = false;
    rowUploadFiles[item.id] = null;
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
  await loadFacilities();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Facilities Editor</h2>
      <p class="text-sm text-slate-600">Manage facility cards (max 12).</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Facility</h3>
        <span class="text-xs font-medium text-slate-500">{{ facilities.length }}/12</span>
      </div>

      <form class="grid gap-3 md:grid-cols-2" @submit.prevent="addFacility">
        <input
          v-model="newFacility.name"
          required
          type="text"
          placeholder="Facility name"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <input
          v-model.number="newFacility.sort_order"
          type="number"
          min="0"
          placeholder="Sort order"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <textarea
          v-model="newFacility.description"
          required
          rows="3"
          placeholder="Facility description"
          class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <div class="md:col-span-2 space-y-2">
          <ImageUploader v-model="newImageFile" />
          <p class="text-xs text-slate-500">{{ uploadingNew ? "Uploading image..." : "Upload facility image/icon" }}</p>
          <img
            v-if="newFacility.image_path"
            :src="imageUrl(newFacility.image_path)"
            alt="New facility image"
            class="h-32 w-full max-w-sm rounded-md border border-slate-200 object-cover"
          />
        </div>
        <button
          type="submit"
          :disabled="adding || uploadingNew || !canAddMore"
          class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {{ adding ? "Adding..." : canAddMore ? "Add Facility" : "Limit Reached (12)" }}
        </button>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Facilities List</h3>

      <div v-if="loading" class="text-sm text-slate-500">Loading facilities...</div>
      <div v-else-if="facilities.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        No facilities yet.
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in facilities" :key="item.id" class="rounded-lg border border-slate-200 p-4 space-y-3">
          <div class="grid gap-3 md:grid-cols-2">
            <input
              v-model="item.name"
              type="text"
              class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            />
            <input
              v-model.number="item.sort_order"
              type="number"
              min="0"
              class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            />
            <textarea
              v-model="item.description"
              rows="3"
              class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
            />
          </div>

          <div class="space-y-2">
            <ImageUploader v-model="rowUploadFiles[item.id!]" />
            <button
              type="button"
              :disabled="uploadingRows[item.id!] || !rowUploadFiles[item.id!]"
              class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              @click="uploadRowImage(item)"
            >
              {{ uploadingRows[item.id!] ? "Uploading..." : "Upload New Image" }}
            </button>
            <img
              v-if="item.image_path"
              :src="imageUrl(item.image_path)"
              alt="Facility image"
              class="h-28 w-full max-w-sm rounded-md border border-slate-200 object-cover"
            />
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              :disabled="savingRows[item.id!]"
              class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
              @click="saveFacility(item)"
            >
              {{ savingRows[item.id!] ? "Saving..." : "Save" }}
            </button>
            <button
              type="button"
              :disabled="deletingRows[item.id!]"
              class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              @click="deleteFacility(item)"
            >
              {{ deletingRows[item.id!] ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
