import{j as r,p as d}from"./iframe-B7ESvRaB.js";import{$ as m}from"./useFormValidation-b6a5_FZR.js";import{$ as a}from"./useTextField-Cr00JWXn.js";import{$ as s}from"./TextField-BBfY4r3N.js";import{F as o}from"./FieldError-BR-r3kZi.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cr8yviUJ.js";import"./useObjectRef-Dd7TU9CZ.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./openLink-BFNE09ao.js";import"./Hidden-CK51uwW5.js";import"./useHover-ByBQ7Oss.js";import"./useField-BUR4AR8N.js";import"./useLabel-4lo-IT0x.js";import"./useLabels-CZf5BL8e.js";import"./useFormReset-Cx4bKIVX.js";import"./useControlledState-CAbD27ky.js";import"./FieldError-eB_pr8Wa.js";import"./Text-DRd6SIAI.js";import"./Autocomplete-CNmEvmEM.js";import"./keyboard-D5YIFYbX.js";import"./useEvent-DHH67uGj.js";import"./useLocalizedStringFormatter-DDwB1B3c.js";import"./I18nProvider-BeIWmuaR.js";import"./Label-B06uCzgg.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
