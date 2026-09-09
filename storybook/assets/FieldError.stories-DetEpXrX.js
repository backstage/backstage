import{bQ as r,c5 as d}from"./iframe-wUGVZK80.js";import{a as m}from"./useFormValidation-DqwUvKPf.js";import{c as a}from"./Input-NXPn2g8K.js";import{$ as s}from"./TextField-B2Vk7FsF.js";import{F as o}from"./FieldError-DElk7ZMA.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-mEgVZwEH.js";import"./useObjectRef-Cer6noLc.js";import"./useFocusRing-BC7vVkX4.js";import"./openLink-D6ixiiSG.js";import"./useHover-DRcNaDP5.js";import"./Hidden-yseb-6tt.js";import"./FieldError-DakbevJf.js";import"./Text-nk-Fwv2h.js";import"./Autocomplete-PQK_iJWN.js";import"./keyboard-DQLW8ZAU.js";import"./useEvent-Co7ShWYJ.js";import"./useLabels-CANwnRLq.js";import"./useLocalizedStringFormatter-B0GnQ-25.js";import"./I18nProvider-Ci8FoB4z.js";import"./useControlledState-BP7q2gJ8.js";import"./Label-CZ0yGWTb.js";import"./useTextField-pS2dYT4L.js";import"./useField-CgH-KdhV.js";import"./useLabel-r6Cj49-v.js";import"./useFormReset-CMPleS-P.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
