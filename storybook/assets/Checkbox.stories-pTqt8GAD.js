import{j as e,M as m,p as d}from"./iframe-v7Qh39PS.js";import{C as r}from"./Checkbox-Bg5dlhf6.js";import{F as p}from"./Flex-DMu5EuQ1.js";import{L as u}from"./Link-DdDJsf-i.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-DguNZy1G.js";import"./utils-BTRkaVxP.js";import"./useObjectRef-D2k9dnBA.js";import"./FieldError-BZSNwmfj.js";import"./Text-BTRORdui.js";import"./useFocusable-RTAK5qqG.js";import"./openLink-DhJYPLui.js";import"./Form-DVx58Gd8.js";import"./Label-dqhcKEKx.js";import"./Hidden-DQKoMRUH.js";import"./useControlledState-uHAu_Mun.js";import"./useField-C9kn4VsB.js";import"./useLabel-EzumQXQv.js";import"./useLabels-BlAwLbEW.js";import"./useFocusRing-BTKZdzbY.js";import"./usePress-d5tNe03t.js";import"./textSelection-BeaNrXk5.js";import"./useToggle-0j1dLfDR.js";import"./useFormReset-BVXhgu2X.js";import"./useToggleState-BwQdW93K.js";import"./VisuallyHidden-IWS9gFxu.js";import"./index-C2rRWsJF.js";import"./getNodeText-BxA00fNY.js";import"./useLink-BnQsptZC.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Accept terms and conditions'
  }
})`,...t.input.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isSelected: true
  }
})`,...i.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Select all',
    isIndeterminate: true
  }
})`,...o.input.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...s.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
    </Flex>
})`,...n.input.parameters?.docs?.source}}};const O=["Default","Selected","Indeterminate","WithLongText","AllVariants"];export{n as AllVariants,t as Default,o as Indeterminate,i as Selected,s as WithLongText,O as __namedExportsOrder};
