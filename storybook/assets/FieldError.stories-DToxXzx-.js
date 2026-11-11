import{j as r,p as d}from"./iframe-CEdcshkh.js";import{$ as m}from"./Form-C1TWgvPe.js";import{$ as a}from"./Input-4DhKHAbt.js";import{$ as s}from"./TextField-ByqufoBg.js";import{F as o}from"./FieldError-kJpnXvIp.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B3z3rPQ3.js";import"./useObjectRef-Cea8mF9S.js";import"./useFormValidation-DNL4ciTO.js";import"./useFocusRing-CKR_B2iC.js";import"./useHover-C0ptGV0J.js";import"./Hidden-nn8Lz43U.js";import"./FieldError-Ry11NBFn.js";import"./Text-CBxuRi-e.js";import"./Autocomplete-0kwx_A17.js";import"./keyboard-CcJmHJZu.js";import"./getMetaValue-BMvIIQYf.js";import"./useEvent-CrCFiZpU.js";import"./useLabels-B11tK9ex.js";import"./useLocalizedStringFormatter-Bt4wlDEw.js";import"./I18nProvider-GWcSS_jn.js";import"./useControlledState-CY36eiiU.js";import"./Label-9Olhdt6S.js";import"./useTextField-Do_qjUTZ.js";import"./useField-qlQhlPsk.js";import"./useLabel-BWFl0EGX.js";import"./useFormReset-DV0mYMiO.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const w=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,w as __namedExportsOrder};
