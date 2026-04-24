import{j as r,p as d}from"./iframe-Co8mkF6n.js";import{$ as m}from"./useFormValidation-B_d_Ploj.js";import{$ as a}from"./Input-BXEMGmmF.js";import{$ as s}from"./TextField-U6kOA_G-.js";import{F as o}from"./FieldError-ChVEHsLo.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DFVjs8u4.js";import"./useObjectRef-CKxXIUuU.js";import"./useGlobalListeners-xgPoTTUI.js";import"./openLink-Dd3JFEWo.js";import"./useHover-Dpk2q5V4.js";import"./Hidden-BB_jtIZQ.js";import"./FieldError-KgOzCOLr.js";import"./Text-CctO4my8.js";import"./Autocomplete-2wxhl1YR.js";import"./keyboard-DMpPwGr0.js";import"./useEvent-ChskwOT9.js";import"./useLabels-C-5jw__4.js";import"./useLocalizedStringFormatter-CMC27ohZ.js";import"./I18nProvider-CgUstpXg.js";import"./useControlledState-CC0_950v.js";import"./Label-DFJY0nKj.js";import"./useTextField-DeepGYXq.js";import"./useField-DaoJWrKY.js";import"./useLabel-CAnYuo-X.js";import"./useFormReset-BwkCJt7U.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
