import{j as r,p as d}from"./iframe-BOELprFv.js";import{$ as m}from"./useFormValidation-C1kFvvb4.js";import{$ as a}from"./Input-B4P64nxn.js";import{$ as s}from"./TextField-D2ylwE3V.js";import{F as o}from"./FieldError-B5KKLUZ2.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CMfP5a9J.js";import"./useObjectRef-DxkXclDP.js";import"./useGlobalListeners-Dwin9QbU.js";import"./openLink-OWDAQw2O.js";import"./useHover-rD6pSZqo.js";import"./Hidden-CIUjISy6.js";import"./FieldError-UPtD9qTm.js";import"./Text-1jTbNMOq.js";import"./Autocomplete-CttmfgW8.js";import"./keyboard-BEUKpvVb.js";import"./useEvent-DmWKKIhl.js";import"./useLabels-VhtBpse3.js";import"./useLocalizedStringFormatter-Dr-TpJpK.js";import"./I18nProvider-B5mI5xOx.js";import"./useControlledState-4LqVtm1l.js";import"./Label-De-gsAC-.js";import"./useTextField-BgMpbc7n.js";import"./useField-DCxYgzN5.js";import"./useLabel-Bq-zls4u.js";import"./useFormReset-B_FQUy9d.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
