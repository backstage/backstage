import{a5 as c,j as r}from"./iframe-C0ztlCqi.js";import{C as o}from"./Checkbox-CCrxgA9j.js";import{F as i}from"./Flex-B9_ax4iV.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-CRqlmdBJ.js";import"./utils-B9M6naxZ.js";import"./useObjectRef-BAHpeK2Q.js";import"./clsx-B-dksMZM.js";import"./Form-BLhOaFKt.js";import"./useFocusable-p9KH-L6o.js";import"./usePress-fHIUjFT4.js";import"./useToggleState-Cv0TBcAa.js";import"./useFormReset-MnwCBEfI.js";import"./useControlledState-DKD8Bzg_.js";import"./useFocusRing-CLfDArqe.js";import"./VisuallyHidden-Be1RBRhL.js";import"./useStyles-bcBiCLvk.js";import"./index-CIEZIaXg.js";import"./useSurface-BpKxdcc1.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
