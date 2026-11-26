import{j as e,p as m}from"./iframe-bb_jNxxL.js";import{T as l}from"./TestRouter-CbDFQ_sS.js";import{C as r}from"./Checkbox-CADseUAF.js";import{F as p}from"./Flex-D3YPdrY_.js";import{L as u}from"./Link-CqA1DZlI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B6EXqJ8A.js";import"./BUIProvider-3fANo4od.js";import"./Checkbox-CFWUHSyR.js";import"./utils-Cyge8L4m.js";import"./useObjectRef-CTDjzFB8.js";import"./FieldError-CzTxz--v.js";import"./Text-BtpIt2qG.js";import"./Hidden-7ff-isZb.js";import"./useFocusRing-DDqjVrJn.js";import"./Form-C58QXp5W.js";import"./useFormValidation-CWqstwdw.js";import"./Label-C64Zc2HQ.js";import"./useField-BGbko4b6.js";import"./useLabel-DvDKUI6U.js";import"./useLabels-B5_kFWwx.js";import"./useToggle-DUW4KvUx.js";import"./useFormReset-Dv4_zW6V.js";import"./usePress-iPbewX15.js";import"./textSelection-DLp-xbkE.js";import"./getMetaValue-BAPq9Qsv.js";import"./useSlot-CXHaPOJK.js";import"./useToggleState-4ZyGe8Tr.js";import"./useControlledState-B45Nf08u.js";import"./useHover-dfqWQZHs.js";import"./VisuallyHidden-V0bjBViI.js";import"./index-gvfFGbLs.js";import"./useLink-Cw4nOyzC.js";import"./getNodeText-XEz2Kd1g.js";import"./BUIRoutingProvider-DqHM2OTt.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
