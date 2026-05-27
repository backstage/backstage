import{j as r,p as d}from"./iframe-BNTyYmtG.js";import{$ as m}from"./useFormValidation-fvekUHNM.js";import{$ as a}from"./Input-CD5Y9H5F.js";import{$ as s}from"./TextField-BN7UcQZc.js";import{F as o}from"./FieldError-DgX_rIp6.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CyuBiUD4.js";import"./useObjectRef-CDa-or3Y.js";import"./useFocusRing-BWmLw9rR.js";import"./openLink-Cp11RzW3.js";import"./useHover-X6HJJf1O.js";import"./Hidden-BtP4guDR.js";import"./FieldError--gXbzDCi.js";import"./Text-C8xpNyG_.js";import"./Autocomplete-1nPdkF4L.js";import"./keyboard-CNV-Sh3o.js";import"./useEvent-CVq293a6.js";import"./useLabels-CBB6X3-B.js";import"./useLocalizedStringFormatter-C0tJhbl8.js";import"./I18nProvider-B9FdOvIU.js";import"./useControlledState-rMbSRUJj.js";import"./Label-CNmmxM3d.js";import"./useTextField-BjP8T_w0.js";import"./useField-Ba3ZZIqM.js";import"./useLabel-CLTwzcls.js";import"./useFormReset-CiTePYjF.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
