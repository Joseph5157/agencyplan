import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { b as useRouter, u as useAuthToken } from "../server.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/hookable/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/unctx/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/defu/dist/defu.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ufo/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuthToken();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600" }, _attrs))}> Redirecting... </section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DZl_UxNT.js.map
