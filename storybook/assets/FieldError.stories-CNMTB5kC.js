import{j as r,p as d}from"./iframe-GY9q4FO8.js";import{$ as m}from"./Form-CPARlShW.js";import{$ as a}from"./Input-DXacu7fD.js";import{$ as s}from"./TextField-GSjExi-h.js";import{F as o}from"./FieldError-3YcCqC6F.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-UG8wIxPz.js";import"./useObjectRef-DlPyeYly.js";import"./useFormValidation-CIoGHvRM.js";import"./useFocusRing-BlRt_wPT.js";import"./openLink-CFz-JK3Y.js";import"./useHover-BHwy1G7-.js";import"./Hidden-nquVvtJw.js";import"./FieldError-w98q6zCm.js";import"./Text-CCPuhEw_.js";import"./Autocomplete-CrQwLSiz.js";import"./keyboard-BCJcwUXR.js";import"./getMetaValue-XB_wrXKe.js";import"./useEvent-aycS7oPM.js";import"./useLabels-DnIs0d0f.js";import"./useLocalizedStringFormatter-BqaF7StP.js";import"./I18nProvider-BhiwSHej.js";import"./useControlledState-BK9RR_T7.js";import"./Label-Bc_GMvnu.js";import"./useTextField-DmHH0Qdy.js";import"./useField-B4kUn8PC.js";import"./useLabel-uMVcdOMo.js";import"./useFormReset-BLa1fi_u.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
