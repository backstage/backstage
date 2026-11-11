import{j as e,p as m}from"./iframe-CEdcshkh.js";import{T as l}from"./TestRouter-BPsjLese.js";import{C as r}from"./Checkbox-DjHcFjhc.js";import{F as p}from"./Flex-STDf9iYN.js";import{L as u}from"./Link-CqmJVQEw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BMdILVLE.js";import"./BUIProvider-BnOYjhiQ.js";import"./Checkbox-BHdU5FNT.js";import"./utils-B3z3rPQ3.js";import"./useObjectRef-Cea8mF9S.js";import"./FieldError-Ry11NBFn.js";import"./Text-CBxuRi-e.js";import"./Hidden-nn8Lz43U.js";import"./useFocusRing-CKR_B2iC.js";import"./Form-C1TWgvPe.js";import"./useFormValidation-DNL4ciTO.js";import"./Label-9Olhdt6S.js";import"./useField-qlQhlPsk.js";import"./useLabel-BWFl0EGX.js";import"./useLabels-B11tK9ex.js";import"./useToggle-Be2mjIWi.js";import"./useFormReset-DV0mYMiO.js";import"./usePress-CLU-UWu1.js";import"./textSelection-WSwNKXEc.js";import"./getMetaValue-BMvIIQYf.js";import"./useSlot-R1Dj_Chb.js";import"./useToggleState-CZ7eWlO4.js";import"./useControlledState-CY36eiiU.js";import"./useHover-C0ptGV0J.js";import"./VisuallyHidden-Co8SnzJt.js";import"./index-Bowgs7Nu.js";import"./useLink-RRxHq4ZS.js";import"./getNodeText-CxpOAKrb.js";import"./BUIRoutingProvider-C_K9tmxr.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
