import{p as c,j as n}from"./iframe-BJyhMgZx.js";import{C as i}from"./Checkbox-DPRXRfkj.js";import{F as o}from"./Flex-Djm5LFkK.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-K9gQyzYh.js";import"./utils-CJODVg5y.js";import"./useObjectRef-Bd_CBPON.js";import"./clsx-B-dksMZM.js";import"./Form-Dd0LG19A.js";import"./useFocusable-CxQzf9W8.js";import"./usePress-CHFsAR73.js";import"./useToggle-W56ozc7x.js";import"./useFormReset-aW6xpn04.js";import"./useToggleState-D3GMte-l.js";import"./useControlledState-BGZa7SYV.js";import"./useFocusRing-By-PpaS4.js";import"./VisuallyHidden-j4xJkuUF.js";import"./useStyles-BsgyHTwE.js";import"./index-CkbCO-ml.js";import"./useBg-BYWymq_j.js";const s=c.meta({title:"Backstage UI/Checkbox",component:i}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({args:{children:"Select all",isIndeterminate:!0}}),r=s.story({...e.input,render:()=>n.jsxs(o,{direction:"column",gap:"2",children:[n.jsx(i,{children:"Unchecked"}),n.jsx(i,{isSelected:!0,children:"Checked"}),n.jsx(i,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(i,{isDisabled:!0,children:"Disabled"}),n.jsx(i,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(i,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
})`,...r.input.parameters?.docs?.source}}};const U=["Default","Indeterminate","AllVariants"];export{r as AllVariants,e as Default,t as Indeterminate,U as __namedExportsOrder};
