import { defineComponent, useModel, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ImageUploader",
  __ssrInlineRender: true,
  props: {
    "modelValue": { default: null },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}><input type="file" accept="image/*" class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Placeholder uploader for upcoming section forms.</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageUploader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=ImageUploader-DuMTDa-I.js.map
