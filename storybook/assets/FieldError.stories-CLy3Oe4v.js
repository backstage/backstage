import{j as r,p as d}from"./iframe-CC8dZ5v0.js";import{$ as m}from"./useFormValidation-sG0q17Pr.js";import{$ as a}from"./Input-Az7S4Dd2.js";import{$ as s}from"./TextField-CwtqZZoj.js";import{F as o}from"./FieldError-DB3fc62x.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BJGNU2UD.js";import"./useObjectRef-DrnumOVC.js";import"./useGlobalListeners-VTBRwdE_.js";import"./openLink-R4xAzZJL.js";import"./useHover-BJkwObms.js";import"./Hidden-0OxxBXUx.js";import"./FieldError-B4SxufUN.js";import"./Text-DMMjCAFn.js";import"./Autocomplete-DI_V9cAQ.js";import"./keyboard-DOMww9i4.js";import"./useEvent-fTcL2C30.js";import"./useLabels-Ho-venkv.js";import"./useLocalizedStringFormatter-DJVXrFCw.js";import"./I18nProvider-CaDEb_MT.js";import"./useControlledState-CSasWubL.js";import"./Label-D8RauFTA.js";import"./useTextField-ECOxvN2s.js";import"./useField-KVyKcbSv.js";import"./useLabel-4Aw-DEns.js";import"./useFormReset-B6UV1Sqp.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
