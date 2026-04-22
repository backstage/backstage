import{j as e,M as m,p as d}from"./iframe-CC8dZ5v0.js";import{C as r}from"./Checkbox-CXOunC8X.js";import{F as p}from"./Flex-CYiFln9u.js";import{L as u}from"./Link-b82Odtyk.js";import"./preload-helper-PPVm8Dsz.js";import"./Checkbox-CvRpt8J5.js";import"./utils-BJGNU2UD.js";import"./useObjectRef-DrnumOVC.js";import"./FieldError-B4SxufUN.js";import"./Text-DMMjCAFn.js";import"./useGlobalListeners-VTBRwdE_.js";import"./openLink-R4xAzZJL.js";import"./useFormValidation-sG0q17Pr.js";import"./Label-D8RauFTA.js";import"./Hidden-0OxxBXUx.js";import"./useField-KVyKcbSv.js";import"./useLabel-4Aw-DEns.js";import"./useLabels-Ho-venkv.js";import"./useHover-BJkwObms.js";import"./useToggle-CSuhLIyy.js";import"./useFormReset-B6UV1Sqp.js";import"./usePress-CY9pQlxN.js";import"./textSelection-F9xqT_S-.js";import"./useToggleState-DqwwQ6ib.js";import"./useControlledState-CSasWubL.js";import"./VisuallyHidden-BcXz6YOD.js";import"./index-D66fjpEe.js";import"./useLink-DQNVNqqC.js";import"./useResolvedHref-B0IX69ve.js";import"./getNodeText-B7pGr4qH.js";const a=d.meta({title:"Backstage UI/Checkbox",component:r}),t=a.story({args:{children:"Accept terms and conditions"}}),i=t.extend({args:{isSelected:!0}}),o=a.story({args:{children:"Select all",isIndeterminate:!0}}),s=t.extend({args:{children:e.jsxs(e.Fragment,{children:["I agree to receive future communication from Spotify. You may unsubscribe from these communications at any time. Please review our"," ",e.jsx(u,{href:"#",children:"Privacy Policy"})]})},decorators:[c=>e.jsx(m,{children:e.jsx(c,{})})]}),n=a.story({...t.input,render:()=>e.jsxs(p,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isIndeterminate:!0,children:"Indeterminate"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"}),e.jsx(r,{isIndeterminate:!0,isDisabled:!0,children:"Indeterminate & Disabled"})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};const q=["Default","Selected","Indeterminate","WithLongText","AllVariants"];export{n as AllVariants,t as Default,o as Indeterminate,i as Selected,s as WithLongText,q as __namedExportsOrder};
