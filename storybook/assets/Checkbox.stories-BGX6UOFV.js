import{a5 as c,j as r}from"./iframe-XFwexWAC.js";import{C as o}from"./Checkbox-CgVnZVNW.js";import{F as i}from"./Flex-co0maTwQ.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-BmZjAECZ.js";import"./utils-BXMci-2E.js";import"./useObjectRef-CPNGmagW.js";import"./clsx-B-dksMZM.js";import"./Form-BlPMxtcu.js";import"./useFocusable-BOBd0sIl.js";import"./usePress-BLBZ0uUw.js";import"./useToggle-BgPSeWzQ.js";import"./useFormReset-BHJ6cCzH.js";import"./useToggleState-DYqrTicl.js";import"./useControlledState-BkpLmLgN.js";import"./useFocusRing-DdYOFjST.js";import"./VisuallyHidden-BZsd6DHl.js";import"./useStyles-B0AXU4-2.js";import"./index-CZPp6Bra.js";import"./useSurface-C4iNO07H.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
