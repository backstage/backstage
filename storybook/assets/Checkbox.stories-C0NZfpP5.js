import{j as e,M as m,p as d}from"./iframe-K1-r__6v.js";import{C as r}from"./Checkbox-vXTLwMhf.js";import{F as p}from"./Flex-BGhbGwKu.js";import{L as u}from"./Link-wbxVzVd-.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-CJyB13tu.js";import"./utils-CmXvhRmv.js";import"./useObjectRef-B6g01Sss.js";import"./FieldError-CnXsXmD3.js";import"./Text-NxcU8Wst.js";import"./useGlobalListeners-hYY01nOS.js";import"./openLink-Buy5e0wx.js";import"./useFormValidation-DCdCyMkZ.js";import"./Label-DB_fk5tK.js";import"./Hidden-Bruv6eby.js";import"./useField-DPkfUDN-.js";import"./useLabel-DIPqeGbV.js";import"./useLabels-WOLYX76B.js";import"./useHover-BjUJEgQT.js";import"./useToggle-BEf7ENWW.js";import"./useFormReset-Cvno6jO2.js";import"./usePress-DFgFgQIS.js";import"./textSelection-DEpXXoD2.js";import"./useToggleState-Dy2cvaSc.js";import"./useControlledState-Dy4k5Q4V.js";import"./VisuallyHidden-BRIhty-1.js";import"./index-qh46O5KH.js";import"./useLink-C8uP6D0g.js";import"./getNodeText-CULtpH0y.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
