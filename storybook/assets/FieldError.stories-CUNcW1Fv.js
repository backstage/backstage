import{bR as r,c7 as d}from"./iframe-BoHeIN98.js";import{a as m}from"./useFormValidation-Bi5umGFZ.js";import{c as a}from"./Input-DKJdGjLg.js";import{$ as s}from"./TextField-lQrIgtca.js";import{F as o}from"./FieldError-DAA7p0C8.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-NIDZfutH.js";import"./useObjectRef-BJ7a64yy.js";import"./useFocusRing-CEefBRp7.js";import"./openLink-CzGsEk9E.js";import"./useHover-Cu7H8QbB.js";import"./Hidden-IbUh1Tr9.js";import"./FieldError-iHO14wwv.js";import"./Text-Bg-pZGbN.js";import"./Autocomplete-B2_RbWF2.js";import"./keyboard-DKS7P0hr.js";import"./useEvent-CrAwgrPn.js";import"./useLabels-BSyWgRhR.js";import"./useLocalizedStringFormatter-CKWspuV4.js";import"./I18nProvider-kpljWjCr.js";import"./useControlledState-Dk4KHo5d.js";import"./Label-D2ybsfze.js";import"./useTextField-WfqmPdwc.js";import"./useField-rZVhVtZ5.js";import"./useLabel-CtNFeKgI.js";import"./useFormReset-CjYaYx-G.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
