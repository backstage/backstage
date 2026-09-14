import{bQ as e,w as m,c5 as l}from"./iframe-DXdR4xPj.js";import{C as r}from"./Checkbox-D16an21y.js";import{F as p}from"./Flex-Cq1PC_VA.js";import{L as u}from"./Link-BNlANddI.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-CZif3-54.js";import"./utils-C-HUDFAG.js";import"./useObjectRef-CbSdwcnt.js";import"./FieldError-BWSEqUjJ.js";import"./Text-gNAEQAy_.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./useFormValidation-5SPC4rhD.js";import"./Label-Zek0cQNR.js";import"./Hidden-DEL9fdLN.js";import"./useField-RzY76_L5.js";import"./useLabel-BKLzxkTR.js";import"./useLabels-D61_ZlAV.js";import"./useToggle-m8MzKn9-.js";import"./useFormReset-CLOf4j1R.js";import"./usePress-CnZ4gSLR.js";import"./textSelection-BYJbH9-e.js";import"./useToggleState-Dkm5K2c-.js";import"./useControlledState-BREXAMRj.js";import"./useHover-DQCkeZXu.js";import"./VisuallyHidden-bnSaxykT.js";import"./index-DBKaRO06.js";import"./useLink-C7m3ooTt.js";import"./useResolvedHref-CWLs1pfc.js";import"./getNodeText-BvqNLFC8.js";const c=l.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(m,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
  decorators: [Story => <MemoryRouter>
        <Story />
      </MemoryRouter>]
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
})`,...a.input.parameters?.docs?.source}}};const q=["Default","Selected","Indeterminate","WithLongText","Invalid","AllVariants"];export{a as AllVariants,t as Default,n as Indeterminate,o as Invalid,i as Selected,s as WithLongText,q as __namedExportsOrder};
