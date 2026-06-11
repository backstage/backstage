import{c7 as o}from"./iframe-BNSLO1vV.js";import{F as n}from"./FieldLabel-CxT1gLPF.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-DzAvhi63.js";import"./utils-BgaqTVim.js";import"./useObjectRef-DfKP_bGf.js";import"./Hidden-BWb7YpQ9.js";import"./Text-B3PwrI6a.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),e=s.story({args:{label:"Label"}}),r=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...e.input.args,description:"Description"}}),a=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label",description:"Description"}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
