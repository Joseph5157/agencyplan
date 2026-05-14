import { _ as _sfc_main$1 } from './ImageUploader-DuMTDa-I.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
  __name: "settings",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const saving = ref(false);
    const uploadingLogo = ref(false);
    const uploadingFavicon = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const school = ref(null);
    const logoFile = ref(null);
    const faviconFile = ref(null);
    const form = reactive({
      logo_path: "",
      favicon_path: "",
      tagline: "",
      meta_title: "",
      meta_description: "",
      facebook_url: "",
      instagram_url: "",
      youtube_url: "",
      copyright_text: ""
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
    const assetUrl = (path) => {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
      return `${apiOrigin.value}/storage/${path}`;
    };
    const uploadAsset = async (file, target) => {
      var _a;
      if (target === "logo_path") uploadingLogo.value = true;
      else uploadingFavicon.value = true;
      resetMessages();
      try {
        const payload = new FormData();
        payload.append("section", "settings");
        payload.append("file", file);
        const res = await $fetch(`${config.public.apiBase}/admin/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            Accept: "application/json"
          },
          body: payload
        });
        form[target] = res.path;
        successMessage.value = target === "logo_path" ? "Logo uploaded." : "Favicon uploaded.";
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 401) {
          await navigateTo("/login");
          return;
        }
        errorMessage.value = ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || "Asset upload failed.";
      } finally {
        if (target === "logo_path") uploadingLogo.value = false;
        else uploadingFavicon.value = false;
      }
    };
    watch(logoFile, async (file) => {
      if (!file) return;
      await uploadAsset(file, "logo_path");
      logoFile.value = null;
    });
    watch(faviconFile, async (file) => {
      if (!file) return;
      await uploadAsset(file, "favicon_path");
      faviconFile.value = null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_ImageUploader = _sfc_main$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Settings</h2><p class="text-sm text-slate-600">Manage school branding and SEO settings.</p></div>`);
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
      _push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid gap-4 md:grid-cols-2"><div><label class="mb-1 block text-sm font-medium text-slate-700">School Name (Read-only)</label><input${ssrRenderAttr("value", ((_a = unref(school)) == null ? void 0 : _a.name) || "")} disabled type="text" class="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Template (Read-only)</label><input${ssrRenderAttr("value", ((_b = unref(school)) == null ? void 0 : _b.template) || "")} disabled type="text" class="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600"><p class="mt-1 text-xs text-amber-700">Contact Syed Websites to change template.</p></div><div class="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"> Admin cannot change template, layout, colors, fonts, CSS, or section order from this page. </div></div><form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="block text-sm font-medium text-slate-700">Logo</label>`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(logoFile),
        "onUpdate:modelValue": ($event) => isRef(logoFile) ? logoFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploadingLogo) ? "Uploading logo..." : "Upload logo image")}</p>`);
      if (unref(form).logo_path) {
        _push(`<img${ssrRenderAttr("src", assetUrl(unref(form).logo_path))} alt="Logo preview" class="h-20 rounded-md border border-slate-200 object-contain bg-white p-2">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><label class="block text-sm font-medium text-slate-700">Favicon</label>`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(faviconFile),
        "onUpdate:modelValue": ($event) => isRef(faviconFile) ? faviconFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploadingFavicon) ? "Uploading favicon..." : "Upload favicon image")}</p>`);
      if (unref(form).favicon_path) {
        _push(`<img${ssrRenderAttr("src", assetUrl(unref(form).favicon_path))} alt="Favicon preview" class="h-16 w-16 rounded-md border border-slate-200 object-contain bg-white p-2">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="mb-1 block text-sm font-medium text-slate-700">Tagline</label><input${ssrRenderAttr("value", unref(form).tagline)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Meta Title</label><input${ssrRenderAttr("value", unref(form).meta_title)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div><div class="md:col-span-2"><label class="mb-1 block text-sm font-medium text-slate-700">Meta Description</label><textarea rows="3" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2">${ssrInterpolate(unref(form).meta_description)}</textarea></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Facebook URL</label><input${ssrRenderAttr("value", unref(form).facebook_url)} type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Instagram URL</label><input${ssrRenderAttr("value", unref(form).instagram_url)} type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">YouTube URL</label><input${ssrRenderAttr("value", unref(form).youtube_url)} type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Copyright Text</label><input${ssrRenderAttr("value", unref(form).copyright_text)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"></div><div class="md:col-span-2"><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || unref(saving) || unref(uploadingLogo) || unref(uploadingFavicon)) ? " disabled" : ""} class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(saving) ? "Saving..." : "Save Settings")}</button></div></form></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-Dx9NZwDd.mjs.map
