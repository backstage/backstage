import{bR as r,c7 as d}from"./iframe-D690ZVKa.js";import{a as m}from"./useFormValidation-qsZG3W-8.js";import{c as a}from"./Input-BcIjPPf8.js";import{$ as s}from"./TextField-CiTCarle.js";import{F as o}from"./FieldError-s74MDeYJ.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-D1ifMOcR.js";import"./useObjectRef-BPqBfMfb.js";import"./useFocusRing-CBblcblV.js";import"./openLink-DlPHZOe9.js";import"./useHover-Da9hkWGW.js";import"./Hidden--Qykx-Ic.js";import"./FieldError-Bg2OCVZ8.js";import"./Text-DseDNxUL.js";import"./Autocomplete-BRVeIDCi.js";import"./keyboard-D72E8r4x.js";import"./useEvent-DY20iqcf.js";import"./useLabels-D2HAWa9S.js";import"./useLocalizedStringFormatter-ByHr0kaQ.js";import"./I18nProvider-D9TsogMC.js";import"./useControlledState-S0N1AjAP.js";import"./Label-CHMEqKLB.js";import"./useTextField-CbO3TsY_.js";import"./useField-Ibn97tBU.js";import"./useLabel-Bv75J3A8.js";import"./useFormReset-kBO1a2OJ.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
