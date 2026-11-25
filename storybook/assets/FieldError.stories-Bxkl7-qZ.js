import{j as r,p as d}from"./iframe-T196ztmH.js";import{$ as m}from"./Form-DCKRbBhQ.js";import{$ as a}from"./Input-C-xGK98H.js";import{$ as s}from"./TextField-jGNvpI7v.js";import{F as o}from"./FieldError-BcAJXMQJ.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-zm3gdQCr.js";import"./useObjectRef-_dSsW1Fk.js";import"./useFormValidation-DmvJMR95.js";import"./useFocusRing-DNtHiErB.js";import"./useHover-7-pgp0Ky.js";import"./Hidden-BBV6Ld8l.js";import"./FieldError-ihzqASzL.js";import"./Text-BOLLLJ4X.js";import"./Autocomplete-CjJ_F5TB.js";import"./keyboard-CJkcO-3v.js";import"./getMetaValue-DwQluMyN.js";import"./useEvent-Cke3Ncps.js";import"./useLabels-Cvihbbwm.js";import"./useLocalizedStringFormatter-DlzBfcjg.js";import"./I18nProvider-DNS4_F5r.js";import"./useControlledState-DuQaVgle.js";import"./Label-sNbExByb.js";import"./useTextField-CB7RKCz2.js";import"./useField-BOxSzQUy.js";import"./useLabel-BnuV1o8f.js";import"./useFormReset-CwpxsAfX.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
