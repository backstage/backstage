import{j as r,p as d}from"./iframe-D7zjeBit.js";import{$ as m}from"./useFormValidation-BZnA9AHx.js";import{$ as a}from"./Input-HiwRmiDu.js";import{$ as s}from"./TextField-LsBWKivw.js";import{F as o}from"./FieldError-Ck75auWg.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DT1TjeCF.js";import"./useObjectRef-DBuc4hsG.js";import"./useFocusRing-CcaS568W.js";import"./openLink-Cd2W8V43.js";import"./useHover-CAFK-SRk.js";import"./Hidden-eUWrODR3.js";import"./FieldError-DKsDpV1u.js";import"./Text-Cj3ktV05.js";import"./Autocomplete-BzMQjmnY.js";import"./keyboard-CxRj-QkP.js";import"./useEvent-D_rPYO66.js";import"./useLabels-DF4WD905.js";import"./useLocalizedStringFormatter-Cz5NmZgr.js";import"./I18nProvider-Bqk7J9JQ.js";import"./useControlledState-B97kHxGJ.js";import"./Label-BmMPPwxv.js";import"./useTextField-CXnvxD3U.js";import"./useField-tHYRkqMm.js";import"./useLabel-Dzvjg_te.js";import"./useFormReset-CWyOK-4w.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
