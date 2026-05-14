import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuthToken } from './server.mjs';
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
  __name: "contact",
  __ssrInlineRender: true,
  async setup(__props) {
    const { token } = useAuthToken();
    const loading = ref(true);
    const saving = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const form = reactive({
      address: "",
      phone: "",
      email: "",
      maps_url: "",
      whatsapp: ""
    });
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Contact Editor</h2><p class="text-sm text-slate-600">Update school contact information.</p></div>`);
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
      _push(`<form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid gap-4 md:grid-cols-2"><div class="md:col-span-2"><label class="mb-1 block text-sm font-medium text-slate-700">Address *</label><textarea required rows="3" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="School address">${ssrInterpolate(unref(form).address)}</textarea></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Phone *</label><input${ssrRenderAttr("value", unref(form).phone)} required type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="+91..."></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Email *</label><input${ssrRenderAttr("value", unref(form).email)} required type="email" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="contact@school.com"></div><div><label class="mb-1 block text-sm font-medium text-slate-700">Google Maps URL</label><input${ssrRenderAttr("value", unref(form).maps_url)} type="url" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="https://maps.google.com/..."></div><div><label class="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label><input${ssrRenderAttr("value", unref(form).whatsapp)} type="text" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="+91..."></div><div class="md:col-span-2"><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || unref(saving)) ? " disabled" : ""} class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(saving) ? "Saving..." : "Save Contact Info")}</button></div></form></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-ihSlvoue.mjs.map
