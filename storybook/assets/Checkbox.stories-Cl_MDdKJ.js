import{a5 as c,j as r}from"./iframe-CDMGjht1.js";import{C as o}from"./Checkbox-BUZ0nZrr.js";import{F as i}from"./Flex-D1ckmWJU.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-Mc7HM6rs.js";import"./utils-g0RWddUU.js";import"./useObjectRef-vqxPmU1u.js";import"./clsx-B-dksMZM.js";import"./Form-MyXhU_wj.js";import"./useFocusable-e06xOYAF.js";import"./usePress-CY1aMgW_.js";import"./useToggle-Dj-VeWNw.js";import"./useFormReset-CXaX4OLp.js";import"./useToggleState-BuD_xqf4.js";import"./useControlledState-DSo8XaCD.js";import"./useFocusRing-Bfd5vJzE.js";import"./VisuallyHidden-CAnrpvQ7.js";import"./useStyles-BuXaoLuy.js";import"./index-6ni4X3d6.js";import"./useSurface-BaT7FJzz.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
