import{bR as r,c7 as d}from"./iframe-D-U3XCi_.js";import{a as m}from"./useFormValidation-DIt9J9Zd.js";import{c as a}from"./Input-DCWvse9e.js";import{$ as s}from"./TextField-BAr02oNf.js";import{F as o}from"./FieldError-BrDpuaex.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BR4WWUPw.js";import"./useObjectRef-CPQl0FPH.js";import"./useFocusRing-ChTmVwiQ.js";import"./openLink-CUqeOgDt.js";import"./useHover-C7AGz9RX.js";import"./Hidden-BT-waPLA.js";import"./FieldError-DP0NgPGT.js";import"./Text-CA-ViSRt.js";import"./Autocomplete-BJ4aAY6l.js";import"./keyboard-CQJNIbp7.js";import"./useEvent-q-IyEWu-.js";import"./useLabels-CrgyuspR.js";import"./useLocalizedStringFormatter-CqlUbDUm.js";import"./I18nProvider-QDJG5ejG.js";import"./useControlledState-CXF1rY7r.js";import"./Label-67Mz0DTG.js";import"./useTextField-fdQNTT2p.js";import"./useField-CwYjWd3d.js";import"./useLabel-D8B5Ekv6.js";import"./useFormReset-DB--Cdia.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
