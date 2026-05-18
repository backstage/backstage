import{j as r,p as d}from"./iframe-t9H7a1GP.js";import{$ as m}from"./useFormValidation-C7fFAsQQ.js";import{$ as a}from"./Input-ChvyHnwH.js";import{$ as s}from"./TextField-CDd7R6RF.js";import{F as o}from"./FieldError-DtkF0abN.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B_HK0fZy.js";import"./useObjectRef-D-LfZK3P.js";import"./useFocusRing-DNWvY8RS.js";import"./openLink-B2Zr3UoO.js";import"./useHover-qr3gz19p.js";import"./Hidden-CpRkSTHD.js";import"./FieldError-CTPduq9I.js";import"./Text-BFIdZobh.js";import"./Autocomplete-BaTK0OPO.js";import"./keyboard-CM4wuuwl.js";import"./useEvent-Ch2RdOnN.js";import"./useLabels-C5_jB9N4.js";import"./useLocalizedStringFormatter-DhiAY8I9.js";import"./I18nProvider-IedlwoY8.js";import"./useControlledState-DpMbG7KC.js";import"./Label-BJGo-8TB.js";import"./useTextField-C-ULO0ld.js";import"./useField-BjWwUXpF.js";import"./useLabel-DKCkml_f.js";import"./useFormReset-AFJ5yClQ.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
