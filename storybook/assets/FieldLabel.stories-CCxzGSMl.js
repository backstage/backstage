import{a3 as o}from"./iframe-BY8lR-L8.js";import{F as n}from"./FieldLabel-CFAagGUM.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-g_-FIzgL.js";import"./utils-Bfoe0K7S.js";import"./useObjectRef-BqHG6lM5.js";import"./clsx-B-dksMZM.js";import"./Hidden-BOGSyjem.js";import"./useStyles-DPxfsz7Y.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),r=s.story({args:{label:"Label"}}),e=s.story({args:{...r.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...r.input.args,description:"Description"}}),a=s.story({args:{...r.input.args,secondaryLabel:"Secondary Label",description:"Description"}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
