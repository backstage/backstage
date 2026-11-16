import{j as e,p as m}from"./iframe-BKMB85pu.js";import{T as l}from"./TestRouter-6Wo-4mB3.js";import{C as r}from"./Checkbox-B8Hr8RWw.js";import{F as p}from"./Flex-QbSvYD_g.js";import{L as u}from"./Link-Ci5rjCg4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DT_vTdsS.js";import"./BUIProvider-DtnM-lk2.js";import"./Checkbox-Ck1QOpmQ.js";import"./utils-Nyu7VTFu.js";import"./useObjectRef-CqnWYM4T.js";import"./FieldError-DJK2D3AO.js";import"./Text-Dg9dYh63.js";import"./Hidden-DHN5dLew.js";import"./useFocusRing-jnagQyYL.js";import"./Form-BffRYw_3.js";import"./useFormValidation-B-ExQgbu.js";import"./Label-Y7OAC7uK.js";import"./useField-D3sSVYZC.js";import"./useLabel-CeJz4BMW.js";import"./useLabels-CFKWkPDt.js";import"./useToggle-DG2PHA9X.js";import"./useFormReset-CvckHHjx.js";import"./usePress-BpVHvCO3.js";import"./textSelection-Cj_b9rbF.js";import"./getMetaValue-TGQihhTK.js";import"./useSlot-DNsx0cSr.js";import"./useToggleState-DIBlFAqc.js";import"./useControlledState-D3rG0KvC.js";import"./useHover-BaAG1-q2.js";import"./VisuallyHidden-DlBkD_uH.js";import"./index-CSiDGQP5.js";import"./useLink-DY2Gm7C6.js";import"./getNodeText-C2sxHK1s.js";import"./BUIRoutingProvider-AZNaPzeL.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
