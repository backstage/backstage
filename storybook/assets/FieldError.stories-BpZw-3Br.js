import{j as r,p as d}from"./iframe-CBMR_Zns.js";import{$ as m}from"./useFormValidation-m6j0Nnl-.js";import{$ as a}from"./Input-Ux0Kt_0Q.js";import{$ as s}from"./TextField-fYLzuH_F.js";import{F as o}from"./FieldError-CUC6OGGE.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-rWtpR1MY.js";import"./useObjectRef-Di5USI_f.js";import"./useFocusRing-BuESkXex.js";import"./openLink-ChAauiNp.js";import"./useHover-DV1SrM-M.js";import"./Hidden-BglMmnJ5.js";import"./FieldError-ZI6tW-Lc.js";import"./Text-IHK4rpmW.js";import"./Autocomplete-zMjsw1_l.js";import"./keyboard-AwonMwIP.js";import"./useEvent-Djna0NQy.js";import"./useLabels-FTexz-tp.js";import"./useLocalizedStringFormatter-mRejZbIc.js";import"./I18nProvider-oR5Ja0wv.js";import"./useControlledState-BBcQwN-x.js";import"./Label-DuWyQp2g.js";import"./useTextField-ZzRq5ejF.js";import"./useField-27slMnwn.js";import"./useLabel-n2lyhJGF.js";import"./useFormReset-C2xCdz2X.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
