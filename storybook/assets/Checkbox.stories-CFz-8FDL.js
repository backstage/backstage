import{bR as e,w as m,c7 as l}from"./iframe-DQtIir6_.js";import{C as r}from"./Checkbox-BrUZ2ZMG.js";import{F as p}from"./Flex-NAN1tDLO.js";import{L as u}from"./Link-D8XMErqO.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-BoCqY8co.js";import"./utils-Bxehr4HY.js";import"./useObjectRef-DXWxL9lA.js";import"./FieldError-X1ho85_q.js";import"./Text-C6rkAhiv.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./useFormValidation-CcujdjyJ.js";import"./Label-CAcSZgVu.js";import"./Hidden-BXNE10bz.js";import"./useField-X2MxXqm2.js";import"./useLabel-mAp9Q6tE.js";import"./useLabels-DLIlGtBk.js";import"./useToggle-Cbqcb5cb.js";import"./useFormReset-BmTewx61.js";import"./usePress-T3jvNl8O.js";import"./textSelection-Nrcy7rMY.js";import"./useToggleState-Dp6_0Jzd.js";import"./useControlledState-DM-B3g3-.js";import"./useHover-Dsk-KXl4.js";import"./VisuallyHidden-CmFx4Hen.js";import"./index-DAbm8TV7.js";import"./useLink-C2jx_QQ-.js";import"./useResolvedHref-DS33idVI.js";import"./getNodeText-lXATV8-K.js";const c=l.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(m,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
