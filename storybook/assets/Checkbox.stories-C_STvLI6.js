import{a5 as a,j as n}from"./iframe-Du4yWFmh.js";import{C as i}from"./Checkbox-D3iogoGg.js";import{F as c}from"./Flex-DXAsyrg5.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-D_Pwck-t.js";import"./utils-z8eUZOh4.js";import"./useObjectRef-CiRgIA98.js";import"./clsx-B-dksMZM.js";import"./Form-CDIuxWPj.js";import"./useFocusable-Dw78h-Dw.js";import"./usePress-qtOIFA-H.js";import"./useToggle-CzDpGD2D.js";import"./useFormReset-CL6tHrdH.js";import"./useToggleState-CbkSPG-t.js";import"./useControlledState-Ck_KVpu8.js";import"./useFocusRing-BvDmeMSb.js";import"./VisuallyHidden-CWR07G8S.js";import"./useStyles-BKv47l2R.js";import"./index-CKR81--4.js";import"./useSurface-BX-jw8YI.js";const s=a.meta({title:"Backstage UI/Checkbox",component:i}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({args:{children:"Select all",isIndeterminate:!0}}),r=s.story({...e.input,render:()=>n.jsxs(c,{direction:"column",gap:"2",children:[n.jsx(i,{children:"Unchecked"}),n.jsx(i,{isSelected:!0,children:"Checked"}),n.jsx(i,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(i,{isDisabled:!0,children:"Disabled"}),n.jsx(i,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(i,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
