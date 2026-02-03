import{p as o}from"./iframe-DCoYcZLi.js";import{F as n}from"./FieldLabel-Dw6-eSR1.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-7c12Iu8r.js";import"./utils-DTcf5UEk.js";import"./useObjectRef-D3vbS5Y8.js";import"./clsx-B-dksMZM.js";import"./Hidden-BlaKfu8H.js";import"./useStyles-ChMkDXL5.js";const s=o.meta({title:"Backstage UI/FieldLabel",component:n,argTypes:{label:{control:"text"},secondaryLabel:{control:"text"},description:{control:"text"}}}),e=s.story({args:{label:"Label"}}),r=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label"}}),t=s.story({args:{...e.input.args,description:"Description"}}),a=s.story({args:{...e.input.args,secondaryLabel:"Secondary Label",description:"Description"}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithSecondaryLabel = () => (
  <FieldLabel secondaryLabel="Secondary Label" />
);
`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const WithDescription = () => <FieldLabel description="Description" />;
`,...t.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithAllFields = () => (
  <FieldLabel secondaryLabel="Secondary Label" description="Description" />
);
`,...a.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <FieldLabel label="Label" />;
`,...e.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const L=["Default","WithSecondaryLabel","WithDescription","WithAllFields"];export{e as Default,a as WithAllFields,t as WithDescription,r as WithSecondaryLabel,L as __namedExportsOrder};
