import{j as r,p as d}from"./iframe-Cz6SWQVH.js";import{$ as m}from"./useFormValidation-D_7zkheX.js";import{$ as a}from"./useTextField-C49JtK49.js";import{$ as s}from"./TextField-B8Wwy0Dh.js";import{F as o}from"./FieldError-DLGcm5AL.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DdYDv1my.js";import"./useObjectRef-B1XDxt8o.js";import"./useGlobalListeners-_pWc5lzW.js";import"./openLink-yrE7vS55.js";import"./Hidden-DyqXWYJG.js";import"./useHover-LSx6rYV4.js";import"./useField-CoFUr6lr.js";import"./useLabel-C4-PSEwD.js";import"./useLabels-CCt0vcrF.js";import"./useFormReset-B0RXVB7U.js";import"./useControlledState-DIn6soyg.js";import"./FieldError-Cc3YzjP5.js";import"./Text-BGEAm46S.js";import"./Autocomplete-8q4gaT1h.js";import"./keyboard-DV3FDKrT.js";import"./useEvent-Clq4kWZo.js";import"./useLocalizedStringFormatter-BUNlf1KX.js";import"./I18nProvider-ChnkasvC.js";import"./Label-ZZaSZ0gq.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const _=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,_ as __namedExportsOrder};
