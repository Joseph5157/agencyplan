import { _ as _sfc_main$1 } from './ImageUploader-DuMTDa-I.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "gallery",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const adding = ref(false);
    const uploading = ref(false);
    const deletingId = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");
    const gallery = ref([]);
    const newImageFile = ref(null);
    const uploadedImagePath = ref("");
    const newItem = reactive({
      caption: "",
      category: "",
      sort_order: 0
    });
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    const apiOrigin = computed(() => new URL(config.public.apiBase).origin);
    const resetMessages = () => {
      successMessage.value = "";
      errorMessage.value = "";
    };
    const imageUrl = (path) => {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
      return `${apiOrigin.value}/storage/${path}`;
    };
    const uploadImage = async (file) => {
      var _a;
      uploading.value = true;
      resetMessages();
      try {
        const formData = new FormData();
        formData.append("section", "gallery");
        formData.append("file", file);
        const res = await $fetch(`${config.public.apiBase}/admin/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            Accept: "application/json"
          },
          body: formData
        });
        uploadedImagePath.value = res.path;
        successMessage.value = "Image uploaded. Fill metadata and add to gallery.";
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 401) {
          await navigateTo("/login");
          return;
        }
        errorMessage.value = ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || "Image upload failed.";
      } finally {
        uploading.value = false;
      }
    };
    watch(newImageFile, async (file) => {
      if (!file) return;
      await uploadImage(file);
      newImageFile.value = null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageUploader = _sfc_main$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Gallery Manager</h2><p class="text-sm text-slate-600">Upload images and manage gallery metadata.</p></div>`);
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
      _push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Gallery Image</h3><div class="space-y-2">`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(newImageFile),
        "onUpdate:modelValue": ($event) => isRef(newImageFile) ? newImageFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploading) ? "Uploading..." : "Upload image first")}</p></div>`);
      if (unref(uploadedImagePath)) {
        _push(`<img${ssrRenderAttr("src", imageUrl(unref(uploadedImagePath)))} alt="New gallery preview" class="h-36 w-full max-w-sm rounded-md border border-slate-200 object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="grid gap-3 md:grid-cols-3"><input${ssrRenderAttr("value", unref(newItem).caption)} type="text" placeholder="Caption" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newItem).category)} type="text" placeholder="Category" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newItem).sort_order)} type="number" min="0" placeholder="Sort order" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><button type="submit"${ssrIncludeBooleanAttr(unref(adding) || unref(uploading)) ? " disabled" : ""} class="md:col-span-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(adding) ? "Adding..." : "Add To Gallery")}</button></form></div><div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Gallery Grid</h3>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-slate-500">Loading gallery...</div>`);
      } else if (unref(gallery).length === 0) {
        _push(`<div class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"> No gallery images yet. </div>`);
      } else {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(gallery), (item) => {
          _push(`<div class="overflow-hidden rounded-lg border border-slate-200"><img${ssrRenderAttr("src", imageUrl(item.image_path))} alt="Gallery image" class="h-40 w-full object-cover"><div class="space-y-1 p-3"><p class="truncate text-sm font-medium text-slate-800">${ssrInterpolate(item.caption || "No caption")}</p><p class="text-xs text-slate-500">Category: ${ssrInterpolate(item.category || "Uncategorized")}</p><p class="text-xs text-slate-500">Sort: ${ssrInterpolate(item.sort_order)}</p></div><div class="border-t border-slate-200 p-3"><button type="button"${ssrIncludeBooleanAttr(unref(deletingId) === item.id) ? " disabled" : ""} class="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">${ssrInterpolate(unref(deletingId) === item.id ? "Deleting..." : "Delete")}</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=gallery-Bk-TaGXv.mjs.map
