import { _ as _sfc_main$1 } from "./ImageUploader-DuMTDa-I.js";
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, isRef, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { u as useAuthToken, n as navigateTo, a as useRuntimeConfig } from "../server.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/hookable/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/unctx/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/defu/dist/defu.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ufo/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "facilities",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const adding = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const facilities = ref([]);
    const newFacility = reactive({
      name: "",
      description: "",
      image_path: null,
      sort_order: 0
    });
    const newImageFile = ref(null);
    const rowUploadFiles = reactive({});
    const savingRows = reactive({});
    const deletingRows = reactive({});
    const uploadingRows = reactive({});
    const uploadingNew = ref(false);
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    const canAddMore = computed(() => facilities.value.length < 12);
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
      const payload = new FormData();
      payload.append("section", "facilities");
      payload.append("file", file);
      const response = await $fetch(`${config.public.apiBase}/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json"
        },
        body: payload
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
      } catch (error) {
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageUploader = _sfc_main$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Facilities Editor</h2><p class="text-sm text-slate-600">Manage facility cards (max 12).</p></div>`);
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
      _push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Add Facility</h3><span class="text-xs font-medium text-slate-500">${ssrInterpolate(unref(facilities).length)}/12</span></div><form class="grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", unref(newFacility).name)} required type="text" placeholder="Facility name" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newFacility).sort_order)} type="number" min="0" placeholder="Sort order" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><textarea required rows="3" placeholder="Facility description" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2">${ssrInterpolate(unref(newFacility).description)}</textarea><div class="md:col-span-2 space-y-2">`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(newImageFile),
        "onUpdate:modelValue": ($event) => isRef(newImageFile) ? newImageFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploadingNew) ? "Uploading image..." : "Upload facility image/icon")}</p>`);
      if (unref(newFacility).image_path) {
        _push(`<img${ssrRenderAttr("src", imageUrl(unref(newFacility).image_path))} alt="New facility image" class="h-32 w-full max-w-sm rounded-md border border-slate-200 object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(adding) || unref(uploadingNew) || !unref(canAddMore)) ? " disabled" : ""} class="md:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(adding) ? "Adding..." : unref(canAddMore) ? "Add Facility" : "Limit Reached (12)")}</button></form></div><div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Facilities List</h3>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-slate-500">Loading facilities...</div>`);
      } else if (unref(facilities).length === 0) {
        _push(`<div class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"> No facilities yet. </div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(facilities), (item) => {
          _push(`<div class="rounded-lg border border-slate-200 p-4 space-y-3"><div class="grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", item.name)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.sort_order)} type="number" min="0" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><textarea rows="3" class="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2">${ssrInterpolate(item.description)}</textarea></div><div class="space-y-2">`);
          _push(ssrRenderComponent(_component_ImageUploader, {
            modelValue: unref(rowUploadFiles)[item.id],
            "onUpdate:modelValue": ($event) => unref(rowUploadFiles)[item.id] = $event
          }, null, _parent));
          _push(`<button type="button"${ssrIncludeBooleanAttr(unref(uploadingRows)[item.id] || !unref(rowUploadFiles)[item.id]) ? " disabled" : ""} class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">${ssrInterpolate(unref(uploadingRows)[item.id] ? "Uploading..." : "Upload New Image")}</button>`);
          if (item.image_path) {
            _push(`<img${ssrRenderAttr("src", imageUrl(item.image_path))} alt="Facility image" class="h-28 w-full max-w-sm rounded-md border border-slate-200 object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex gap-2"><button type="button"${ssrIncludeBooleanAttr(unref(savingRows)[item.id]) ? " disabled" : ""} class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60">${ssrInterpolate(unref(savingRows)[item.id] ? "Saving..." : "Save")}</button><button type="button"${ssrIncludeBooleanAttr(unref(deletingRows)[item.id]) ? " disabled" : ""} class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">${ssrInterpolate(unref(deletingRows)[item.id] ? "Deleting..." : "Delete")}</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/facilities.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=facilities-BT8WLNon.js.map
