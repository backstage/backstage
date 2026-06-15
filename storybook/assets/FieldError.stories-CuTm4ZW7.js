import{bR as r,c7 as d}from"./iframe-CNmrqhdp.js";import{a as m}from"./useFormValidation-DdWPpMBa.js";import{c as a}from"./Input-Dpe8d9Rx.js";import{$ as s}from"./TextField-TZsAGdhU.js";import{F as o}from"./FieldError-B4s9FQNG.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Sr-NPl0z.js";import"./useObjectRef-BygjGZ_P.js";import"./useFocusRing-B36xO6ag.js";import"./openLink-Dcd4pMbN.js";import"./useHover-BZGog5A_.js";import"./Hidden-DONWTan9.js";import"./FieldError-BAmg5VBk.js";import"./Text-DIH2iR11.js";import"./Autocomplete-CjUj2z_u.js";import"./keyboard-Dvuv5R5W.js";import"./useEvent-BD_f3oxO.js";import"./useLabels-BTxW8teZ.js";import"./useLocalizedStringFormatter-ByMVNtY0.js";import"./I18nProvider-PoM4EcNd.js";import"./useControlledState-CpemmCIy.js";import"./Label-Cb4DfX2Z.js";import"./useTextField-Bcbq09TS.js";import"./useField-DtngLnl2.js";import"./useLabel-CfM79w8Z.js";import"./useFormReset-D--OHsSZ.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
