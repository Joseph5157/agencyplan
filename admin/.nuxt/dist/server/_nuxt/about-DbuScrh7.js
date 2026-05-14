import { defineComponent, useModel, mergeProps, useSSRContext, ref, reactive, computed, watch, unref, isRef } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./ImageUploader-DuMTDa-I.js";
import { u as useAuthToken, a as useRuntimeConfig, n as navigateTo } from "../server.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/hookable/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/unctx/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/defu/dist/defu.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ufo/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RichTextEditor",
  __ssrInlineRender: true,
  props: {
    "modelValue": { default: "" },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}><textarea rows="6" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Rich text editor placeholder">${ssrInterpolate(model.value)}</textarea><p class="text-xs text-slate-500"> Placeholder component. Replace with a constrained rich-text editor in later tasks. </p></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RichTextEditor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  async setup(__props) {
    const config = useRuntimeConfig();
    const { token } = useAuthToken();
    const loading = ref(true);
    const saving = ref(false);
    const uploadingAboutImage = ref(false);
    const uploadingPrincipalPhoto = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const aboutImageFile = ref(null);
    const principalPhotoFile = ref(null);
    const form = reactive({
      heading: "",
      description: "",
      image_path: null,
      principal_name: null,
      principal_message: null,
      principal_photo: null,
      established_year: null
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
    const uploadImage = async (file, target) => {
      const isAboutImage = target === "image_path";
      if (isAboutImage) uploadingAboutImage.value = true;
      else uploadingPrincipalPhoto.value = true;
      resetMessages();
      try {
        const formData = new FormData();
        formData.append("section", "about");
        formData.append("file", file);
        const res = await $fetch(`${config.public.apiBase}/admin/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            Accept: "application/json"
          },
          body: formData
        });
        form[target] = res.path;
        successMessage.value = isAboutImage ? "About image uploaded." : "Principal photo uploaded.";
      } catch (error) {
        if (error?.status === 401) {
          await navigateTo("/login");
          return;
        }
        errorMessage.value = error?.data?.message || "Image upload failed.";
      } finally {
        if (isAboutImage) uploadingAboutImage.value = false;
        else uploadingPrincipalPhoto.value = false;
      }
    };
    watch(aboutImageFile, async (file) => {
      if (!file) return;
      await uploadImage(file, "image_path");
      aboutImageFile.value = null;
    });
    watch(principalPhotoFile, async (file) => {
      if (!file) return;
      await uploadImage(file, "principal_photo");
      principalPhotoFile.value = null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RichTextEditor = _sfc_main$1;
      const _component_ImageUploader = _sfc_main$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">About Editor</h2><p class="text-sm text-slate-600">Update About section and principal profile content.</p></div>`);
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
      _push(`<form class="grid gap-6 lg:grid-cols-2"><div class="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div><label class="mb-1 block text-sm font-medium text-slate-700">About heading</label><input${ssrRenderAttr("value", unref(form).heading)} type="text" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="About our school"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">About description</label>`);
      _push(ssrRenderComponent(_component_RichTextEditor, {
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event
      }, null, _parent));
      _push(`</div><div class="space-y-2"><label class="block text-sm font-medium text-slate-700">About image</label>`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(aboutImageFile),
        "onUpdate:modelValue": ($event) => isRef(aboutImageFile) ? aboutImageFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploadingAboutImage) ? "Uploading..." : "Choose image to upload.")}</p>`);
      if (unref(form).image_path) {
        _push(`<img${ssrRenderAttr("src", imageUrl(unref(form).image_path))} alt="About image preview" class="h-40 w-full rounded-md border border-slate-200 object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div><label class="mb-1 block text-sm font-medium text-slate-700">Principal name</label><input${ssrRenderAttr("value", unref(form).principal_name)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="Principal name"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Principal message</label>`);
      _push(ssrRenderComponent(_component_RichTextEditor, {
        modelValue: unref(form).principal_message,
        "onUpdate:modelValue": ($event) => unref(form).principal_message = $event
      }, null, _parent));
      _push(`</div><div class="space-y-2"><label class="block text-sm font-medium text-slate-700">Principal photo</label>`);
      _push(ssrRenderComponent(_component_ImageUploader, {
        modelValue: unref(principalPhotoFile),
        "onUpdate:modelValue": ($event) => isRef(principalPhotoFile) ? principalPhotoFile.value = $event : null
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(uploadingPrincipalPhoto) ? "Uploading..." : "Choose image to upload.")}</p>`);
      if (unref(form).principal_photo) {
        _push(`<img${ssrRenderAttr("src", imageUrl(unref(form).principal_photo))} alt="Principal photo preview" class="h-40 w-full rounded-md border border-slate-200 object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="mb-1 block text-sm font-medium text-slate-700">Established year</label><input${ssrRenderAttr("value", unref(form).established_year)} type="text" maxlength="10" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="1998"></div></div><div class="lg:col-span-2"><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || unref(saving) || unref(uploadingAboutImage) || unref(uploadingPrincipalPhoto)) ? " disabled" : ""} class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(saving) ? "Saving..." : "Save About Content")}</button></div></form></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=about-DbuScrh7.js.map
