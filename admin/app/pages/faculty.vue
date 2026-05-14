<script setup lang="ts">
type FacultyItem = {
  id?: number;
  name: string;
  designation: string;
  qualification: string | null;
  experience: string | null;
  photo_path: string | null;
  sort_order: number;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const adding = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const faculty = ref<FacultyItem[]>([]);
const newFaculty = reactive<FacultyItem>({
  name: "",
  designation: "",
  qualification: "",
  experience: "",
  photo_path: null,
  sort_order: 0,
});

const newPhotoFile = ref<File | null>(null);
const rowPhotoFiles = reactive<Record<number, File | null>>({});
const uploadingNew = ref(false);
const uploadingRows = reactive<Record<number, boolean>>({});
const savingRows = reactive<Record<number, boolean>>({});
const deletingRows = reactive<Record<number, boolean>>({});

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

const normalize = (items: unknown): FacultyItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item: any, index) => ({
      id: item?.id,
      name: String(item?.name ?? ""),
      designation: String(item?.designation ?? ""),
      qualification: item?.qualification ?? "",
      experience: item?.experience ?? "",
      photo_path: item?.photo_path ?? null,
      sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
};

const loadFaculty = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<unknown>(`${config.public.apiBase}/school/faculty`, {
      headers: authHeaders.value,
    });
    faculty.value = normalize(data);
    newFaculty.sort_order = faculty.value.length;
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load faculty.";
  } finally {
    loading.value = false;
  }
};

const uploadPhoto = async (file: File): Promise<string> => {
  const payload = new FormData();
  payload.append("section", "faculty");
  payload.append("file", file);

  const res = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      Accept: "application/json",
    },
    body: payload,
  });

  return res.path;
};

watch(newPhotoFile, async (file) => {
  if (!file) return;
  uploadingNew.value = true;
  resetMessages();
  try {
    newFaculty.photo_path = await uploadPhoto(file);
    successMessage.value = "New faculty photo uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Photo upload failed.";
  } finally {
    uploadingNew.value = false;
    newPhotoFile.value = null;
  }
});

const addFaculty = async () => {
  adding.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/faculty`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        name: newFaculty.name,
        designation: newFaculty.designation,
        qualification: newFaculty.qualification || null,
        experience: newFaculty.experience || null,
        photo_path: newFaculty.photo_path,
        sort_order: newFaculty.sort_order,
      },
    });

    newFaculty.name = "";
    newFaculty.designation = "";
    newFaculty.qualification = "";
    newFaculty.experience = "";
    newFaculty.photo_path = null;
    newFaculty.sort_order = faculty.value.length;

    await loadFaculty();
    successMessage.value = "Faculty member added.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to add faculty member.";
  } finally {
    adding.value = false;
  }
};

const uploadRowPhoto = async (item: FacultyItem) => {
  if (!item.id) return;
  const file = rowPhotoFiles[item.id];
  if (!file) return;

  uploadingRows[item.id] = true;
  resetMessages();
  try {
    item.photo_path = await uploadPhoto(file);
    successMessage.value = "Faculty photo uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Faculty photo upload failed.";
  } finally {
    uploadingRows[item.id] = false;
    rowPhotoFiles[item.id] = null;
  }
};

const saveFaculty = async (item: FacultyItem) => {
  if (!item.id) return;
  savingRows[item.id] = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/faculty/${item.id}`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        name: item.name,
        designation: item.designation,
        qualification: item.qualification || null,
        experience: item.experience || null,
        photo_path: item.photo_path,
        sort_order: item.sort_order,
      },
    });
    successMessage.value = "Faculty member updated.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to update faculty member.";
  } finally {
    savingRows[item.id] = false;
  }
};

const deleteFaculty = async (item: FacultyItem) => {
  if (!item.id) return;
  deletingRows[item.id] = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/faculty/${item.id}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    faculty.value = faculty.value.filter((f) => f.id !== item.id);
    successMessage.value = "Faculty member deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete faculty member.";
  } finally {
    deletingRows[item.id] = false;
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
  await loadFaculty();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Faculty Editor</h2>
      <p class="text-sm text-slate-600">Manage faculty profiles and ordering.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Faculty Member</h3>
      <form class="grid gap-3 md:grid-cols-2" @submit.prevent="addFaculty">
        <input v-model="newFaculty.name" required type="text" placeholder="Name" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model="newFaculty.designation" required type="text" placeholder="Designation" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model="newFaculty.qualification" type="text" placeholder="Qualification" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model="newFaculty.experience" type="text" placeholder="Experience" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model.number="newFaculty.sort_order" type="number" min="0" placeholder="Sort order" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <div class="space-y-2">
          <ImageUploader v-model="newPhotoFile" />
          <p class="text-xs text-slate-500">{{ uploadingNew ? "Uploading photo..." : "Upload faculty photo" }}</p>
        </div>
        <div class="md:col-span-2">
          <img v-if="newFaculty.photo_path" :src="photoUrl(newFaculty.photo_path)" alt="New faculty photo" class="h-28 w-28 rounded-md border border-slate-200 object-cover" />
        </div>
        <button type="submit" :disabled="adding || uploadingNew" class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
          {{ adding ? "Adding..." : "Add Faculty Member" }}
        </button>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Faculty List</h3>
      <div v-if="loading" class="text-sm text-slate-500">Loading faculty...</div>
      <div v-else-if="faculty.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">No faculty members yet.</div>
      <div v-else class="space-y-4">
        <div v-for="item in faculty" :key="item.id" class="rounded-lg border border-slate-200 p-4">
          <div class="grid gap-3 md:grid-cols-[100px_1fr]">
            <img v-if="item.photo_path" :src="photoUrl(item.photo_path)" alt="Faculty photo" class="h-24 w-24 rounded-md border border-slate-200 object-cover" />
            <div class="grid gap-3 md:grid-cols-2">
              <input v-model="item.name" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <input v-model="item.designation" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <input v-model="item.qualification" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <input v-model="item.experience" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
              <input v-model.number="item.sort_order" type="number" min="0" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <div class="min-w-[220px]">
              <ImageUploader v-model="rowPhotoFiles[item.id!]" />
            </div>
            <button type="button" :disabled="uploadingRows[item.id!] || !rowPhotoFiles[item.id!]" class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60" @click="uploadRowPhoto(item)">
              {{ uploadingRows[item.id!] ? "Uploading..." : "Upload New Photo" }}
            </button>
            <button type="button" :disabled="savingRows[item.id!]" class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-60" @click="saveFaculty(item)">
              {{ savingRows[item.id!] ? "Saving..." : "Save" }}
            </button>
            <button type="button" :disabled="deletingRows[item.id!]" class="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60" @click="deleteFaculty(item)">
              {{ deletingRows[item.id!] ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
