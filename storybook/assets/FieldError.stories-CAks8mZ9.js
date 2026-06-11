import{bR as r,c7 as d}from"./iframe-BhJ5Dr2k.js";import{a as m}from"./useFormValidation-CUwbtLUb.js";import{c as a}from"./Input-Dxtml_Qg.js";import{$ as s}from"./TextField-CE3uBmOK.js";import{F as o}from"./FieldError-sLUpWrAk.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BFxm53Bj.js";import"./useObjectRef-DS-cMayV.js";import"./useFocusRing-Cuqo7W1_.js";import"./openLink-aBKtIEgX.js";import"./useHover-BHUifURU.js";import"./Hidden-B-8QiBI_.js";import"./FieldError-DRosaC4y.js";import"./Text-5XkoPjYP.js";import"./Autocomplete-CDMSc76X.js";import"./keyboard-ChGE4Ait.js";import"./useEvent-3zBGNLoW.js";import"./useLabels-C0tiStcV.js";import"./useLocalizedStringFormatter-XUVBAnGX.js";import"./I18nProvider-C4_W1VA5.js";import"./useControlledState-DxaG0Jcp.js";import"./Label-DjyrHfTs.js";import"./useTextField-Cc3uqDkf.js";import"./useField-DBA_jhsz.js";import"./useLabel-BNB7Xfb7.js";import"./useFormReset-CmU_0Ju6.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
