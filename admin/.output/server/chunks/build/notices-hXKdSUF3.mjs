import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthToken, a as useRuntimeConfig, n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notices",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const uploading = ref(false);
    const adding = ref(false);
    const deletingId = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");
    const notices = ref([]);
    const newAttachmentFile = ref(null);
    const newAttachmentPath = ref("");
    const newNotice = reactive({
      title: "",
      description: "",
      notice_date: "",
      attachment_path: null,
      is_active: true
    });
    const rowSaving = reactive({});
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    const apiOrigin = computed(() => new URL(config.public.apiBase).origin);
    const resetMessages = () => {
      successMessage.value = "";
      errorMessage.value = "";
    };
    const fileUrl = (path) => {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
      return `${apiOrigin.value}/storage/${path}`;
    };
    const uploadPdf = async (file) => {
      var _a;
      uploading.value = true;
      resetMessages();
      try {
        const payload = new FormData();
        payload.append("section", "notices");
        payload.append("file", file);
        const res = await $fetch(`${config.public.apiBase}/admin/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            Accept: "application/json"
          },
          body: payload
        });
        newAttachmentPath.value = res.path;
        successMessage.value = "PDF uploaded.";
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 401) {
          await navigateTo("/login");
          return;
        }
        errorMessage.value = ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || "PDF upload failed.";
      } finally {
        uploading.value = false;
      }
    };
    watch(newAttachmentFile, async (file) => {
      if (!file) return;
      await uploadPdf(file);
      newAttachmentFile.value = null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Notice Board Manager</h2><p class="text-sm text-slate-600">Create and manage notices with optional PDF attachment.</p></div>`);
      if (unref(successMessage)) {
        _push(`<p class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">${ssrInterpolate(unref(successMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errorMessage)) {
        _push(`<p class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Notice</h3><form class="grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", unref(newNotice).title)} required type="text" placeholder="Title" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newNotice).notice_date)} required type="date" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><textarea required rows="3" placeholder="Description" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2">${ssrInterpolate(unref(newNotice).description)}</textarea><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(unref(newNotice).is_active) ? ssrLooseContain(unref(newNotice).is_active, null) : unref(newNotice).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"> Active </label><div class="md:col-span-2 space-y-2"><label class="block text-sm font-medium text-slate-700">Optional PDF attachment</label><input type="file" accept="application/pdf,.pdf" class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"><p class="text-xs text-slate-500">${ssrInterpolate(unref(uploading) ? "Uploading PDF..." : "PDF only")}</p>`);
      if (unref(newAttachmentPath)) {
        _push(`<a${ssrRenderAttr("href", fileUrl(unref(newAttachmentPath)))} target="_blank" class="text-xs text-blue-600 underline">View uploaded PDF</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(adding) || unref(uploading)) ? " disabled" : ""} class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(adding) ? "Adding..." : "Add Notice")}</button></form></div><div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Notices</h3>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-slate-500">Loading notices...</div>`);
      } else if (unref(notices).length === 0) {
        _push(`<div class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">No notices found.</div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(notices), (notice) => {
          _push(`<div class="rounded-lg border border-slate-200 p-4 space-y-3"><div class="grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", notice.title)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", notice.notice_date)} type="date" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><textarea rows="3" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2">${ssrInterpolate(notice.description)}</textarea></div><div class="flex flex-wrap items-center gap-3"><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(notice.is_active) ? ssrLooseContain(notice.is_active, null) : notice.is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"> Active </label>`);
          if (notice.attachment_path) {
            _push(`<a${ssrRenderAttr("href", fileUrl(notice.attachment_path))} target="_blank" class="text-sm text-blue-600 underline">View PDF</a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button type="button"${ssrIncludeBooleanAttr(unref(rowSaving)[notice.id]) ? " disabled" : ""} class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-60">${ssrInterpolate(unref(rowSaving)[notice.id] ? "Saving..." : "Save")}</button><button type="button"${ssrIncludeBooleanAttr(unref(deletingId) === notice.id) ? " disabled" : ""} class="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">${ssrInterpolate(unref(deletingId) === notice.id ? "Deleting..." : "Delete")}</button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notices.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notices-hXKdSUF3.mjs.map
