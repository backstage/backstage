import{j as e,p as m}from"./iframe-C7lYm63e.js";import{T as l}from"./TestRouter-DYk_Fmku.js";import{C as r}from"./Checkbox-CcNCG7Dn.js";import{F as p}from"./Flex-DrpRYDXu.js";import{L as u}from"./Link-KupkmhiB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-FJv8Tr6k.js";import"./BUIProvider-uNuGl61A.js";import"./Checkbox-De_hO8LF.js";import"./utils-BUzKzuKz.js";import"./useObjectRef-aANnWHv4.js";import"./FieldError-DSs23qmd.js";import"./Text-BaJbPGan.js";import"./Hidden-C01qEBuY.js";import"./useFocusRing-DBYmBdNX.js";import"./Form-zZEEHrPM.js";import"./useFormValidation-DUls_W6A.js";import"./Label-BN9dytpW.js";import"./useField-k9YTPZiv.js";import"./useLabel-CLnEY2ws.js";import"./useLabels-B_JIZiXA.js";import"./useToggle-BvUwGYMk.js";import"./useFormReset-BEQYUo_O.js";import"./usePress-DfP9K6Oc.js";import"./textSelection-DvQ0zR-N.js";import"./getMetaValue-C1Arjnva.js";import"./useSlot-CDPOkF-5.js";import"./useToggleState-DlOPTpZH.js";import"./useControlledState-BNzUk4rc.js";import"./useHover-Dh_5CIee.js";import"./VisuallyHidden-H9cJaS2-.js";import"./index-YLMOL70x.js";import"./useLink-CvF7_JEa.js";import"./getNodeText-DRW1iLZn.js";import"./BUIRoutingProvider-BQOAZjhP.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
