import{a5 as c,j as r}from"./iframe-BY6cr4Gs.js";import{C as o}from"./Checkbox-C4eaRxuP.js";import{F as i}from"./Flex-DMuGPxbV.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-BFBefURi.js";import"./utils-C2CAx66-.js";import"./useObjectRef-c-KjL6Jx.js";import"./clsx-B-dksMZM.js";import"./Form-DfngdZI2.js";import"./useFocusable-aK4x0Gji.js";import"./usePress-DZVjaikz.js";import"./useToggleState-Dpi9D2Hv.js";import"./useFormReset-Cpyf9gDh.js";import"./useControlledState-oiZqNchG.js";import"./useFocusRing-17ZDvobQ.js";import"./VisuallyHidden-lozZtEtH.js";import"./useStyles-D8_XTlHG.js";import"./index-B8WXLTiw.js";import"./useSurface-yfTL8fH4.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
