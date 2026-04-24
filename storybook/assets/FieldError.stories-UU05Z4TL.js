import{j as r,p as d}from"./iframe-Dl5_TB80.js";import{$ as m}from"./useFormValidation-DmmfnNyV.js";import{$ as a}from"./Input-4WNFixI8.js";import{$ as s}from"./TextField-BeHyqTdp.js";import{F as o}from"./FieldError-CxvdAmZA.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DGkaMaF3.js";import"./useObjectRef-C7LuogIC.js";import"./useGlobalListeners-CtaBTdJV.js";import"./openLink-k3Gx7yeJ.js";import"./useHover-9E6EvIXl.js";import"./Hidden-1cRpW4wa.js";import"./FieldError-NLt2HR8A.js";import"./Text-CmmTld-Z.js";import"./Autocomplete-cPStGh3M.js";import"./keyboard-9V0mj3_S.js";import"./useEvent-CDdnj45Y.js";import"./useLabels-CIaXcdIT.js";import"./useLocalizedStringFormatter-CkAdB0KW.js";import"./I18nProvider-DdxrthYO.js";import"./useControlledState-CbZzhw3I.js";import"./Label-CwMshdGF.js";import"./useTextField-i2xYGhQB.js";import"./useField-DlYL5pdu.js";import"./useLabel-Bd4C7Sd8.js";import"./useFormReset-BLjeDNKm.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
