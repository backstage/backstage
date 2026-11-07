import{j as r,p as d}from"./iframe-psIK5yLO.js";import{$ as m}from"./Form-Bxro-USV.js";import{$ as a}from"./Input-DlLNH5sR.js";import{$ as s}from"./TextField-CNofrWyR.js";import{F as o}from"./FieldError-QiIs_lDl.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CftV7EFJ.js";import"./useObjectRef-JQhcLLWe.js";import"./useFormValidation-DCSuHTe1.js";import"./useFocusRing-MLrPTLpZ.js";import"./openLink-CZeZ1U9d.js";import"./useHover-B93NGpPn.js";import"./Hidden-EyJpXoDf.js";import"./FieldError-C-_S2X_i.js";import"./Text-MXkBOzgj.js";import"./Autocomplete-BZz0XNI4.js";import"./keyboard-BylIjWir.js";import"./getMetaValue-Cq3cpixi.js";import"./useEvent-CPLuyflN.js";import"./useLabels-F6gridtO.js";import"./useLocalizedStringFormatter-B5sY9Tzc.js";import"./I18nProvider-NMyyBc2c.js";import"./useControlledState-vYZGCggF.js";import"./Label-ChcPP0Iy.js";import"./useTextField-BjCw99mH.js";import"./useField-CEbJoclW.js";import"./useLabel-C2F-sL7S.js";import"./useFormReset-B7JhnxRP.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
