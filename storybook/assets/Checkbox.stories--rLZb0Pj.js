import{j as e,p as m}from"./iframe-a5iorYt_.js";import{T as l}from"./TestRouter--PYm8d_Y.js";import{C as r}from"./Checkbox-zfc7VOPj.js";import{F as p}from"./Flex-BzWS_GLR.js";import{L as u}from"./Link-BhR2cPFk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIXpXNvI.js";import"./BUIProvider-CnPnbG6C.js";import"./Checkbox-CGyXsH6c.js";import"./utils-CKuAz2Wi.js";import"./useObjectRef-DomNprMl.js";import"./FieldError-BwiCreHd.js";import"./Text-BzXkZD1r.js";import"./Hidden-Bu-9bwhW.js";import"./useFocusRing-BW-GobYG.js";import"./Form-9OpxVQln.js";import"./useFormValidation-S2CY6qm2.js";import"./Label-Orfe5toA.js";import"./useField-DZ_E8vUK.js";import"./useLabel-Bgchr9R9.js";import"./useLabels-BoVBLTQ5.js";import"./useToggle-B1O9WlVL.js";import"./useFormReset-CbHbRAHO.js";import"./usePress-BUjc0uWv.js";import"./textSelection-C8mzHD_X.js";import"./getMetaValue-BDmRRgum.js";import"./useSlot-DPw2L-J8.js";import"./useToggleState-KtY-mzt8.js";import"./useControlledState-x1Vpl6eH.js";import"./useHover-D7-ycX7p.js";import"./VisuallyHidden-Bfh8sdi2.js";import"./index-DmAgGD7M.js";import"./useLink-yQNKe3PO.js";import"./getNodeText-CzPV5887.js";import"./BUIRoutingProvider-B91F5UQb.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
