import{p as c,j as n}from"./iframe-ByBrTvma.js";import{C as s}from"./Checkbox-BUTHysno.js";import{F as a}from"./Flex-h9vrKGEc.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-AR8_NMpW.js";import"./utils-DVPuoPwD.js";import"./useObjectRef--wNNAN9F.js";import"./Form-BXCXgtJB.js";import"./useFocusable-DKgeWWm7.js";import"./usePress-DLYRbVvc.js";import"./useToggle-CYys-TZf.js";import"./useFormReset-Cxpb6oTM.js";import"./useToggleState-DTIGogL0.js";import"./useControlledState-ZHat3JP6.js";import"./useFocusRing-GE4j_eMP.js";import"./VisuallyHidden-CBkJXQnf.js";import"./index-sd8Ux2S-.js";const i=c.meta({title:"Backstage UI/Checkbox",component:s}),e=i.story({args:{children:"Accept terms and conditions"}}),t=i.story({args:{children:"Select all",isIndeterminate:!0}}),r=i.story({...e.input,render:()=>n.jsxs(a,{direction:"column",gap:"2",children:[n.jsx(s,{children:"Unchecked"}),n.jsx(s,{isSelected:!0,children:"Checked"}),n.jsx(s,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(s,{isDisabled:!0,children:"Disabled"}),n.jsx(s,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(s,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Indeterminate = () => <Checkbox isIndeterminate>Select all</Checkbox>;
`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const AllVariants = () => (
  <Flex direction="column" gap="2">
    <Checkbox>Unchecked</Checkbox>
    <Checkbox isSelected>Checked</Checkbox>
    <Checkbox isIndeterminate>Indeterminate</Checkbox>
    <Checkbox isDisabled>Disabled</Checkbox>
    <Checkbox isSelected isDisabled>
      Checked & Disabled
    </Checkbox>
    <Checkbox isIndeterminate isDisabled>
      Indeterminate & Disabled
    </Checkbox>
  </Flex>
);
`,...r.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Accept terms and conditions'
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Select all',
    isIndeterminate: true
  }
})`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  ...Default.input,
  render: () => <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
      <Checkbox isIndeterminate isDisabled>
        Indeterminate & Disabled
      </Checkbox>
    </Flex>
})`,...r.input.parameters?.docs?.source}}};const y=["Default","Indeterminate","AllVariants"];export{r as AllVariants,e as Default,t as Indeterminate,y as __namedExportsOrder};
