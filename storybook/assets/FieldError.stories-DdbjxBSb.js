import{bR as r,c7 as d}from"./iframe-ttKo4f2F.js";import{a as m}from"./useFormValidation-DFe7ydc1.js";import{c as a}from"./Input-CYIbAQXq.js";import{$ as s}from"./TextField-BczKnM0d.js";import{F as o}from"./FieldError-uFmxIa-R.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C1HatmDL.js";import"./useObjectRef-CK28UWWB.js";import"./useFocusRing-DO5dfoZO.js";import"./openLink-DrXx31rJ.js";import"./useHover-zTEfdeKB.js";import"./Hidden-B19yG0l1.js";import"./FieldError-CONGBJVz.js";import"./Text-BStet0rF.js";import"./Autocomplete-DcP3dRW8.js";import"./keyboard-B0jD7YCN.js";import"./useEvent-CAl7p6Y1.js";import"./useLabels-BkKSc_yM.js";import"./useLocalizedStringFormatter-CMRKakYM.js";import"./I18nProvider-CE77ZQhE.js";import"./useControlledState-Dm95DOze.js";import"./Label-CNpe8i9L.js";import"./useTextField-BW7r-z_5.js";import"./useField-BC6B7UUn.js";import"./useLabel-BtTJK2a0.js";import"./useFormReset-Dd40QI8Q.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
