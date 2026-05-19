import{j as r,p as d}from"./iframe-BbcE2xlx.js";import{$ as m}from"./useFormValidation-C73d-4DM.js";import{$ as a}from"./Input-lAfVrzWc.js";import{$ as s}from"./TextField-DJlLJrXK.js";import{F as o}from"./FieldError-DfcOFlzM.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-ocis19_-.js";import"./useObjectRef-CIe7dQFw.js";import"./useFocusRing-BC3CU45L.js";import"./openLink-20IyJpTm.js";import"./useHover-BNwmytfM.js";import"./Hidden-C93haUqf.js";import"./FieldError-a4TAvjwk.js";import"./Text-Ct72wDGY.js";import"./Autocomplete-CRaLzT7p.js";import"./keyboard-nIto6CaS.js";import"./useEvent-CeJoJXAi.js";import"./useLabels-CujUkaDD.js";import"./useLocalizedStringFormatter-DKd8MKcv.js";import"./I18nProvider-BegBiu4N.js";import"./useControlledState-Dg1vtvcy.js";import"./Label-D2G3L1-3.js";import"./useTextField-sumrhilM.js";import"./useField-CmNAkUOo.js";import"./useLabel-CQKww-_H.js";import"./useFormReset-BCUUyuGy.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
