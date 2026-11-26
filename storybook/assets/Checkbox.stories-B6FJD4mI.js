import{j as e,p as m}from"./iframe-7sCYbwMA.js";import{T as l}from"./TestRouter-CIUVCPAh.js";import{C as r}from"./Checkbox-vcRqXlFS.js";import{F as p}from"./Flex-CmyHw2X8.js";import{L as u}from"./Link-ItuZ1RPU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CohR7ztA.js";import"./BUIProvider-D7bQEjvA.js";import"./Checkbox-qe8QYxWw.js";import"./utils-9GxVsiDp.js";import"./useObjectRef-B-PPvPC_.js";import"./FieldError-D7hchg2Y.js";import"./Text-CuaSCD0n.js";import"./Hidden-CI0OECmE.js";import"./useFocusRing-DtQAi71R.js";import"./Form-DLTQ6Zj9.js";import"./useFormValidation-DK3qTci6.js";import"./Label-LRQoVPax.js";import"./useField-BPHR2NpW.js";import"./useLabel-BFjYAAvj.js";import"./useLabels-BJlFaWLE.js";import"./useToggle-CA8E8VvO.js";import"./useFormReset-CeH0vvgE.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./getMetaValue-BOiM-Q3U.js";import"./useSlot-DfaCEt7q.js";import"./useToggleState-CKHg7kRn.js";import"./useControlledState-C8ScjM6r.js";import"./useHover-Bvne2y_8.js";import"./VisuallyHidden-BbBCn6_h.js";import"./index-DXJUlwCm.js";import"./useLink-C7y3xXYf.js";import"./getNodeText-HaqtCM3s.js";import"./BUIRoutingProvider-DiU1oZiY.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
