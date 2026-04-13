import{j as e,M as m,p as d}from"./iframe-Pg_F-I9L.js";import{C as r}from"./Checkbox-DUqayoVS.js";import{F as p}from"./Flex-Dm_vHZfB.js";import{L as u}from"./Link-BbYbeRx7.js";import"./preload-helper-PPVm8Dsz.js";import"./RSPContexts-CP7vpgdH.js";import"./utils-qMO_rWJq.js";import"./useObjectRef-HykmMk-o.js";import"./FieldError-Ci19Uhdz.js";import"./Text-llDYcWgc.js";import"./useFocusable-tELC1w7o.js";import"./openLink-CHCvyqBl.js";import"./Form-CeMUfUJs.js";import"./Label-3zKuDuDQ.js";import"./Hidden-Ys7ZlpFD.js";import"./useControlledState-CJUYhagC.js";import"./useField-Bk4bOBfV.js";import"./useLabel-Cv3Ke033.js";import"./useLabels-CfZuGdDh.js";import"./useFocusRing-CTLDmw4r.js";import"./usePress-D9RcbHE0.js";import"./textSelection-p-bbU3FQ.js";import"./useToggle-Cg_RpAj8.js";import"./useFormReset-pX1J00j9.js";import"./useToggleState-CMKN2xBw.js";import"./VisuallyHidden-Lu2_ql2A.js";import"./index-CSrWawO4.js";import"./getNodeText-D8ndoH4Y.js";import"./useLink-BJHUMWSy.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
