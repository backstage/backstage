import{p as c,j as n}from"./iframe-ONoB0Qo9.js";import{C as s}from"./Checkbox-BtoZuFOT.js";import{F as a}from"./Flex-CzJO0d_S.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-CsE8m9hT.js";import"./utils-C0L7HmJb.js";import"./useObjectRef-BjBF7qN0.js";import"./Form-DGijzmBE.js";import"./useFocusable-DXwAWiZ4.js";import"./usePress-DsLeQCJY.js";import"./useToggle-LtVXQubO.js";import"./useFormReset-B8pfPsG-.js";import"./useToggleState-BtAvttUC.js";import"./useControlledState-DArmUX94.js";import"./useFocusRing-DpnfyjqI.js";import"./VisuallyHidden-DtNo17fb.js";import"./index-CIcAZJwc.js";const i=c.meta({title:"Backstage UI/Checkbox",component:s}),e=i.story({args:{children:"Accept terms and conditions"}}),t=i.story({args:{children:"Select all",isIndeterminate:!0}}),r=i.story({...e.input,render:()=>n.jsxs(a,{direction:"column",gap:"2",children:[n.jsx(s,{children:"Unchecked"}),n.jsx(s,{isSelected:!0,children:"Checked"}),n.jsx(s,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(s,{isDisabled:!0,children:"Disabled"}),n.jsx(s,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(s,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
