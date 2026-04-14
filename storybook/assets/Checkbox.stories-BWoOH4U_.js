import{j as e,M as m,p as d}from"./iframe-KINrIo_f.js";import{C as r}from"./Checkbox-DMviSyhm.js";import{F as p}from"./Flex-3FJaFP3S.js";import{L as u}from"./Link-BaUc3-6X.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-BB815QrL.js";import"./utils-Dp48jrsX.js";import"./useObjectRef-Cl-GJEjw.js";import"./FieldError-CHy2zJ6h.js";import"./Text-BocnvHcP.js";import"./useFocusable-CaaSd55t.js";import"./openLink-BCV1Ju3v.js";import"./Form-Dteeinzj.js";import"./Label-CJonN38k.js";import"./Hidden-CKUXjs7V.js";import"./useControlledState-CmWPFpjF.js";import"./useField-CQ_siFYl.js";import"./useLabel-CtWiwLqZ.js";import"./useLabels-mheEzMbZ.js";import"./useFocusRing-BZvEHQX6.js";import"./usePress-BRBPsLh-.js";import"./textSelection-1F9aHMh8.js";import"./useToggle-DQyH9uCs.js";import"./useFormReset-CiyO9xzi.js";import"./useToggleState-BNCirzEB.js";import"./VisuallyHidden-B0kkQ8nV.js";import"./index-Dv1l67z5.js";import"./getNodeText-MPmDkoxK.js";import"./useLink-u3iPRNma.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
