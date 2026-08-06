import{bR as r,c7 as d}from"./iframe-Dzms4wRw.js";import{a as m}from"./useFormValidation-Cd58uhD2.js";import{c as a}from"./Input-CEiWsu7-.js";import{$ as s}from"./TextField-DhX2VLw-.js";import{F as o}from"./FieldError-Bx_wtC13.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BkRQYljw.js";import"./useObjectRef-Ca6VrkU_.js";import"./useFocusRing-DjtUFVh9.js";import"./openLink-t121PK8W.js";import"./useHover-enCSdk4y.js";import"./Hidden-0sk5EwaH.js";import"./FieldError-CJ5WWEKj.js";import"./Text-j0FzBQF4.js";import"./Autocomplete-DY48s6Ea.js";import"./keyboard-VwG3rX6J.js";import"./useEvent-BfFHw6He.js";import"./useLabels-F2kTV9EY.js";import"./useLocalizedStringFormatter-GdUDRRmx.js";import"./I18nProvider-C1u0qXWv.js";import"./useControlledState-DlMtRXuC.js";import"./Label-2RfDNyJG.js";import"./useTextField-CG9MK4TE.js";import"./useField-DAhZtRcN.js";import"./useLabel-Dbodnstf.js";import"./useFormReset-CDw8_EEQ.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
