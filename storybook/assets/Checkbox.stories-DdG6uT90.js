import{j as e,M as m,p as l}from"./iframe-DsaViRt6.js";import{C as r}from"./Checkbox-CcZjVzE1.js";import{F as p}from"./Flex-DTjaEUPS.js";import{L as u}from"./Link-DopmFt_Q.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-B3JZjCZr.js";import"./utils-BMtDQ3Mp.js";import"./useObjectRef-C8p51AiY.js";import"./FieldError-TG0Riy-r.js";import"./Text-GoRNm5GP.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./useFormValidation-BtIFnSNg.js";import"./Label-BVmI6bof.js";import"./Hidden-D546-sk9.js";import"./useField-ET5d43gu.js";import"./useLabel-yKsWsykb.js";import"./useLabels-DdirUbZa.js";import"./useToggle-CB7MZw_8.js";import"./useFormReset-DkLfLBli.js";import"./usePress-DMXgY0oY.js";import"./textSelection-8YvAK-Rq.js";import"./useToggleState-BlCBUQkI.js";import"./useControlledState-C9PUVjXY.js";import"./useHover-DqXkt4DH.js";import"./VisuallyHidden-BwUv9CCW.js";import"./index-B0Q9OrQR.js";import"./useLink-BXqpXIpj.js";import"./useResolvedHref-BnrY4UN4.js";import"./getNodeText-CRuIzOmM.js";const c=l.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(m,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const z=["Default","Selected","Indeterminate","WithLongText","Invalid","AllVariants"];export{a as AllVariants,t as Default,n as Indeterminate,o as Invalid,i as Selected,s as WithLongText,z as __namedExportsOrder};
