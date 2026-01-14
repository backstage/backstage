import{a5 as c,j as r}from"./iframe-OUC1hy1H.js";import{C as o}from"./Checkbox-BPP2tKxP.js";import{F as i}from"./Flex-BhlKuQ9v.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-DTR_CgGN.js";import"./utils-DXBqo5Xm.js";import"./useObjectRef-6gXwUxt0.js";import"./clsx-B-dksMZM.js";import"./Form-CRz3e8en.js";import"./useFocusable-TT6djGBW.js";import"./usePress-wO8QA_B4.js";import"./useToggle-BwfQSQJo.js";import"./useFormReset-CTJRwYEg.js";import"./useToggleState-BaUXBUSS.js";import"./useControlledState-Cm9f7dTu.js";import"./useFocusRing-DYgZMWSG.js";import"./VisuallyHidden-Ei8gg8WB.js";import"./useStyles-BaONCSkE.js";import"./index-D4oTCeTJ.js";import"./useSurface-B0ayTmJO.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
