import{j as r,p as d}from"./iframe-BemVm3iW.js";import{$ as m}from"./useFormValidation-B11nhLHh.js";import{$ as a}from"./useTextField-FpHEC6MB.js";import{$ as s}from"./TextField-CTBaTQKI.js";import{F as o}from"./FieldError-B1_hyNvG.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-67UUfq9j.js";import"./useObjectRef-DNY1z9xy.js";import"./useGlobalListeners-DjNZsfXO.js";import"./openLink-DsdV9ckj.js";import"./Hidden-PdwGn6CK.js";import"./useHover-qzmeHD-I.js";import"./useField-B3R_LXuf.js";import"./useLabel-BKeoaEj8.js";import"./useLabels-Cns4Y3S6.js";import"./useFormReset-Bj_FEjdF.js";import"./useControlledState-65WJWsue.js";import"./FieldError-Cm8-SYqK.js";import"./Text-D4cNg7sI.js";import"./Autocomplete-D9aLX-8z.js";import"./keyboard-hLGg7bG7.js";import"./useEvent-BrF9lIRf.js";import"./useLocalizedStringFormatter-CJyK92B9.js";import"./I18nProvider-KlzMPuIO.js";import"./Label-CfLV2GEV.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
