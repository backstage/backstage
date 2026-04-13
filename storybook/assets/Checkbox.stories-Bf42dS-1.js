import{j as e,M as m,p as d}from"./iframe-DgHKkkyr.js";import{C as r}from"./Checkbox-BjR0wfDW.js";import{F as p}from"./Flex-C1C4BYK1.js";import{L as u}from"./Link-3vKfxsv2.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-BpYxsdfF.js";import"./utils-C1o7BLsy.js";import"./useObjectRef-DMH-GBhM.js";import"./FieldError-diMKG1Az.js";import"./Text-Br96A3dM.js";import"./useFocusable-B6BeVSwN.js";import"./openLink-iVgFRcvl.js";import"./Form-xwKRiiJQ.js";import"./Label-DFt2BgeJ.js";import"./Hidden-DNRCN_ic.js";import"./useControlledState-CkXk69k2.js";import"./useField-C-krdq7-.js";import"./useLabel-RftGCJTm.js";import"./useLabels-BOBl8S-u.js";import"./useFocusRing-qkMzq-Jc.js";import"./usePress-yYF-Bh9Q.js";import"./textSelection-DDomQQoV.js";import"./useToggle-Bh0o0bdP.js";import"./useFormReset-CGr6igTR.js";import"./useToggleState-BBlwfYf6.js";import"./VisuallyHidden-DFvP1mHt.js";import"./index-DXCmj24P.js";import"./getNodeText-B4ekQBTF.js";import"./useLink-BrQ1SlEe.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Accept terms and conditions'
  }
})`,...t.input.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isSelected: true
  }
})`,...i.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Select all',
    isIndeterminate: true
  }
})`,...o.input.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    children: <>
        I agree to receive future communication from Spotify. You may
        unsubscribe from these communications at any time. Please review our{' '}
        <Link href="#">Privacy Policy</Link>
      </>
  },
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>]
})`,...s.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};const O=["Default","Selected","Indeterminate","WithLongText","AllVariants"];export{n as AllVariants,t as Default,o as Indeterminate,i as Selected,s as WithLongText,O as __namedExportsOrder};
