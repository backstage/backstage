import{bQ as r,c5 as d}from"./iframe-CLUDVQ5J.js";import{a as m}from"./useFormValidation-CBERPyny.js";import{c as a}from"./Input-B1aj2MuM.js";import{$ as s}from"./TextField-CUUQ9Kq7.js";import{F as o}from"./FieldError-CZ7BSG0h.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CdHRLi7C.js";import"./useObjectRef-CQXTcWYX.js";import"./useFocusRing-Cx5cCMJc.js";import"./openLink-lG-tuZVC.js";import"./useHover-DTy99tks.js";import"./Hidden-DkhqOV0y.js";import"./FieldError-DaJxDAqj.js";import"./Text-DDdAhRnT.js";import"./Autocomplete-Dtbkf9kY.js";import"./keyboard-CTVKKV84.js";import"./useEvent-BvcA7h7K.js";import"./useLabels-q6j7b-So.js";import"./useLocalizedStringFormatter-BScKml51.js";import"./I18nProvider-s5nF7SKo.js";import"./useControlledState-CzVtswPQ.js";import"./Label-CNIOxAyj.js";import"./useTextField-gz8a5pLp.js";import"./useField-D-2OJaRj.js";import"./useLabel-CjwBUe0X.js";import"./useFormReset-H3vuwfeO.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
