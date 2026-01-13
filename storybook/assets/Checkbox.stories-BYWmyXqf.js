import{a5 as c,j as r}from"./iframe-DFN6SAj3.js";import{C as o}from"./Checkbox-CoSt-O7a.js";import{F as i}from"./Flex-Dc6Fn51M.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-B9rhbHT1.js";import"./utils-Bfjqt0Ay.js";import"./useObjectRef-Dg08NMj-.js";import"./clsx-B-dksMZM.js";import"./Form-B41r19Qw.js";import"./useFocusable-BqV40-mu.js";import"./usePress-vdIMkS3w.js";import"./useToggle-CyWk4YId.js";import"./useFormReset-CQb_uMIr.js";import"./useToggleState-NGf5lFJ8.js";import"./useControlledState-Brt6Ny7j.js";import"./useFocusRing-BJ5ZSrxY.js";import"./VisuallyHidden-LKIi0bVz.js";import"./useStyles-DaQj56o8.js";import"./index-CWKYqCX3.js";import"./useSurface-CpQk2yDD.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
