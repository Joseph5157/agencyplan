import { _ as _sfc_main$1 } from './ImageUploader-DuMTDa-I.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthToken, n as navigateTo, a as useRuntimeConfig } from './server.mjs';
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
  __name: "faculty",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const adding = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const faculty = ref([]);
    const newFaculty = reactive({
      name: "",
      designation: "",
      qualification: "",
      experience: "",
      photo_path: null,
      sort_order: 0
    });
    const newPhotoFile = ref(null);
    const rowPhotoFiles = reactive({});
    const uploadingNew = ref(false);
    const uploadingRows = reactive({});
    const savingRows = reactive({});
    const deletingRows = reactive({});
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    const apiOrigin = computed(() => new URL(config.public.apiBase).origin);
    const resetMessages = () => {
      successMessage.value = "";
      errorMessage.value = "";
    };
    const photoUrl = (path) => {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
      return `${apiOrigin.value}/storage/${path}`;
    };
    const uploadPhoto = async (file) => {
      const payload = new FormData();
      payload.append("section", "faculty");
      payload.append("file", file);
      const res = await $fetch(`${config.public.apiBase}/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json"
        },
        body: payload
      });
      return res.path;
    };
    watch(newPhotoFile, async (file) => {
      var _a;
      if (!file) return;
      uploadingNew.value = true;
      resetMessages();
      try {
        newFaculty.photo_path = await uploadPhoto(file);
        successMessage.value = "New faculty photo uploaded.";
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 401) {
          await navigateTo("/login");
          return;
        }
        errorMessage.value = ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || "Photo upload failed.";
      } finally {
        uploadingNew.value = false;
        newPhotoFile.value = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageUploader = _sfc_main$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Faculty Editor</h2><p class="text-sm text-slate-600">Manage faculty profiles and ordering.</p></div>`);
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
      _push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Faculty Member</h3><form class="grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", unref(newFaculty).name)} required type="text" placeholder="Name" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newFaculty).designation)} required type="text" placeholder="Designation" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newFaculty).qualification)} type="text" placeholder="Qualification" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newFaculty).experience)} type="text" placeholder="Experience" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newFaculty).sort_order)} type="number" min="0" placeholder="Sort order" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><div class="space-y-2">`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(newPhotoFile),
        "onUpdate:modelValue": ($event) => isRef(newPhotoFile) ? newPhotoFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploadingNew) ? "Uploading photo..." : "Upload faculty photo")}</p></div><div class="md:col-span-2">`);
      if (unref(newFaculty).photo_path) {
        _push(`<img${ssrRenderAttr("src", photoUrl(unref(newFaculty).photo_path))} alt="New faculty photo" class="h-28 w-28 rounded-md border border-slate-200 object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(adding) || unref(uploadingNew)) ? " disabled" : ""} class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(adding) ? "Adding..." : "Add Faculty Member")}</button></form></div><div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Faculty List</h3>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-slate-500">Loading faculty...</div>`);
      } else if (unref(faculty).length === 0) {
        _push(`<div class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">No faculty members yet.</div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(faculty), (item) => {
          _push(`<div class="rounded-lg border border-slate-200 p-4"><div class="grid gap-3 md:grid-cols-[100px_1fr]">`);
          if (item.photo_path) {
            _push(`<img${ssrRenderAttr("src", photoUrl(item.photo_path))} alt="Faculty photo" class="h-24 w-24 rounded-md border border-slate-200 object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", item.name)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.designation)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.qualification)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.experience)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.sort_order)} type="number" min="0" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div></div><div class="mt-3 flex flex-wrap items-center gap-2"><div class="min-w-[220px]">`);
          _push(ssrRenderComponent(_component_ImageUploader, {
            modelValue: unref(rowPhotoFiles)[item.id],
            "onUpdate:modelValue": ($event) => unref(rowPhotoFiles)[item.id] = $event
          }, null, _parent));
          _push(`</div><button type="button"${ssrIncludeBooleanAttr(unref(uploadingRows)[item.id] || !unref(rowPhotoFiles)[item.id]) ? " disabled" : ""} class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">${ssrInterpolate(unref(uploadingRows)[item.id] ? "Uploading..." : "Upload New Photo")}</button><button type="button"${ssrIncludeBooleanAttr(unref(savingRows)[item.id]) ? " disabled" : ""} class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-60">${ssrInterpolate(unref(savingRows)[item.id] ? "Saving..." : "Save")}</button><button type="button"${ssrIncludeBooleanAttr(unref(deletingRows)[item.id]) ? " disabled" : ""} class="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">${ssrInterpolate(unref(deletingRows)[item.id] ? "Deleting..." : "Delete")}</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faculty.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=faculty-C0hsHwNS.mjs.map
