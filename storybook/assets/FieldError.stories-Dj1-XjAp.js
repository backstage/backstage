import{j as r,p as d}from"./iframe-DIcQvc_4.js";import{$ as m}from"./useFormValidation-DdNhI11s.js";import{$ as a}from"./Input-DPAuMq7N.js";import{$ as s}from"./TextField-D7ufL-u3.js";import{F as o}from"./FieldError-CE8xhb3F.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-JYodRznf.js";import"./useObjectRef-CQfKhSp8.js";import"./useFocusRing-C4tfuByP.js";import"./openLink-BR6QeS5d.js";import"./useHover-CrozpiDB.js";import"./Hidden-BBwtWmDi.js";import"./FieldError-BmDNj2fS.js";import"./Text-CiWDOLRD.js";import"./Autocomplete-4JeE3WOL.js";import"./keyboard-taUe_H6E.js";import"./useEvent-DE6s5RBO.js";import"./useLabels-ITbgZNHU.js";import"./useLocalizedStringFormatter-CpwYaMVi.js";import"./I18nProvider-BUw0KQ7A.js";import"./useControlledState-CaCljqv7.js";import"./Label-CLke59gh.js";import"./useTextField-Dx3e69-L.js";import"./useField-BhZZQjtf.js";import"./useLabel-BYY4_2g1.js";import"./useFormReset-ZBhvFFWB.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
