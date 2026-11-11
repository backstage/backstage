import{j as e,p as m}from"./iframe-CIT-dZu_.js";import{T as l}from"./TestRouter-DxyzTFrB.js";import{C as r}from"./Checkbox-DqRiwNtS.js";import{F as p}from"./Flex-CX8pQVz7.js";import{L as u}from"./Link-uW6QcpYF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bElBlM3z.js";import"./BUIProvider-DvUfRZ9N.js";import"./Checkbox-DL3JETt-.js";import"./utils-3SfRWDXk.js";import"./useObjectRef-B4D9CzQM.js";import"./FieldError-o5djUeGf.js";import"./Text-CzkJILey.js";import"./Hidden-paCviALj.js";import"./useFocusRing-ByVMGaNA.js";import"./Form-bWXWc4sj.js";import"./useFormValidation-oa4sjkgN.js";import"./Label-BoyMwewe.js";import"./useField-CyrTSk-V.js";import"./useLabel-Cq-2nnHJ.js";import"./useLabels-BEUaVICg.js";import"./useToggle-DXuzU-ET.js";import"./useFormReset-BxKhZo52.js";import"./usePress-BOnalXjM.js";import"./textSelection-aEjP62Wo.js";import"./getMetaValue-SvU3Wp5k.js";import"./useSlot-B4fozM-U.js";import"./useToggleState-B8EKYbpe.js";import"./useControlledState-Bo32Yv4j.js";import"./useHover-tuK_rbDS.js";import"./VisuallyHidden-C5NMUpy-.js";import"./index-C4qi6jZX.js";import"./useLink-_mzc6dOY.js";import"./getNodeText-Ccf25D0P.js";import"./BUIRoutingProvider-6gcgcyzR.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
