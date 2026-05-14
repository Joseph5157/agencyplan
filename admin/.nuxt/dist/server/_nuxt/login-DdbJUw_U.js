import { defineComponent, mergeProps, useSSRContext, ref, withCtx, unref, withDirectives, createVNode, isRef, vModelText } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrRenderComponent, ssrIncludeBooleanAttr } from "vue/server-renderer";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/hookable/dist/index.mjs";
import { b as useRouter, u as useAuthToken } from "../server.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/unctx/dist/index.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/defu/dist/defu.mjs";
import "C:/Users/sikha/Music/Schoolweb/admin/node_modules/ufo/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormField",
  __ssrInlineRender: true,
  props: {
    label: {},
    forId: {},
    hint: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-1" }, _attrs))}>`);
      if (__props.forId) {
        _push(`<label${ssrRenderAttr("for", __props.forId)} class="block text-sm font-medium text-slate-700">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<label class="block text-sm font-medium text-slate-700">${ssrInterpolate(__props.label)}</label>`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (__props.hint) {
        _push(`<p class="text-xs text-slate-500">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormField.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuthToken();
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = _sfc_main$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm" }, _attrs))}><h2 class="mb-5 text-xl font-semibold text-slate-900">Admin Login</h2><form class="space-y-4">`);
      _push(ssrRenderComponent(_component_FormField, {
        label: "Email",
        "for-id": "email"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<input id="email"${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="admin@school.com"${_scopeId}>`);
          } else {
            return [
              withDirectives(createVNode("input", {
                id: "email",
                "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                type: "email",
                autocomplete: "email",
                required: "",
                class: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2",
                placeholder: "admin@school.com"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, unref(email)]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        label: "Password",
        "for-id": "password"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<input id="password"${ssrRenderAttr("value", unref(password))} type="password" autocomplete="current-password" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2" placeholder="Enter password"${_scopeId}>`);
          } else {
            return [
              withDirectives(createVNode("input", {
                id: "password",
                "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                type: "password",
                autocomplete: "current-password",
                required: "",
                class: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2",
                placeholder: "Enter password"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, unref(password)]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(errorMessage)) {
        _push(`<p class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">${ssrInterpolate(unref(loading) ? "Signing in..." : "Login")}</button></form></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-DdbJUw_U.js.map
