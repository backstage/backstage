import{bR as r,c7 as d}from"./iframe-DHsLdmE0.js";import{a as m}from"./useFormValidation-p_daFSoB.js";import{c as a}from"./Input-BnA6Jzsp.js";import{$ as s}from"./TextField-CsPmf_vx.js";import{F as o}from"./FieldError-BTTmwhiE.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DojvYQxY.js";import"./useObjectRef-BT9IXX-I.js";import"./useFocusRing-CDFFyFJa.js";import"./openLink--DhT0IgB.js";import"./useHover-Bx2eQJmr.js";import"./Hidden-BvNfuI3Q.js";import"./FieldError-C41zcCX2.js";import"./Text-KiuYMpek.js";import"./Autocomplete-D1vcVEPK.js";import"./keyboard-DJ7vT83c.js";import"./useEvent-FHg6aOMU.js";import"./useLabels-C6sZXPV2.js";import"./useLocalizedStringFormatter-C9zCrUYj.js";import"./I18nProvider-CE3c3hhV.js";import"./useControlledState-DS1kZzJm.js";import"./Label-P7WFsVIs.js";import"./useTextField-BA4kxORJ.js";import"./useField-Bkm1aCiA.js";import"./useLabel-oAlB9tb2.js";import"./useFormReset-BUXbtica.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
