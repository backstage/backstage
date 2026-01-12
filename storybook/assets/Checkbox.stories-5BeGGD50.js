import{a5 as c,j as r}from"./iframe-C8yOC2Gz.js";import{C as o}from"./Checkbox-C_OXWnR5.js";import{F as i}from"./Flex-arqN7lW6.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-BuW_aY7-.js";import"./utils-Bx2t-JSx.js";import"./useObjectRef-B28ZJtJV.js";import"./clsx-B-dksMZM.js";import"./Form-BeYU7OAG.js";import"./useFocusable-Cf-uba3q.js";import"./usePress-DlLbwG62.js";import"./useToggleState-7KOUQ1k_.js";import"./useFormReset-TWxaP-8z.js";import"./useControlledState-3OIQq_AY.js";import"./useFocusRing-9VATBKEW.js";import"./VisuallyHidden-Db8cAXyC.js";import"./useStyles-Cp2nr9ip.js";import"./index-BPNZKYTF.js";import"./useSurface-HU3pbKvv.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
})`,...t.input.parameters?.docs?.source}}};const y=["Default","AllVariants"];export{t as AllVariants,e as Default,y as __namedExportsOrder};
