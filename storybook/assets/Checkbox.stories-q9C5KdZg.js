import{a5 as c,j as r}from"./iframe-CIdfBUNc.js";import{C as o}from"./Checkbox-Ca-6aB2I.js";import{F as i}from"./Flex-BzVtlb2l.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-BprzaPX6.js";import"./utils-Cjmj99xt.js";import"./useObjectRef-DgB1_A6b.js";import"./clsx-B-dksMZM.js";import"./Form-CwTGXXRj.js";import"./useFocusable-CPjX_ZwV.js";import"./usePress-Caq6LyaY.js";import"./useToggleState-Doozm-ZI.js";import"./useFormReset-DfTTI6Xy.js";import"./useControlledState-CeIJUDVt.js";import"./useFocusRing-DlPxtRlU.js";import"./VisuallyHidden-CWRgOWii.js";import"./useStyles-DpbhKiTz.js";import"./index-BHOfiGUs.js";import"./useSurface-Dd5zaFJi.js";const s=c.meta({title:"Backstage UI/Checkbox",component:o}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({...e.input,render:()=>r.jsxs(i,{direction:"column",gap:"2",children:[r.jsx(o,{children:"Unchecked"}),r.jsx(o,{isSelected:!0,children:"Checked"}),r.jsx(o,{isDisabled:!0,children:"Disabled"}),r.jsx(o,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
