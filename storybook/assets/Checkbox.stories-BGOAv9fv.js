import{p as c,j as n}from"./iframe-DsSIhbnH.js";import{C as s}from"./Checkbox-wtjJ0DNH.js";import{F as a}from"./Flex-CRu1-K-5.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-CfyNXN6S.js";import"./utils-CvT5fIF8.js";import"./useObjectRef-DQRQLV-W.js";import"./Form-qWZbw0Ut.js";import"./useFocusable-Cl25xWdw.js";import"./usePress-DlWdiVIq.js";import"./useToggle-BVkkMJxd.js";import"./useFormReset-BPQtdjzR.js";import"./useToggleState-DuUrebVT.js";import"./useControlledState-nsfjOaxZ.js";import"./useFocusRing-DNG6HILo.js";import"./VisuallyHidden-D-uHk63X.js";import"./index-Bsjc_baw.js";const i=c.meta({title:"Backstage UI/Checkbox",component:s}),e=i.story({args:{children:"Accept terms and conditions"}}),t=i.story({args:{children:"Select all",isIndeterminate:!0}}),r=i.story({...e.input,render:()=>n.jsxs(a,{direction:"column",gap:"2",children:[n.jsx(s,{children:"Unchecked"}),n.jsx(s,{isSelected:!0,children:"Checked"}),n.jsx(s,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(s,{isDisabled:!0,children:"Disabled"}),n.jsx(s,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(s,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Indeterminate = () => <Checkbox isIndeterminate>Select all</Checkbox>;
`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const AllVariants = () => (
  <Flex direction="column" gap="2">
    <Checkbox>Unchecked</Checkbox>
    <Checkbox isSelected>Checked</Checkbox>
    <Checkbox isIndeterminate>Indeterminate</Checkbox>
    <Checkbox isDisabled>Disabled</Checkbox>
    <Checkbox isSelected isDisabled>
      Checked & Disabled
    </Checkbox>
    <Checkbox isIndeterminate isDisabled>
      Indeterminate & Disabled
    </Checkbox>
  </Flex>
);
`,...r.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Accept terms and conditions'
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Select all',
    isIndeterminate: true
  }
})`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  ...Default.input,
  render: () => <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
      <Checkbox isIndeterminate isDisabled>
        Indeterminate & Disabled
      </Checkbox>
    </Flex>
})`,...r.input.parameters?.docs?.source}}};const y=["Default","Indeterminate","AllVariants"];export{r as AllVariants,e as Default,t as Indeterminate,y as __namedExportsOrder};
