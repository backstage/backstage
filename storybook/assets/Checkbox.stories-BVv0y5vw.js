import{a5 as c,j as r}from"./iframe-Yl0Qc67S.js";import{C as o}from"./Checkbox-BqJhh9mk.js";import{F as i}from"./Flex-CNVottU6.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-D6KejDAz.js";import"./utils-BeOnE2ty.js";import"./useObjectRef-B1bL3Spk.js";import"./clsx-B-dksMZM.js";import"./Form-DapWWiBZ.js";import"./useFocusable-wWhtWAm1.js";import"./usePress-CFoQbYZv.js";import"./useToggle-Dy3bsvUQ.js";import"./useFormReset-DQN4NfsY.js";import"./useToggleState-C2gnJomk.js";import"./useControlledState-Ba5xm53c.js";import"./useFocusRing-BU-o61Ng.js";import"./VisuallyHidden-B3651gF8.js";import"./useStyles-DTd0emH8.js";import"./index-CT_LMPAP.js";import"./useSurface-9-qWkMCN.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
