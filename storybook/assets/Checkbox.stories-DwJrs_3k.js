import{a5 as c,j as r}from"./iframe-Ca4Oq2uP.js";import{C as o}from"./Checkbox-tM52A3L5.js";import{F as i}from"./Flex-TOG5ziby.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-DR79pxJq.js";import"./utils-DEZshG7d.js";import"./useObjectRef-CB65SFGL.js";import"./clsx-B-dksMZM.js";import"./Form-DnRblSMI.js";import"./useFocusable-IT2TkDoO.js";import"./usePress-D0b8XIhO.js";import"./useToggle-DhfCX9b2.js";import"./useFormReset-DoRAso_Q.js";import"./useToggleState-DXXV9i8x.js";import"./useControlledState-CVMd6NZc.js";import"./useFocusRing-BA1_VAM0.js";import"./VisuallyHidden-B55ID6q_.js";import"./useStyles-Xm-dqPrh.js";import"./index-DjOdc2i5.js";import"./useSurface-D72tqHyz.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
