import{j as e,p as m}from"./iframe-BS0xFXlr.js";import{T as l}from"./TestRouter-DiVja1l4.js";import{C as r}from"./Checkbox-DUSYw2T7.js";import{F as p}from"./Flex-Cah0h3u0.js";import{L as u}from"./Link-Co1qyAvC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BJ65rCJn.js";import"./BUIProvider-DQGs-4H3.js";import"./Checkbox-YjL5Edth.js";import"./utils-Cm8LN8Qs.js";import"./useObjectRef-DUcg5Ry6.js";import"./FieldError-B0W-gOBy.js";import"./Text-CuDGkaxu.js";import"./Hidden-B4kfQ2c4.js";import"./useFocusRing-DN0Vfw2w.js";import"./Form-Dzkw_-wT.js";import"./useFormValidation-BzvYcKAP.js";import"./Label-CYKe4XnV.js";import"./useField-D-T_edQG.js";import"./useLabel-BuvGyTAc.js";import"./useLabels-BEdhgbVu.js";import"./useToggle-Bg8dZukr.js";import"./useFormReset-C6LGHf4l.js";import"./usePress-DqAt-yTJ.js";import"./textSelection-CBFVLC_r.js";import"./getMetaValue-gNZTl7Dq.js";import"./useSlot-dAX1QDxG.js";import"./useToggleState-JujY5B-J.js";import"./useControlledState--_QEZGZM.js";import"./useHover-CBc8HZSH.js";import"./VisuallyHidden-CTRcAVBz.js";import"./index-DiKBASFX.js";import"./useLink-DehJ0YMq.js";import"./getNodeText-BkgZ_pUi.js";import"./BUIRoutingProvider-DEeoTJxk.js";const c=m.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(l,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
