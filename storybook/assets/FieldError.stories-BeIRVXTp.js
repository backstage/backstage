import{j as r,p as d}from"./iframe-C8vBbMI-.js";import{$ as m}from"./useFormValidation-BYEWQaHx.js";import{$ as a}from"./Input-D0vDUCch.js";import{$ as s}from"./TextField-Btd3rx4e.js";import{F as o}from"./FieldError-rJ8nAtV1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CerafOdN.js";import"./useObjectRef-w7SDPJ-k.js";import"./useGlobalListeners-B1a-_PtV.js";import"./openLink-B9VHRTOW.js";import"./useHover-bFr0yBE9.js";import"./Hidden-Y5KeQSje.js";import"./FieldError-CkIyJwZd.js";import"./Text-BkGpp61l.js";import"./Autocomplete-Dacd6GYy.js";import"./keyboard-Db6GjkWt.js";import"./useEvent-DLU3L-Lt.js";import"./useLabels-D7tYLmjR.js";import"./useLocalizedStringFormatter-78qOGr4H.js";import"./I18nProvider--oqaU1ds.js";import"./useControlledState-KXKKTKqf.js";import"./Label-pU9V9ZQL.js";import"./useTextField-aXFfJKAl.js";import"./useField-B3g5PPj7.js";import"./useLabel-DCpQaTw3.js";import"./useFormReset-Z4CMgK74.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
