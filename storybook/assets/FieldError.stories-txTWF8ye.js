import{bR as r,c7 as d}from"./iframe-DUP7Kr9f.js";import{a as m}from"./useFormValidation-wMuOtWAb.js";import{c as a}from"./Input-DwlhOTjU.js";import{$ as s}from"./TextField-B4IivZEu.js";import{F as o}from"./FieldError-4a8m_uDv.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-OsyFBnTM.js";import"./useObjectRef-BVJl6YFP.js";import"./useFocusRing-B1eaMwrg.js";import"./openLink-CpcL-pAy.js";import"./useHover-D-kET7Yv.js";import"./Hidden-DFXJQe4O.js";import"./FieldError-DN_xcTzW.js";import"./Text-CTeL5G12.js";import"./Autocomplete-UXx75M8g.js";import"./keyboard-wyu31WpW.js";import"./useEvent-HTZxTeYo.js";import"./useLabels-BZeNsKrn.js";import"./useLocalizedStringFormatter-BVbfSq6O.js";import"./I18nProvider-ByGA4yZu.js";import"./useControlledState-DtDFdZyB.js";import"./Label-BWr9MvjN.js";import"./useTextField-LhEkeYiB.js";import"./useField-CuB1pXJt.js";import"./useLabel-9tsjfF-g.js";import"./useFormReset-BlbVtN_H.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
