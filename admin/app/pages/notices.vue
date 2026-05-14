<script setup lang="ts">
type NoticeItem = {
  id?: number;
  title: string;
  description: string;
  notice_date: string;
  attachment_path: string | null;
  is_active: boolean;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const uploading = ref(false);
const adding = ref(false);
const deletingId = ref<number | null>(null);
const successMessage = ref("");
const errorMessage = ref("");

const notices = ref<NoticeItem[]>([]);
const newAttachmentFile = ref<File | null>(null);
const newAttachmentPath = ref<string>("");

const newNotice = reactive<NoticeItem>({
  title: "",
  description: "",
  notice_date: "",
  attachment_path: null,
  is_active: true,
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

const fileUrl = (path: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
  return `${apiOrigin.value}/storage/${path}`;
};

const normalize = (items: unknown): NoticeItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map((item: any) => ({
    id: item?.id,
    title: String(item?.title ?? ""),
    description: String(item?.description ?? ""),
    notice_date: String(item?.notice_date ?? ""),
    attachment_path: item?.attachment_path ?? null,
    is_active: Boolean(item?.is_active),
  }));
};

const loadNotices = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<unknown>(`${config.public.apiBase}/admin/notices`, {
      headers: authHeaders.value,
    });
    notices.value = normalize(data);
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load notices.";
  } finally {
    loading.value = false;
  }
};

const uploadPdf = async (file: File) => {
  uploading.value = true;
  resetMessages();
  try {
    const payload = new FormData();
    payload.append("section", "notices");
    payload.append("file", file);
    const res = await $fetch<{ path: string }>(`${config.public.apiBase}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
      body: payload,
    });
    newAttachmentPath.value = res.path;
    successMessage.value = "PDF uploaded.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "PDF upload failed.";
  } finally {
    uploading.value = false;
  }
};

watch(newAttachmentFile, async (file) => {
  if (!file) return;
  await uploadPdf(file);
  newAttachmentFile.value = null;
});

const addNotice = async () => {
  adding.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/notices`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        title: newNotice.title,
        description: newNotice.description,
        notice_date: newNotice.notice_date,
        attachment_path: newAttachmentPath.value || null,
        is_active: newNotice.is_active,
      },
    });

    newNotice.title = "";
    newNotice.description = "";
    newNotice.notice_date = "";
    newNotice.is_active = true;
    newAttachmentPath.value = "";

    await loadNotices();
    successMessage.value = "Notice added.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to add notice.";
  } finally {
    adding.value = false;
  }
};

const saveNotice = async (notice: NoticeItem) => {
  if (!notice.id) return;
  rowSaving[notice.id] = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/notices/${notice.id}`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        title: notice.title,
        description: notice.description,
        notice_date: notice.notice_date,
        attachment_path: notice.attachment_path,
        is_active: notice.is_active,
      },
    });
    successMessage.value = "Notice updated.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to update notice.";
  } finally {
    rowSaving[notice.id] = false;
  }
};

const deleteNotice = async (id?: number) => {
  if (!id) return;
  deletingId.value = id;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/notices/${id}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    notices.value = notices.value.filter((item) => item.id !== id);
    successMessage.value = "Notice deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete notice.";
  } finally {
    deletingId.value = null;
  }
};

const onAttachmentSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  newAttachmentFile.value = input.files?.[0] ?? null;
};

if (import.meta.client) {
  loadToken();
  if (!token.value) {
    await navigateTo("/login");
  }
}

onMounted(async () => {
  if (!token.value) return;
  await loadNotices();
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Notice Board Manager</h2>
      <p class="text-sm text-slate-600">Create and manage notices with optional PDF attachment.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Notice</h3>
      <form class="grid gap-3 md:grid-cols-2" @submit.prevent="addNotice">
        <input v-model="newNotice.title" required type="text" placeholder="Title" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <input v-model="newNotice.notice_date" required type="date" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <textarea v-model="newNotice.description" required rows="3" placeholder="Description" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
        <label class="inline-flex items-center gap-2 text-sm text-slate-700">
          <input v-model="newNotice.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          Active
        </label>
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-slate-700">Optional PDF attachment</label>
          <input type="file" accept="application/pdf,.pdf" class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" @change="onAttachmentSelect" />
          <p class="text-xs text-slate-500">{{ uploading ? "Uploading PDF..." : "PDF only" }}</p>
          <a v-if="newAttachmentPath" :href="fileUrl(newAttachmentPath)" target="_blank" class="text-xs text-blue-600 underline">View uploaded PDF</a>
        </div>
        <button type="submit" :disabled="adding || uploading" class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
          {{ adding ? "Adding..." : "Add Notice" }}
        </button>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Notices</h3>
      <div v-if="loading" class="text-sm text-slate-500">Loading notices...</div>
      <div v-else-if="notices.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">No notices found.</div>
      <div v-else class="space-y-4">
        <div v-for="notice in notices" :key="notice.id" class="rounded-lg border border-slate-200 p-4 space-y-3">
          <div class="grid gap-3 md:grid-cols-2">
            <input v-model="notice.title" type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
            <input v-model="notice.notice_date" type="date" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
            <textarea v-model="notice.description" rows="3" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" />
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="notice.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Active
            </label>
            <a v-if="notice.attachment_path" :href="fileUrl(notice.attachment_path)" target="_blank" class="text-sm text-blue-600 underline">View PDF</a>
            <button type="button" :disabled="rowSaving[notice.id!]" class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-60" @click="saveNotice(notice)">
              {{ rowSaving[notice.id!] ? "Saving..." : "Save" }}
            </button>
            <button type="button" :disabled="deletingId === notice.id" class="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60" @click="deleteNotice(notice.id)">
              {{ deletingId === notice.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
