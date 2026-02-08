import{p as c,j as n}from"./iframe-BVVWNhNF.js";import{C as i}from"./Checkbox-Bk-yrxAk.js";import{F as o}from"./Flex-CS50wTtA.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-h7q-5nVd.js";import"./utils-CjiodjOE.js";import"./useObjectRef-DqEMLz3o.js";import"./clsx-B-dksMZM.js";import"./Form-BpV6zGov.js";import"./useFocusable-BBTko2GO.js";import"./usePress-CkQSniU6.js";import"./useToggle-D1CWIJbp.js";import"./useFormReset-D5TcqgWE.js";import"./useToggleState-y3OjLH8U.js";import"./useControlledState-BKeT2ue2.js";import"./useFocusRing-Dn5s9iSo.js";import"./VisuallyHidden-Bx7xoxSl.js";import"./useStyles-C0OCQ1xE.js";import"./index-BEqd7C-9.js";import"./useSurface-XvOdfZQa.js";const s=c.meta({title:"Backstage UI/Checkbox",component:i}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({args:{children:"Select all",isIndeterminate:!0}}),r=s.story({...e.input,render:()=>n.jsxs(o,{direction:"column",gap:"2",children:[n.jsx(i,{children:"Unchecked"}),n.jsx(i,{isSelected:!0,children:"Checked"}),n.jsx(i,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(i,{isDisabled:!0,children:"Disabled"}),n.jsx(i,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(i,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
