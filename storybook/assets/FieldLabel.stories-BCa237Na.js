import{c7 as o}from"./iframe-BHoENCVc.js";import{F as n}from"./FieldLabel-Dvq-CEbN.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-DlD4XAby.js";import"./utils-CL0Z8V1C.js";import"./useObjectRef-uSeYP5xn.js";import"./Hidden-C6_e4Tzz.js";import"./Text-C8x2cVH5.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),e=s.story({args:{label:"Label"}}),r=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...e.input.args,description:"Description"}}),a=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label",description:"Description"}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Label'
  }
})`,...e.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    secondaryLabel: 'Secondary Label'
  }
})`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    description: 'Description'
  }
})`,...t.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    secondaryLabel: 'Secondary Label',
    description: 'Description'
  }
})`,...a.input.parameters?.docs?.source}}};const y=["Default","WithSecondaryLabel","WithDescription","WithAllFields"];export{e as Default,a as WithAllFields,t as WithDescription,r as WithSecondaryLabel,y as __namedExportsOrder};
