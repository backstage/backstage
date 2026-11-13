import{j as r,p as d}from"./iframe-jnmYTFb3.js";import{$ as m}from"./Form-Cx-jaggY.js";import{$ as a}from"./Input-CtX6cgqs.js";import{$ as s}from"./TextField-D72CR5bB.js";import{F as o}from"./FieldError-Cdr-d7_s.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CKg7Fv9H.js";import"./useObjectRef-FWUTxVt4.js";import"./useFormValidation-Dh_I7y9w.js";import"./useFocusRing-BdOMpJmy.js";import"./useHover-uknbF-p6.js";import"./Hidden-xHEnn_eG.js";import"./FieldError-Bb31lOY2.js";import"./Text-Dmw7G-Ih.js";import"./Autocomplete-BGEL4iKH.js";import"./keyboard-BEQ1RQMR.js";import"./getMetaValue-vz9tQ4MU.js";import"./useEvent-D0OSRjun.js";import"./useLabels-BVz1Fy9t.js";import"./useLocalizedStringFormatter-DSPB4nHm.js";import"./I18nProvider-CZql2cBv.js";import"./useControlledState-CrGsVDTu.js";import"./Label-B1pLoO_3.js";import"./useTextField-CopA5Leg.js";import"./useField-ChuJenZM.js";import"./useLabel-0FUhOvtV.js";import"./useFormReset-BqTrmbM5.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
