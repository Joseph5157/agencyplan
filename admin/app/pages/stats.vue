<script setup lang="ts">
type StatItem = {
  id?: number;
  number: string;
  label: string;
  sort_order: number;
};

const config = useRuntimeConfig();
const { token, loadToken } = useAuthToken();

const loading = ref(true);
const adding = ref(false);
const saving = ref(false);
const deletingId = ref<number | null>(null);
const successMessage = ref("");
const errorMessage = ref("");

const stats = ref<StatItem[]>([]);
const newStat = reactive<StatItem>({
  number: "",
  label: "",
  sort_order: 0,
});

const authHeaders = computed<Record<string, string>>(() => ({
  Accept: "application/json",
  Authorization: `Bearer ${token.value}`,
}));

const resetMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const normalizeStats = (items: unknown): StatItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item: any, index) => ({
      id: item?.id,
      number: String(item?.number ?? ""),
      label: String(item?.label ?? ""),
      sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
};

const loadStats = async () => {
  loading.value = true;
  resetMessages();
  try {
    const data = await $fetch<unknown>(`${config.public.apiBase}/school/stats`, {
      headers: authHeaders.value,
    });
    stats.value = normalizeStats(data);
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = "Failed to load stats.";
  } finally {
    loading.value = false;
  }
};

const addStat = async () => {
  adding.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/stats`, {
      method: "POST",
      headers: authHeaders.value,
      body: {
        number: newStat.number,
        label: newStat.label,
        sort_order: newStat.sort_order,
      },
    });
    newStat.number = "";
    newStat.label = "";
    newStat.sort_order = stats.value.length;
    await loadStats();
    successMessage.value = "Stat added.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to add stat.";
  } finally {
    adding.value = false;
  }
};

const saveStats = async () => {
  saving.value = true;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/stats`, {
      method: "PUT",
      headers: authHeaders.value,
      body: {
        stats: stats.value.map((item, index) => ({
          number: item.number,
          label: item.label,
          sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : index,
        })),
      },
    });
    await loadStats();
    successMessage.value = "Stats updated.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to update stats.";
  } finally {
    saving.value = false;
  }
};

const deleteStat = async (id?: number) => {
  if (!id) return;
  deletingId.value = id;
  resetMessages();
  try {
    await $fetch(`${config.public.apiBase}/admin/stats/${id}`, {
      method: "DELETE",
      headers: authHeaders.value,
    });
    stats.value = stats.value.filter((item) => item.id !== id);
    successMessage.value = "Stat deleted.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    errorMessage.value = error?.data?.message || "Failed to delete stat.";
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
  await loadStats();
  newStat.sort_order = stats.value.length;
});
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Stats Editor</h2>
      <p class="text-sm text-slate-600">Manage stat number, label, and order.</p>
    </div>

    <p v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Add Stat</h3>
      <form class="grid gap-3 md:grid-cols-4" @submit.prevent="addStat">
        <input
          v-model="newStat.number"
          type="text"
          required
          placeholder="Number"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <input
          v-model="newStat.label"
          type="text"
          required
          placeholder="Label"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <input
          v-model.number="newStat.sort_order"
          type="number"
          min="0"
          placeholder="Sort order"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
        />
        <button
          type="submit"
          :disabled="adding || loading"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {{ adding ? "Adding..." : "Add Stat" }}
        </button>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Stats List</h3>
        <button
          type="button"
          :disabled="saving || loading || stats.length === 0"
          class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          @click="saveStats"
        >
          {{ saving ? "Saving..." : "Save All Changes" }}
        </button>
      </div>

      <div v-if="loading" class="text-sm text-slate-500">Loading stats...</div>
      <div v-else-if="stats.length === 0" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        No stats found.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="(item, index) in stats"
          :key="item.id ?? index"
          class="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_2fr_120px_110px]"
        >
          <input
            v-model="item.number"
            type="text"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          />
          <input
            v-model="item.label"
            type="text"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          />
          <input
            v-model.number="item.sort_order"
            type="number"
            min="0"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
          />
          <button
            type="button"
            :disabled="deletingId === item.id"
            class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            @click="deleteStat(item.id)"
          >
            {{ deletingId === item.id ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
