import{bQ as r,c5 as d}from"./iframe-Zd-YI-2K.js";import{a as m}from"./useFormValidation-DCAqIXhc.js";import{c as a}from"./Input-DNefN7x7.js";import{$ as s}from"./TextField-CkpljehF.js";import{F as o}from"./FieldError-DcteGN6b.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-B9HGNt0C.js";import"./useObjectRef-CSGev21E.js";import"./useFocusRing-B2ToGNzb.js";import"./openLink-Bn8ArFiV.js";import"./useHover-BUmLyoKK.js";import"./Hidden-5-RKz3aG.js";import"./FieldError-5PqzcpId.js";import"./Text-BJ1H8aMC.js";import"./Autocomplete-DTC98uk5.js";import"./keyboard-D9WPU0OD.js";import"./useEvent-Bvwyi-gT.js";import"./useLabels-Qd-JAFm0.js";import"./useLocalizedStringFormatter-1rTSaIVc.js";import"./I18nProvider-BhAOc9Ga.js";import"./useControlledState-DInYdsj6.js";import"./Label-YhzAN0Eo.js";import"./useTextField-BK-HcGoi.js";import"./useField-Cx2viaGD.js";import"./useLabel-CKKQW7cE.js";import"./useFormReset-CiFp_S2j.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
