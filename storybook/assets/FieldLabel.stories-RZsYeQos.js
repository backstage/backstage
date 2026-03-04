import{p as o}from"./iframe-DC0HuKGF.js";import{F as n}from"./FieldLabel-B584UmLP.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-DZKGqgzf.js";import"./utils-Cn61JNwH.js";import"./useObjectRef-CUy8bK3M.js";import"./Hidden-KSwhlm6b.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),e=s.story({args:{label:"Label"}}),r=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...e.input.args,description:"Description"}}),a=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label",description:"Description"}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <FieldLabel label="Label" />;
`,...e.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithSecondaryLabel = () => (
  <FieldLabel secondaryLabel="Secondary Label" />
);
`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const WithDescription = () => <FieldLabel description="Description" />;
`,...t.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithAllFields = () => (
  <FieldLabel secondaryLabel="Secondary Label" description="Description" />
);
`,...a.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const b=["Default","WithSecondaryLabel","WithDescription","WithAllFields"];export{e as Default,a as WithAllFields,t as WithDescription,r as WithSecondaryLabel,b as __namedExportsOrder};
