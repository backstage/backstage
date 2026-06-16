import{c7 as o}from"./iframe-Bm5ba6Eo.js";import{F as n}from"./FieldLabel-BsMPqoVj.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-DY58aZxy.js";import"./utils-6JHcszxz.js";import"./useObjectRef--OGAdRX4.js";import"./Hidden-BsS8bYU7.js";import"./Text-B1aMhdj3.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),e=s.story({args:{label:"Label"}}),r=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...e.input.args,description:"Description"}}),a=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label",description:"Description"}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
