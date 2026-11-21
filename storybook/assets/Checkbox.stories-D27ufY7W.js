import{j as e,p as m}from"./iframe-81VbGqYS.js";import{T as l}from"./TestRouter-mD7dv3Pk.js";import{C as r}from"./Checkbox-XLO4GiKF.js";import{F as p}from"./Flex-Dv4Mz7Ju.js";import{L as u}from"./Link-x-sCiAJh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BTbib15M.js";import"./BUIProvider-E8WhSxx6.js";import"./Checkbox-BFVMZbPw.js";import"./utils-Bc3qSy6a.js";import"./useObjectRef-CnOD3daG.js";import"./FieldError-ptcf45Tc.js";import"./Text-Dwv53_8C.js";import"./Hidden-Cb1mFWSL.js";import"./useFocusRing-DYHYlv_4.js";import"./Form-BW2R70vK.js";import"./useFormValidation-iCx97y-U.js";import"./Label-Dd3OarLH.js";import"./useField-C1N2YRai.js";import"./useLabel-DNA1h8U7.js";import"./useLabels-DvwPDbuz.js";import"./useToggle-Bf44aoDr.js";import"./useFormReset-BBjLEm68.js";import"./usePress-Ck2OcU07.js";import"./textSelection-Dc2ic2y7.js";import"./getMetaValue-CCa-nVAs.js";import"./useSlot-CD39d2Zs.js";import"./useToggleState-CkpnsnHG.js";import"./useControlledState-DitDneEU.js";import"./useHover-BliW0Nnt.js";import"./VisuallyHidden-DRGpg-Tu.js";import"./index-CoR4Ep33.js";import"./useLink-CYC075cg.js";import"./getNodeText-_cKwjCAI.js";import"./BUIRoutingProvider-DmskIIHn.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
