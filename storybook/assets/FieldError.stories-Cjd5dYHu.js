import{bR as r,c7 as d}from"./iframe-B8uJzJnC.js";import{a as m}from"./useFormValidation-t3MKasab.js";import{c as a}from"./Input-fVCzcyQW.js";import{$ as s}from"./TextField-DkMtUnVW.js";import{F as o}from"./FieldError-lWKBMX_q.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C9WtHl0n.js";import"./useObjectRef-B58w8bQG.js";import"./useFocusRing-uHGre-No.js";import"./openLink-BUwh7SN8.js";import"./useHover-CGBJrmnR.js";import"./Hidden--CtbbQAG.js";import"./FieldError-TYXfNCFj.js";import"./Text-C2P1-Stb.js";import"./Autocomplete-nI_kARcr.js";import"./keyboard-DuJAq24v.js";import"./useEvent-Bv3yEJFZ.js";import"./useLabels-vvtSY4r8.js";import"./useLocalizedStringFormatter-Cmwn2jYC.js";import"./I18nProvider-BAFWouLl.js";import"./useControlledState-Bsv8jzCO.js";import"./Label-B8rV63W8.js";import"./useTextField-C0zGORas.js";import"./useField-CUj6IoGp.js";import"./useLabel-DuQ-sB8F.js";import"./useFormReset-X4EXoTS3.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
