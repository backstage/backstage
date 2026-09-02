import{bQ as r,c5 as d}from"./iframe-BiC6vzfc.js";import{a as m}from"./useFormValidation-D7qN8pdJ.js";import{c as a}from"./Input-BvY9P7oi.js";import{$ as s}from"./TextField-BNwiLssK.js";import{F as o}from"./FieldError-BoToQClP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BQPJ15nW.js";import"./useObjectRef-rJAA83qf.js";import"./useFocusRing-CYz7DZLf.js";import"./openLink-fglnGFM4.js";import"./useHover-CRtjWjkD.js";import"./Hidden-DdtniuZ_.js";import"./FieldError-BQCqgleQ.js";import"./Text-DJ4PbFTT.js";import"./Autocomplete-L6wt6zc3.js";import"./keyboard-D5DMZ6gP.js";import"./useEvent-Dd_RM8Os.js";import"./useLabels-Kk8q7j9x.js";import"./useLocalizedStringFormatter-D_kpWZGR.js";import"./I18nProvider-DJaDCNar.js";import"./useControlledState-CjMsoNHV.js";import"./Label-Dt81RO29.js";import"./useTextField-sAn9ne3h.js";import"./useField-BK37-c9c.js";import"./useLabel-CfyoKpiQ.js";import"./useFormReset-Cq9Z1B3A.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
