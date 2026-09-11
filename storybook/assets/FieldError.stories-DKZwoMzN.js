import{bQ as r,c5 as d}from"./iframe-CZAQRplz.js";import{a as m}from"./useFormValidation-C7BXlo68.js";import{c as a}from"./Input-BGZ5ZOMc.js";import{$ as s}from"./TextField-B0_BYK7t.js";import{F as o}from"./FieldError-CgIP4zn5.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BddjkJjV.js";import"./useObjectRef-DwsoHqPD.js";import"./useFocusRing-w6vd38rs.js";import"./openLink-CS4qCOfy.js";import"./useHover-CrLHZKML.js";import"./Hidden-nk8B1O_e.js";import"./FieldError-Dqt9OQB4.js";import"./Text-oz8KmHCB.js";import"./Autocomplete-DrhcM_th.js";import"./keyboard-31lURow8.js";import"./useEvent-cTre3tI4.js";import"./useLabels-D2HB4ybw.js";import"./useLocalizedStringFormatter-DCKaeSgE.js";import"./I18nProvider-Dmp-YX3j.js";import"./useControlledState-Cx450bSi.js";import"./Label-Z5tvaBq7.js";import"./useTextField-BQ0nsv3j.js";import"./useField-D2ei1an_.js";import"./useLabel-CveRpJyO.js";import"./useFormReset-L2mPc2fw.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
