import { u as useAuthToken, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  async setup(__props) {
    const { token } = useAuthToken();
    const loading = ref(true);
    const welcomeName = ref("School Admin");
    const schoolName = ref("School");
    const schoolId = ref("--");
    const totalFaculty = ref(0);
    const totalGalleryImages = ref(0);
    const activeNotices = ref(0);
    const errorMessage = ref("");
    const quickLinks = [
      { label: "Hero", to: "/hero" },
      { label: "About", to: "/about" },
      { label: "Stats", to: "/stats" },
      { label: "Facilities", to: "/facilities" },
      { label: "Faculty", to: "/faculty" },
      { label: "Gallery", to: "/gallery" },
      { label: "Notices", to: "/notices" },
      { label: "Testimonials", to: "/testimonials" },
      { label: "Contact", to: "/contact" },
      { label: "Settings", to: "/settings" }
    ];
    computed(() => {
      if (!token.value) return { Accept: "application/json" };
      return {
        Accept: "application/json",
        Authorization: `Bearer ${token.value}`
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-1"><h2 class="text-2xl font-semibold tracking-tight">Welcome, ${ssrInterpolate(unref(welcomeName))}</h2><p class="text-sm text-slate-600">${ssrInterpolate(unref(schoolName))} \xB7 School ID: ${ssrInterpolate(unref(schoolId))}</p></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-4 sm:grid-cols-3"><div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Faculty</p><p class="mt-2 text-3xl font-semibold text-slate-900">${ssrInterpolate(unref(loading) ? "..." : unref(totalFaculty))}</p></div><div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-medium uppercase tracking-wider text-slate-500">Gallery Images</p><p class="mt-2 text-3xl font-semibold text-slate-900">${ssrInterpolate(unref(loading) ? "..." : unref(totalGalleryImages))}</p></div><div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-medium uppercase tracking-wider text-slate-500">Active Notices</p><p class="mt-2 text-3xl font-semibold text-slate-900">${ssrInterpolate(unref(loading) ? "..." : unref(activeNotices))}</p></div></div><div class="rounded-xl border border-slate-200 bg-white p-4"><h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</h3><div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(quickLinks, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: "rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-BNFIqAp7.mjs.map
