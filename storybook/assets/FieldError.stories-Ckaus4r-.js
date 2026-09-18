import{bQ as r,c5 as d}from"./iframe-CdNUyns1.js";import{a as m}from"./useFormValidation-DRFEp6qp.js";import{c as a}from"./Input-CfbbQHzS.js";import{$ as s}from"./TextField-CoRR2qpO.js";import{F as o}from"./FieldError-Bw1EKFCf.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B3O2Yp_M.js";import"./useObjectRef-CFuPSG1M.js";import"./useFocusRing-BuKVGuQV.js";import"./openLink-DihNKPlJ.js";import"./useHover-Cn5cU9qj.js";import"./Hidden-CS8th6sD.js";import"./FieldError-CdWPta5W.js";import"./Text-CYsN3RIY.js";import"./Autocomplete-BkQbc6kZ.js";import"./keyboard-DKfMEpD_.js";import"./useEvent-CUxtDg7f.js";import"./useLabels-uizblfZx.js";import"./useLocalizedStringFormatter-qf--bxfb.js";import"./I18nProvider-B6FBVrT9.js";import"./useControlledState-BN5fLvZ3.js";import"./Label-D16an-mE.js";import"./useTextField-CRnA5sL5.js";import"./useField-CmzNUn8V.js";import"./useLabel-BERv6pEw.js";import"./useFormReset-BRZSsq_e.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
