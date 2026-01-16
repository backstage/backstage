import{a5 as c,j as r}from"./iframe-C6d4amxQ.js";import{C as o}from"./Checkbox-AjltE5Ap.js";import{F as i}from"./Flex-DGPM7qa0.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-DeKi_UsZ.js";import"./utils-DRy6VmO7.js";import"./useObjectRef-B5GZXDW0.js";import"./clsx-B-dksMZM.js";import"./Form-CkCxphb4.js";import"./useFocusable-B90010hl.js";import"./usePress-C8yhIAMV.js";import"./useToggle-D8DqLBcb.js";import"./useFormReset-DWLF2Mfl.js";import"./useToggleState-BhraZCa7.js";import"./useControlledState-CwXHRP4N.js";import"./useFocusRing-BCJ8GMHx.js";import"./VisuallyHidden-B9JFLlPf.js";import"./useStyles-C22yXYNB.js";import"./index-CYxMMw0t.js";import"./useSurface-B8xS8R2h.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
