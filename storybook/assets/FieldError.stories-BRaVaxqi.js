import{j as r,p as d}from"./iframe-C23uhf86.js";import{$ as m}from"./useFormValidation-CYmyaPkp.js";import{$ as a}from"./Input-Do0_Yt4D.js";import{$ as s}from"./TextField-Bia9P3F_.js";import{F as o}from"./FieldError-Caq4zewp.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BTFvkEKN.js";import"./useObjectRef-CJDmkZpR.js";import"./useFocusRing-DjjD4IM-.js";import"./openLink-DxqMpht5.js";import"./useHover-CNSmrNNW.js";import"./Hidden-CRM2dL4T.js";import"./FieldError-iRPmrSuI.js";import"./Text-Yi6KgqO1.js";import"./Autocomplete-DFXl_Sx_.js";import"./keyboard-BpVW5L3b.js";import"./useEvent-BmJhPE79.js";import"./useLabels-BoutWtqQ.js";import"./useLocalizedStringFormatter-C_6ZgqaR.js";import"./I18nProvider-a-g2zHGf.js";import"./useControlledState-DD6mA6a5.js";import"./Label-BYGIUoFL.js";import"./useTextField-DnmWLnRM.js";import"./useField-8d5ZEGxO.js";import"./useLabel-Dyy8lcsl.js";import"./useFormReset-0pGRCi9e.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
