import{j as r,p as d}from"./iframe-BCuiGO18.js";import{$ as m}from"./useFormValidation-DDQUNMCB.js";import{$ as a}from"./Input-YrcqhNjP.js";import{$ as s}from"./TextField-Dyl9bkXg.js";import{F as o}from"./FieldError-ALlgHKsB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Dk-My0Vp.js";import"./useObjectRef-4ckOICrI.js";import"./useFocusRing-DLmUbRy9.js";import"./openLink-qumaaci0.js";import"./useHover-DAnXmX41.js";import"./Hidden-CQxh535z.js";import"./FieldError-BHS-ts2M.js";import"./Text-D_YSa9DZ.js";import"./Autocomplete-CblQiv1-.js";import"./keyboard-CW4oFFyD.js";import"./useEvent-4on_clb_.js";import"./useLabels-DNIhmQLC.js";import"./useLocalizedStringFormatter-DYH9mEAL.js";import"./I18nProvider-PVYTewA5.js";import"./useControlledState-BCKq2N8L.js";import"./Label-CP3Gf_jA.js";import"./useTextField-D88sn5Bj.js";import"./useField-XKRN51sf.js";import"./useLabel-Cghjfl30.js";import"./useFormReset-C5fpnI1D.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
