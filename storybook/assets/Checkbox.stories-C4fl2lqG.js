import{j as e,M as m,p as d}from"./iframe-Cz6SWQVH.js";import{C as r}from"./Checkbox-BnUOn-UO.js";import{F as p}from"./Flex-CEU13fy6.js";import{L as u}from"./Link-DnGcHR1d.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-bP5tKNLw.js";import"./utils-DdYDv1my.js";import"./useObjectRef-B1XDxt8o.js";import"./FieldError-Cc3YzjP5.js";import"./Text-BGEAm46S.js";import"./useGlobalListeners-_pWc5lzW.js";import"./openLink-yrE7vS55.js";import"./useFormValidation-D_7zkheX.js";import"./Label-ZZaSZ0gq.js";import"./Hidden-DyqXWYJG.js";import"./useField-CoFUr6lr.js";import"./useLabel-C4-PSEwD.js";import"./useLabels-CCt0vcrF.js";import"./useHover-LSx6rYV4.js";import"./useToggle-BjZVMs2Y.js";import"./useFormReset-B0RXVB7U.js";import"./usePress-BeBtVFaO.js";import"./textSelection-CYg68ItS.js";import"./useToggleState-Ce04RfY-.js";import"./useControlledState-DIn6soyg.js";import"./VisuallyHidden-BXPZyn_f.js";import"./index-B8gNhpoB.js";import"./useLink-DCpBATML.js";import"./getNodeText-8mXZv5Ta.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
