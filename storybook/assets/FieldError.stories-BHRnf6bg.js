import{j as r,p as d}from"./iframe-K1-r__6v.js";import{$ as m}from"./useFormValidation-DCdCyMkZ.js";import{$ as a}from"./useTextField-AN4s7yIJ.js";import{$ as s}from"./TextField-BCuX-lMc.js";import{F as o}from"./FieldError-CK3VPBrG.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CmXvhRmv.js";import"./useObjectRef-B6g01Sss.js";import"./useGlobalListeners-hYY01nOS.js";import"./openLink-Buy5e0wx.js";import"./Hidden-Bruv6eby.js";import"./useHover-BjUJEgQT.js";import"./useField-DPkfUDN-.js";import"./useLabel-DIPqeGbV.js";import"./useLabels-WOLYX76B.js";import"./useFormReset-Cvno6jO2.js";import"./useControlledState-Dy4k5Q4V.js";import"./FieldError-CnXsXmD3.js";import"./Text-NxcU8Wst.js";import"./Autocomplete-CvG3U5A4.js";import"./keyboard-DxL8AXMs.js";import"./useEvent-CIbwz_kM.js";import"./useLocalizedStringFormatter-CfiXUqON.js";import"./I18nProvider-BOTPuHRS.js";import"./Label-DB_fk5tK.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
