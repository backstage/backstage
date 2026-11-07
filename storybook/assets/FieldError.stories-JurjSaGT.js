import{j as r,p as d}from"./iframe-DXL2wfUr.js";import{$ as m}from"./Form-DQaPpS9D.js";import{$ as a}from"./Input-DQSbawvQ.js";import{$ as s}from"./TextField-CrYJNcV2.js";import{F as o}from"./FieldError-C878VxlP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AUqHPGYf.js";import"./useObjectRef-B4LXbu6C.js";import"./useFormValidation-C1WpA2q7.js";import"./useFocusRing-Dz_6jVoa.js";import"./openLink-CjcP3ChZ.js";import"./useHover-Ci84khs7.js";import"./Hidden-MswoXlTM.js";import"./FieldError-DXZIAafe.js";import"./Text-Cfqlbe-2.js";import"./Autocomplete-_fWsJGvP.js";import"./keyboard-jTn08MKL.js";import"./getMetaValue-BT-1afLR.js";import"./useEvent-C0-PIxi7.js";import"./useLabels-CUtKyTJZ.js";import"./useLocalizedStringFormatter-BmzZBpD6.js";import"./I18nProvider-c1tBNH4d.js";import"./useControlledState-B45g810H.js";import"./Label-CTSb-hLZ.js";import"./useTextField-5QRXTDDq.js";import"./useField-ObDL9HD8.js";import"./useLabel-Dw1khwQq.js";import"./useFormReset-DI4gv__R.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const O=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,O as __namedExportsOrder};
