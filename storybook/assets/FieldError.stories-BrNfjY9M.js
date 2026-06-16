import{bR as r,c7 as d}from"./iframe-A5q7KvPV.js";import{a as m}from"./useFormValidation-DEJ9EEyE.js";import{c as a}from"./Input-Dx-TcgvS.js";import{$ as s}from"./TextField-D8_j-PGr.js";import{F as o}from"./FieldError-mGUiV3LW.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bd1To_cp.js";import"./useObjectRef-DI-R3VBW.js";import"./useFocusRing-CPnrIyn1.js";import"./openLink-Cwj0uu6r.js";import"./useHover-BuQfyXDT.js";import"./Hidden-CskdN9Ng.js";import"./FieldError-CarArOa-.js";import"./Text-S0QT30oh.js";import"./Autocomplete-Ot2MDEsQ.js";import"./keyboard-owTSdexX.js";import"./useEvent-gKV9J6XA.js";import"./useLabels-CVaxSMYD.js";import"./useLocalizedStringFormatter-CJ3uu6qK.js";import"./I18nProvider-BQn_nrLl.js";import"./useControlledState-DL5QOA5t.js";import"./Label-DE0NX8eg.js";import"./useTextField-CBLcHat9.js";import"./useField-CE3-IKhf.js";import"./useLabel-Dsw_IjC-.js";import"./useFormReset-YQ3CTLA4.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
