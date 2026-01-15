import{a5 as c,j as r}from"./iframe-C9MahRWh.js";import{C as o}from"./Checkbox-DMCZmCml.js";import{F as i}from"./Flex-uCAvDUYI.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-CXbBlmuv.js";import"./utils-CihhLEPA.js";import"./useObjectRef-ZyJjxF3k.js";import"./clsx-B-dksMZM.js";import"./Form-CCqm_2ta.js";import"./useFocusable-BxBTINdj.js";import"./usePress-D3t2rjAm.js";import"./useToggle-mWeWuyIj.js";import"./useFormReset-CSNKtU7Y.js";import"./useToggleState-D7NTpPN4.js";import"./useControlledState-DAZtEiJa.js";import"./useFocusRing-h-EBRLdi.js";import"./VisuallyHidden-8kms9qlt.js";import"./useStyles-dPvM8hXG.js";import"./index-xrcBWgHF.js";import"./useSurface-CzmEEkbu.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const AllVariants = () => (
  <Flex direction="column" gap="2">
    <Checkbox>Unchecked</Checkbox>
    <Checkbox isSelected>Checked</Checkbox>
    <Checkbox isDisabled>Disabled</Checkbox>
    <Checkbox isSelected isDisabled>
      Checked & Disabled
    </Checkbox>
  </Flex>
);
`,...t.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Accept terms and conditions'
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  ...Default.input,
  render: () => <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
    </Flex>
})`,...t.input.parameters?.docs?.source}}};const U=["Default","AllVariants"];export{t as AllVariants,e as Default,U as __namedExportsOrder};
