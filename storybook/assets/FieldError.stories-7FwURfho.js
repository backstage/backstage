import{j as r,p as d}from"./iframe-V0mCSmm6.js";import{$ as m}from"./useFormValidation-B26hhFpA.js";import{$ as a}from"./Input-DjPZTvBH.js";import{$ as s}from"./TextField-DBYmzKu2.js";import{F as o}from"./FieldError-DHYjLTJm.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BDE85oZ4.js";import"./useObjectRef-Ds30v8Tp.js";import"./useGlobalListeners-CKMdmYgV.js";import"./openLink-C69Yx9MB.js";import"./useHover-CFiSx20A.js";import"./Hidden-CLW6bt9s.js";import"./FieldError-dAo41XPK.js";import"./Text-Cn_gwYjP.js";import"./Autocomplete-Csj1k8WT.js";import"./keyboard-DADT6wG6.js";import"./useEvent-EHtBNGAY.js";import"./useLabels-Bih5Ckwh.js";import"./useLocalizedStringFormatter-C-gNs3QG.js";import"./I18nProvider-mLa6b5wO.js";import"./useControlledState-MEnSdpzT.js";import"./Label-Cr8bMF7C.js";import"./useTextField-CFEosqmY.js";import"./useField-DGxVmDro.js";import"./useLabel-CR4CoWQK.js";import"./useFormReset-CId3_isl.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
