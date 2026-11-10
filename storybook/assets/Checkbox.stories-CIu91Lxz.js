import{j as e,M as m,p as l}from"./iframe-S5OJNhaE.js";import{C as r}from"./Checkbox-Cd0CjG4D.js";import{F as p}from"./Flex-BDHXNlSl.js";import{L as u}from"./Link-BAwAEzDG.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-DmMVdC0i.js";import"./utils-Bf43CEqe.js";import"./useObjectRef-Ce7Pg0IE.js";import"./FieldError-B0-R75VP.js";import"./Text-CxFSOtlL.js";import"./Hidden-bbdHFmyf.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./Form-CdsOyD6B.js";import"./useFormValidation-CHoAG3iu.js";import"./Label-Dm19jsZB.js";import"./useField-C9JYPx-z.js";import"./useLabel-D6KUrPXz.js";import"./useLabels-lt4DDiFl.js";import"./useToggle-BjSiBGxC.js";import"./useFormReset-CTFIfjuR.js";import"./usePress-BKUcGSaX.js";import"./textSelection-C5XFxsbn.js";import"./getMetaValue-DfvZTkcg.js";import"./useSlot-C8a7sDb8.js";import"./useToggleState-UjbHLguJ.js";import"./useControlledState-sjWVeRbh.js";import"./useHover-DRBklp1Y.js";import"./VisuallyHidden-DVzk229T.js";import"./index-BC5M37nw.js";import"./useLink-D_YD4HGA.js";import"./useResolvedHref-D6pj4Xy7.js";import"./getNodeText-opGXgiNZ.js";const c=l.meta({title:"Backstage UI/Checkbox",component:r}),t=c.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),n=c.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[d=>e.jsx(m,{children:e.jsx(d,{})})]}),o=t.extend({args:{isInvalid:!0}}),a=c.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"}),e.jsx(r,{isInvalid:!0,children:"Invalid"}),e.jsx(r,{isInvalid:!0,isSelected:!0,children:"Invalid & Checked"}),e.jsx(r,{isInvalid:!0,isIndeterminate:!0,children:"Invalid & Indeterminate"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const J=["Default","Selected","Indeterminate","WithLongText","Invalid","AllVariants"];export{a as AllVariants,t as Default,n as Indeterminate,o as Invalid,i as Selected,s as WithLongText,J as __namedExportsOrder};
