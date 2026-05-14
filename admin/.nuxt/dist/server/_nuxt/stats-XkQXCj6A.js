import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/hookable/dist/index.mjs";
import { u as useAuthToken } from "../server.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/unctx/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/defu/dist/defu.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ufo/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "stats",
  __ssrInlineRender: true,
  async setup(__props) {
    const { token } = useAuthToken();
    const loading = ref(true);
    const adding = ref(false);
    const saving = ref(false);
    const deletingId = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");
    const stats = ref([]);
    const newStat = reactive({
      number: "",
      label: "",
      sort_order: 0
    });
    computed(() => ({
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Stats Editor</h2><p class="text-sm text-slate-600">Manage stat number, label, and order.</p></div>`);
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
      _push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Add Stat</h3><form class="grid gap-3 md:grid-cols-4"><input${ssrRenderAttr("value", unref(newStat).number)} type="text" required placeholder="Number" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newStat).label)} type="text" required placeholder="Label" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", unref(newStat).sort_order)} type="number" min="0" placeholder="Sort order" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><button type="submit"${ssrIncludeBooleanAttr(unref(adding) || unref(loading)) ? " disabled" : ""} class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(adding) ? "Adding..." : "Add Stat")}</button></form></div><div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Stats List</h3><button type="button"${ssrIncludeBooleanAttr(unref(saving) || unref(loading) || unref(stats).length === 0) ? " disabled" : ""} class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">${ssrInterpolate(unref(saving) ? "Saving..." : "Save All Changes")}</button></div>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-slate-500">Loading stats...</div>`);
      } else if (unref(stats).length === 0) {
        _push(`<div class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"> No stats found. </div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(stats), (item, index) => {
          _push(`<div class="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_2fr_120px_110px]"><input${ssrRenderAttr("value", item.number)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.label)} type="text" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><input${ssrRenderAttr("value", item.sort_order)} type="number" min="0" class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"><button type="button"${ssrIncludeBooleanAttr(unref(deletingId) === item.id) ? " disabled" : ""} class="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">${ssrInterpolate(unref(deletingId) === item.id ? "Deleting..." : "Delete")}</button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stats.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=stats-XkQXCj6A.js.map
