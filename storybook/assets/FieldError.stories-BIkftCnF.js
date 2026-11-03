import{j as r,p as d}from"./iframe-BteMx7zj.js";import{$ as m}from"./Form-DxoMSjVw.js";import{$ as a}from"./Input-D1pCj6QR.js";import{$ as s}from"./TextField-ySXdlLs4.js";import{F as o}from"./FieldError-BVEMZcZy.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Csf2qqlx.js";import"./useObjectRef-Dv9hKxnj.js";import"./useFormValidation-DeKlK0iK.js";import"./useFocusRing-Yxf_B4Dt.js";import"./openLink-8VSUUPMi.js";import"./useHover-ZUHUyvdU.js";import"./Hidden-DJWYjR2p.js";import"./FieldError-1bM4kudQ.js";import"./Text-DAa_N41I.js";import"./Autocomplete-DEoGXkkT.js";import"./keyboard-BDZOpMnZ.js";import"./getMetaValue-CM24UgTH.js";import"./useEvent-zyxRaVJO.js";import"./useLabels-DAYEkzeR.js";import"./useLocalizedStringFormatter-BUNRCctA.js";import"./I18nProvider-D7X1BqX1.js";import"./useControlledState-B_XVpnvb.js";import"./Label-BS5nCX70.js";import"./useTextField-DURVcyoY.js";import"./useField-Dmr5l1Md.js";import"./useLabel-CNCzQYRH.js";import"./useFormReset-BkRpFdO1.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
