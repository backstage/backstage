import{j as r,p as d}from"./iframe-7FfCsjQc.js";import{$ as m}from"./Form-qI6nggP9.js";import{$ as a}from"./Input-DyO4o2aC.js";import{$ as s}from"./TextField-CGBP8qlQ.js";import{F as o}from"./FieldError-b6gabSH2.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DkNeRnP6.js";import"./useObjectRef-CsTMWTDw.js";import"./useFormValidation-Bf6DMqH_.js";import"./useFocusRing-CHKTV0kp.js";import"./openLink-Ce5UoBQT.js";import"./useHover-Br5T7sDg.js";import"./Hidden-DWfTAcXo.js";import"./FieldError-DlP5L_Ea.js";import"./Text-gD4wc_j1.js";import"./Autocomplete-BcfTfzIB.js";import"./keyboard-B3r4E7N4.js";import"./getMetaValue-DunJaaKa.js";import"./useEvent-Bzfc_gjv.js";import"./useLabels-D-zjlwnt.js";import"./useLocalizedStringFormatter-xBjTaWVb.js";import"./I18nProvider-s8LwHCKO.js";import"./useControlledState-By3FW3bK.js";import"./Label-CfvtIL-W.js";import"./useTextField-SsEV2ZCG.js";import"./useField-BWh8M6zw.js";import"./useLabel-CcTyycKi.js";import"./useFormReset-CROC2zjd.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const O=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,O as __namedExportsOrder};
