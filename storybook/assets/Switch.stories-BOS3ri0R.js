import{p as s}from"./iframe-B0Lf5NUM.js";import{S as a}from"./Switch-OJkIqt42.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DYNAarSH.js";import"./useObjectRef-eQOs6aiX.js";import"./useFocusable-DMTulX_a.js";import"./useToggleState-Btzx7w7U.js";import"./useControlledState-BzJtkQyr.js";import"./useToggle-CKm-Uuzm.js";import"./useFormReset-CleyXfWu.js";import"./usePress-CTVp0PAp.js";import"./useFocusRing-uJf3WHxy.js";import"./VisuallyHidden-5kzsupEZ.js";const e=s.meta({title:"Backstage UI/Switch",component:a}),t=e.story({args:{label:"Switch"}}),r=e.story({args:{...t.input.args,isDisabled:!0}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Default = () => <Switch label="Switch" />;
`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Disabled = () => <Switch isDisabled />;
`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Switch'
  }
})`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...r.input.parameters?.docs?.source}}};const w=["Default","Disabled"];export{t as Default,r as Disabled,w as __namedExportsOrder};
