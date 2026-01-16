import{a5 as c,j as r}from"./iframe-Ck0aXmTM.js";import{C as o}from"./Checkbox-CPxQs_rs.js";import{F as i}from"./Flex-DGVWx5GN.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-Bc2tbclH.js";import"./utils-BKcBjnI_.js";import"./useObjectRef-D54-8PME.js";import"./clsx-B-dksMZM.js";import"./Form-BuHNYWbm.js";import"./useFocusable-WTZoCm2H.js";import"./usePress-CHviOG3r.js";import"./useToggle-jITF1TsC.js";import"./useFormReset-OlLw2Trg.js";import"./useToggleState-Dfy2Xi6h.js";import"./useControlledState-0PQcH5h_.js";import"./useFocusRing-iDk4ftSs.js";import"./VisuallyHidden-DOLlVljx.js";import"./useStyles-B2FfO8n9.js";import"./index-CvBPsL2U.js";import"./useSurface-BgUPzxgv.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
