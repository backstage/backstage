import{j as e,M as m,p as d}from"./iframe-BZbCHoUM.js";import{C as r}from"./Checkbox-BczJ3oUt.js";import{F as p}from"./Flex-rox4gXnr.js";import{L as u}from"./Link-B1mBQo61.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-CQVxt2S3.js";import"./utils-CfGZ4Clr.js";import"./useObjectRef-FeXUk1rj.js";import"./FieldError-Z5lKC_c2.js";import"./Text-CsQJ0nka.js";import"./useFocusable-DMHJR1Ta.js";import"./openLink-DkamvTea.js";import"./Form-C0o4Wn_y.js";import"./Label-CwnVjHYj.js";import"./Hidden-DEC4QRIi.js";import"./useControlledState-_Te7eGF7.js";import"./useField-1di9YIwZ.js";import"./useLabel-BQGxIH3x.js";import"./useLabels-6Oae5x4h.js";import"./useFocusRing-CMSP-eLx.js";import"./usePress-CX5VBNce.js";import"./textSelection-D1bI-xuP.js";import"./useToggle-81cdq2p3.js";import"./useFormReset-B9RadbxB.js";import"./useToggleState-C2OnmQpm.js";import"./VisuallyHidden-B7i-zuNG.js";import"./index-BtTsKq3m.js";import"./getNodeText-BIXcWHu3.js";import"./useLink-C05zYM09.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
