import{p as c,j as n}from"./iframe-B4O_Vvag.js";import{C as i}from"./Checkbox-BMU-H9RX.js";import{F as o}from"./Flex-DL9kzdGj.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-DNHslYeX.js";import"./utils-BENsA-lB.js";import"./useObjectRef-Bvh4YNkm.js";import"./clsx-B-dksMZM.js";import"./Form-B1-i5xkM.js";import"./useFocusable-BPSneng5.js";import"./usePress-C5C4AmA-.js";import"./useToggle-C0kvcgZr.js";import"./useFormReset-DxUa47oL.js";import"./useToggleState-DgYAqSmm.js";import"./useControlledState-BiVj55vi.js";import"./useFocusRing-BdOt1jSy.js";import"./VisuallyHidden-081LukEm.js";import"./useStyles-DgI5Bf2V.js";import"./index-DK6eZkSW.js";import"./useBg-u6nYS1uL.js";const s=c.meta({title:"Backstage UI/Checkbox",component:i}),e=s.story({args:{children:"Accept terms and conditions"}}),t=s.story({args:{children:"Select all",isIndeterminate:!0}}),r=s.story({...e.input,render:()=>n.jsxs(o,{direction:"column",gap:"2",children:[n.jsx(i,{children:"Unchecked"}),n.jsx(i,{isSelected:!0,children:"Checked"}),n.jsx(i,{isIndeterminate:!0,children:"Indeterminate"}),n.jsx(i,{isDisabled:!0,children:"Disabled"}),n.jsx(i,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),n.jsx(i,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{code:`const Default = () => <Checkbox>Accept terms and conditions</Checkbox>;
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
})`,...r.input.parameters?.docs?.source}}};const U=["Default","Indeterminate","AllVariants"];export{r as AllVariants,e as Default,t as Indeterminate,U as __namedExportsOrder};
