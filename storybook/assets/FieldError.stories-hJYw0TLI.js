import{j as r,p as d}from"./iframe-CixUC8j1.js";import{$ as m}from"./Form-CLTaEjkT.js";import{$ as a}from"./Input-UXwc57E1.js";import{$ as s}from"./TextField-CmV0Lw2G.js";import{F as o}from"./FieldError-Dz790hUV.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C0RYu6E0.js";import"./useObjectRef-ZdsVGe-3.js";import"./useFormValidation-DC8UOFrP.js";import"./useFocusRing-CitxrkAs.js";import"./openLink-D1LWGCtX.js";import"./useHover-BFydUWI5.js";import"./Hidden-BWMUkUTp.js";import"./FieldError-BipE4jLN.js";import"./Text-DSi2Eais.js";import"./Autocomplete-Cr1IQX1D.js";import"./keyboard-molnQt7o.js";import"./getMetaValue-B3Np7h3R.js";import"./useEvent-C-wkqXQM.js";import"./useLabels-Dy-UjWsQ.js";import"./useLocalizedStringFormatter-B4ycpP_5.js";import"./I18nProvider-BvzqfVc8.js";import"./useControlledState-BB9FqNcJ.js";import"./Label-C5NXX0n-.js";import"./useTextField-D8zAFltw.js";import"./useField-DmhZx5df.js";import"./useLabel-D_XETIfd.js";import"./useFormReset-qN1ETd3H.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
