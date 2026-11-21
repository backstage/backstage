import{j as r,p as d}from"./iframe-SO2aIStn.js";import{$ as m}from"./Form-D-cmgni0.js";import{$ as a}from"./Input-DUNVeClm.js";import{$ as s}from"./TextField-C0hnPGso.js";import{F as o}from"./FieldError-wj2CKSs8.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CwhAgYFH.js";import"./useObjectRef-C4fVgNdG.js";import"./useFormValidation-DYfGZ5Hl.js";import"./useFocusRing-DHTQT_lC.js";import"./useHover-BwVq8lt0.js";import"./Hidden-DBz78_xE.js";import"./FieldError-DL_kDnPL.js";import"./Text-BwMA6h-D.js";import"./Autocomplete-BZ8YDJ7_.js";import"./keyboard-C1BU-mJQ.js";import"./getMetaValue-DQETedN7.js";import"./useEvent-CsLuvQke.js";import"./useLabels-Cfrddupv.js";import"./useLocalizedStringFormatter-_mO6LhbJ.js";import"./I18nProvider-BWEEs8VU.js";import"./useControlledState-BBNR5rbN.js";import"./Label-DQRKBs9u.js";import"./useTextField-DFNj753b.js";import"./useField-C1HA1GEO.js";import"./useLabel-BqXJUdIq.js";import"./useFormReset-CGHYUZyq.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
