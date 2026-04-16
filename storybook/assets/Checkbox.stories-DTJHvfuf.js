import{j as e,M as m,p as d}from"./iframe-B7ESvRaB.js";import{C as r}from"./Checkbox-muLr498n.js";import{F as p}from"./Flex-Cmpf98Na.js";import{L as u}from"./Link-DAVUo9kS.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-3NDDesP0.js";import"./utils-Cr8yviUJ.js";import"./useObjectRef-Dd7TU9CZ.js";import"./FieldError-eB_pr8Wa.js";import"./Text-DRd6SIAI.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./openLink-BFNE09ao.js";import"./useFormValidation-b6a5_FZR.js";import"./Label-B06uCzgg.js";import"./Hidden-CK51uwW5.js";import"./useField-BUR4AR8N.js";import"./useLabel-4lo-IT0x.js";import"./useLabels-CZf5BL8e.js";import"./useHover-ByBQ7Oss.js";import"./useToggle-BpGVg3vF.js";import"./useFormReset-Cx4bKIVX.js";import"./usePress-HRSvR9KN.js";import"./textSelection-XuXSjEvl.js";import"./useToggleState-BiY6GoWV.js";import"./useControlledState-CAbD27ky.js";import"./VisuallyHidden-BCbZC_pS.js";import"./index-DbP8Hxod.js";import"./useLink-C4zSeWp7.js";import"./getNodeText-C-fdRcD6.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
