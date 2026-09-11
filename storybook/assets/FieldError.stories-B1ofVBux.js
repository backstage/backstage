import{bQ as r,c5 as d}from"./iframe-CJeP2vvm.js";import{a as m}from"./useFormValidation-CBxiIw6I.js";import{c as a}from"./Input-Bc46tetu.js";import{$ as s}from"./TextField-CokkrCcJ.js";import{F as o}from"./FieldError-pmuFbcaX.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Ci9aOot6.js";import"./useObjectRef-C-2dJx3K.js";import"./useFocusRing-o6_0h1DB.js";import"./openLink-Dw-jVqrV.js";import"./useHover-Bg3BX-Db.js";import"./Hidden-BDNd3cL9.js";import"./FieldError-BkU6JVez.js";import"./Text-BA3ToQdd.js";import"./Autocomplete-Diq8wjE-.js";import"./keyboard-C_4fFDAk.js";import"./useEvent-BeGsBTLg.js";import"./useLabels-DRlool0j.js";import"./useLocalizedStringFormatter-r6ayiQJa.js";import"./I18nProvider-C7P3l0dN.js";import"./useControlledState-CqCclfwn.js";import"./Label-D4bUC6Na.js";import"./useTextField-l2U9Rhdp.js";import"./useField-CAcKkVb1.js";import"./useLabel-CmJz89mn.js";import"./useFormReset-D_rWU48j.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
