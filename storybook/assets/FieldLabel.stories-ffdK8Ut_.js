import{a3 as o}from"./iframe-nUyzSU_S.js";import{F as n}from"./FieldLabel-BHPPNM9X.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-qjQcqYLN.js";import"./utils-rSHFql8M.js";import"./useObjectRef-Bbtl2kU4.js";import"./clsx-B-dksMZM.js";import"./Hidden--2AKNHHj.js";import"./useStyles-CGc-3N3i.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),r=s.story({args:{label:"Label"}}),e=s.story({args:{...r.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...r.input.args,description:"Description"}}),a=s.story({args:{...r.input.args,secondaryLabel:"Secondary Label",description:"Description"}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Label'
  }
})`,...r.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    secondaryLabel: 'Secondary Label'
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const b=["Default","WithSecondaryLabel","WithDescription","WithAllFields"];export{r as Default,a as WithAllFields,t as WithDescription,e as WithSecondaryLabel,b as __namedExportsOrder};
