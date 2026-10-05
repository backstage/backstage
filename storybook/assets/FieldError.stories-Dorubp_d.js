import{j as r,p as d}from"./iframe-CbQECOPA.js";import{$ as m}from"./useFormValidation-CKGiJz9e.js";import{$ as a}from"./Input-CjJ1M9tR.js";import{$ as s}from"./TextField-DesdL-Qn.js";import{F as o}from"./FieldError-R52eNSBw.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BjKqyDUC.js";import"./useObjectRef-rAZvTeo9.js";import"./useFocusRing-BprGfwbh.js";import"./openLink-CkgyiaKP.js";import"./useHover-C0zeuS3S.js";import"./Hidden-Cie_Gmgv.js";import"./FieldError-CYK7f2yb.js";import"./Text-DTo7MTvL.js";import"./Autocomplete-BNai4oWa.js";import"./keyboard-BiB554EB.js";import"./useEvent-DYgfpRDF.js";import"./useLabels-Hmk_0Efx.js";import"./useLocalizedStringFormatter-B4KkAVMn.js";import"./I18nProvider-X_rloAM9.js";import"./useControlledState-BYBhhx6m.js";import"./Label-CmorgM_W.js";import"./useTextField-DyaWxWWJ.js";import"./useField-Bwd8Jmt6.js";import"./useLabel-BlUgJ3a0.js";import"./useFormReset-BJvTatsh.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
