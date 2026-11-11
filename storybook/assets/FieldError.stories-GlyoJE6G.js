import{j as r,p as d}from"./iframe-CIT-dZu_.js";import{$ as m}from"./Form-bWXWc4sj.js";import{$ as a}from"./Input-BIjePdm2.js";import{$ as s}from"./TextField-qHgibAE7.js";import{F as o}from"./FieldError-CWPMLAXJ.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-3SfRWDXk.js";import"./useObjectRef-B4D9CzQM.js";import"./useFormValidation-oa4sjkgN.js";import"./useFocusRing-ByVMGaNA.js";import"./useHover-tuK_rbDS.js";import"./Hidden-paCviALj.js";import"./FieldError-o5djUeGf.js";import"./Text-CzkJILey.js";import"./Autocomplete-NZhbccUZ.js";import"./keyboard-BWVXbNVx.js";import"./getMetaValue-SvU3Wp5k.js";import"./useEvent-NLk_1-hY.js";import"./useLabels-BEUaVICg.js";import"./useLocalizedStringFormatter-Ck0tckSr.js";import"./I18nProvider-CmgCSkj9.js";import"./useControlledState-Bo32Yv4j.js";import"./Label-BoyMwewe.js";import"./useTextField-DpnlZvWg.js";import"./useField-CyrTSk-V.js";import"./useLabel-Cq-2nnHJ.js";import"./useFormReset-BxKhZo52.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const w=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,w as __namedExportsOrder};
