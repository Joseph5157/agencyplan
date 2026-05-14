import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { u as useAuthToken, a as useRuntimeConfig } from "../server.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/hookable/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/unctx/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/defu/dist/defu.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ufo/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "hero",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const saving = ref(false);
    const uploading = ref(false);
    const deletingSlideId = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");
    const slides = ref([]);
    const form = reactive({
      heading: "",
      subheading: "",
      cta_text: "",
      cta_link: ""
    });
    const canAddSlides = computed(() => slides.value.length < 5);
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    const apiOrigin = computed(() => new URL(config.public.apiBase).origin);
    const imageUrl = (path) => {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith("/")) return `${apiOrigin.value}${path}`;
      return `${apiOrigin.value}/storage/${path}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Hero Editor</h2><p class="text-sm text-slate-600">Manage heading, CTA, and hero slides (max 5).</p></div></div>`);
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
      _push(`<div class="grid gap-6 lg:grid-cols-[1.3fr_1fr]"><form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><div><label class="mb-1 block text-sm font-medium text-slate-700">Main heading</label><input${ssrRenderAttr("value", unref(form).heading)} type="text" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="Enter main heading"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Subheading</label><input${ssrRenderAttr("value", unref(form).subheading)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="Enter subheading"></div><div class="grid gap-4 sm:grid-cols-2"><div><label class="mb-1 block text-sm font-medium text-slate-700">CTA button text</label><input${ssrRenderAttr("value", unref(form).cta_text)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="Admissions Open"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">CTA button link</label><input${ssrRenderAttr("value", unref(form).cta_link)} type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="https://example.com/admissions"></div></div><div class="pt-1"><button type="submit"${ssrIncludeBooleanAttr(unref(saving) || unref(loading)) ? " disabled" : ""} class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(saving) ? "Saving..." : "Save Hero Content")}</button></div></form><div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-slate-900">Hero Slides</h3><span class="text-xs font-medium text-slate-500">${ssrInterpolate(unref(slides).length)}/5</span></div><label class="${ssrRenderClass([unref(canAddSlides) ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50" : "cursor-not-allowed opacity-60", "block rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-600"])}"><input type="file" accept="image/*" class="hidden"${ssrIncludeBooleanAttr(!unref(canAddSlides) || unref(uploading)) ? " disabled" : ""}> ${ssrInterpolate(unref(uploading) ? "Uploading..." : unref(canAddSlides) ? "Upload new slide image" : "Slide limit reached (5/5)")}</label>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-slate-500">Loading slides...</div>`);
      } else {
        _push(`<ul class="space-y-3">`);
        if (unref(slides).length === 0) {
          _push(`<li class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"> No slides added yet. </li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(slides), (slide) => {
          _push(`<li class="overflow-hidden rounded-lg border border-slate-200"><img${ssrRenderAttr("src", imageUrl(slide.image_path))} alt="Hero slide preview" class="h-36 w-full object-cover"><div class="flex items-center justify-between bg-white px-3 py-2"><p class="truncate text-xs text-slate-500">${ssrInterpolate(slide.image_path)}</p><button type="button"${ssrIncludeBooleanAttr(unref(deletingSlideId) === slide.id) ? " disabled" : ""} class="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">${ssrInterpolate(unref(deletingSlideId) === slide.id ? "Deleting..." : "Delete")}</button></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/hero.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=hero-CpodeFUt.js.map
