import{j as e,M as m,p as d}from"./iframe-V0mCSmm6.js";import{C as r}from"./Checkbox-BOOoVXrh.js";import{F as p}from"./Flex-BJTDjKle.js";import{L as u}from"./Link-B86kRGwZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-Dgvwipnh.js";import"./utils-BDE85oZ4.js";import"./useObjectRef-Ds30v8Tp.js";import"./FieldError-dAo41XPK.js";import"./Text-Cn_gwYjP.js";import"./useGlobalListeners-CKMdmYgV.js";import"./openLink-C69Yx9MB.js";import"./useFormValidation-B26hhFpA.js";import"./Label-Cr8bMF7C.js";import"./Hidden-CLW6bt9s.js";import"./useField-DGxVmDro.js";import"./useLabel-CR4CoWQK.js";import"./useLabels-Bih5Ckwh.js";import"./useHover-CFiSx20A.js";import"./useToggle--2SQ9FYL.js";import"./useFormReset-CId3_isl.js";import"./usePress-CfPKhABG.js";import"./textSelection-UrLfp6UX.js";import"./useToggleState-DcHbSI5k.js";import"./useControlledState-MEnSdpzT.js";import"./VisuallyHidden-BsZWsydh.js";import"./index-B_QuoT2r.js";import"./useLink-BJETQYI9.js";import"./getNodeText-CN4JKa7F.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
