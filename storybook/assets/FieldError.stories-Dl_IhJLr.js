import{bQ as r,c5 as d}from"./iframe-Di5Wv8w_.js";import{a as m}from"./useFormValidation-DlvzbiO5.js";import{c as a}from"./Input-sOjH10cq.js";import{$ as s}from"./TextField-ZUUVqsL9.js";import{F as o}from"./FieldError-41BZcafy.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B6tfyu-3.js";import"./useObjectRef-VfTF6kKY.js";import"./useFocusRing-BPuyfxah.js";import"./openLink-BAk59qtu.js";import"./useHover-BfN1GoIh.js";import"./Hidden-CQX9C-br.js";import"./FieldError-Bjv2kxdK.js";import"./Text-B1IXOSEc.js";import"./Autocomplete-BSnZkzEE.js";import"./keyboard-NoPc3y_q.js";import"./useEvent-CuOYtYB8.js";import"./useLabels-B0juHqyU.js";import"./useLocalizedStringFormatter-BlsbGP9l.js";import"./I18nProvider-Dxi4hkuu.js";import"./useControlledState-BMloOWSe.js";import"./Label-C3XyxUp7.js";import"./useTextField-D7txPfzv.js";import"./useField-Ct6F0SgU.js";import"./useLabel-CGVvVLBl.js";import"./useFormReset-CYxgn0S-.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Form validationErrors={{
    demo: 'This is a server validation error.'
  }}>
      <TextField name="demo" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
        <Input />
        <FieldError />
      </TextField>
    </Form>
})`,...e.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <TextField isInvalid validationBehavior="aria" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>This is a custom error message.</FieldError>
    </TextField>
})`,...i.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <TextField isInvalid validationBehavior="aria" validate={() => 'This field is invalid'} style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>
        {({
        validationErrors
      }) => validationErrors.length > 0 ? validationErrors[0] : 'Field is invalid'}
      </FieldError>
    </TextField>
})`,...t.input.parameters?.docs?.source}}};const k=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,k as __namedExportsOrder};
