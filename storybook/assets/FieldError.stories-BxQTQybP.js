import{bQ as r,c5 as d}from"./iframe-JPiukB_R.js";import{a as m}from"./useFormValidation-DY4ZlP36.js";import{c as a}from"./Input-zgYq2BzY.js";import{$ as s}from"./TextField-Da6ilYMb.js";import{F as o}from"./FieldError-Dwk4cM_f.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DDi5xxmN.js";import"./useObjectRef-DXVQTGA8.js";import"./useFocusRing-DaX8_kMK.js";import"./openLink-0QZlDlxj.js";import"./useHover-BNLW-94k.js";import"./Hidden-B-d7XQtl.js";import"./FieldError-CIAC_u_D.js";import"./Text-D1sILF3o.js";import"./Autocomplete-0FuprScb.js";import"./keyboard-DE38zrnp.js";import"./useEvent-BnHE3X8m.js";import"./useLabels-NEKiuqWd.js";import"./useLocalizedStringFormatter-CtZkUal3.js";import"./I18nProvider-DFp_bXrB.js";import"./useControlledState-BQx1jdRH.js";import"./Label-IokeRjbO.js";import"./useTextField-DnRlJLXB.js";import"./useField-UvHv0-tI.js";import"./useLabel-D_mWupuI.js";import"./useFormReset-BZnw3Fbe.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
