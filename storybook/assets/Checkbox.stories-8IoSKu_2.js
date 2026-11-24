import{j as e,p as m}from"./iframe-4nxqZpQH.js";import{T as l}from"./TestRouter-CcRgr-w9.js";import{C as r}from"./Checkbox-BgJFVU-u.js";import{F as p}from"./Flex-DyLW1vPM.js";import{L as u}from"./Link-BzTCTbm1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CKs39xo2.js";import"./BUIProvider-uTHUz88Y.js";import"./Checkbox-CSSJWrFz.js";import"./utils-B_CpPLsC.js";import"./useObjectRef-CnTOzlP3.js";import"./FieldError-BXBChgnT.js";import"./Text-CLYtJTsR.js";import"./Hidden-BHEINN-B.js";import"./useFocusRing-DLLTypMY.js";import"./Form-CqRLvZ1x.js";import"./useFormValidation-ZZF8mbB2.js";import"./Label-DFDy7rWc.js";import"./useField-C-Ng_aIY.js";import"./useLabel-B3SXQ9nf.js";import"./useLabels-LZrLLl2Z.js";import"./useToggle-PVe-UNVs.js";import"./useFormReset-0ATPKRb6.js";import"./usePress-IehbRc7n.js";import"./textSelection-BqsoCXBu.js";import"./getMetaValue-yJ3DJPKd.js";import"./useSlot-DLyjaoDZ.js";import"./useToggleState-CTSvPk_b.js";import"./useControlledState-BipTuFfk.js";import"./useHover-6QHjRx59.js";import"./VisuallyHidden-DBTOudP9.js";import"./index-CS0rKBQt.js";import"./useLink-8qNQubjm.js";import"./getNodeText-CyElTUXt.js";import"./BUIRoutingProvider-Du5oqrd5.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Accept terms and conditions'
  }
})`,...t.input.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isSelected: true
  }
})`,...i.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Select all',
    isIndeterminate: true
  }
})`,...n.input.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    children: <>
        I agree to receive future communication from Spotify. You may
        unsubscribe from these communications at any time. Please review our{' '}
        <Link href="#">Privacy Policy</Link>
      </>
  },
  decorators: [Story => <TestRouter>
        <Story />
      </TestRouter>]
})`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isInvalid: true
  }
})`,...o.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
      <Checkbox isInvalid>Invalid</Checkbox>
      <Checkbox isInvalid isSelected>
        Invalid & Checked
      </Checkbox>
      <Checkbox isInvalid isIndeterminate>
        Invalid & Indeterminate
      </Checkbox>
    </Flex>
})`,...a.input.parameters?.docs?.source}}};const N=["Default","Selected","Indeterminate","WithLongText","Invalid","AllVariants"];export{a as AllVariants,t as Default,n as Indeterminate,o as Invalid,i as Selected,s as WithLongText,N as __namedExportsOrder};
