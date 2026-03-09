import{p as c,j as n}from"./iframe-CmjKepAK.js";import{C as s}from"./Checkbox-B_5APaWE.js";import{F as a}from"./Flex-XhQCKILq.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-C7R5vruM.js";import"./utils-BLjzFbxQ.js";import"./useObjectRef-wNfcOk9o.js";import"./Form-6YUaAIWS.js";import"./useFocusable-DciIC6-l.js";import"./usePress-sWzTYTTH.js";import"./useToggle-CuTffP1r.js";import"./useFormReset-BeWNeuT1.js";import"./useToggleState-COd3ZNRm.js";import"./useControlledState-Dmk4BK0H.js";import"./useFocusRing-DI1Zlt6u.js";import"./VisuallyHidden-D6a9eejr.js";import"./index-BgA8Plen.js";const i=c.meta({title:"Backstage UI/Checkbox",component:s}),e=i.story({args:{children:"Accept terms and conditions"}}),t=i.story({args:{children:"Select all",isIndeterminate:!0}}),r=i.story({...e.input,render:()=>n.jsxs(a,{direction:"column",gap:"2",children:[n.jsx(s,{children:"Unchecked"}),n.jsx(s,{isSelected:!0,children:"Checked"}),n.jsx(s,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(s,{isDisabled:!0,children:"Disabled"}),n.jsx(s,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(s,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
