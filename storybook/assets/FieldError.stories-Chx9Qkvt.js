import{bR as r,c7 as d}from"./iframe-X5mwL4tp.js";import{a as m}from"./useFormValidation-hr5mEY2s.js";import{c as a}from"./Input-DJuIrIG0.js";import{$ as s}from"./TextField-C0ZDCaAD.js";import{F as o}from"./FieldError-CIOznkIw.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DbglA0qc.js";import"./useObjectRef-B4ikIkxr.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./useHover-iQz_in6H.js";import"./Hidden-DXcGagMc.js";import"./FieldError-D3Li39rU.js";import"./Text-D1k2Dp8f.js";import"./Autocomplete-DZgLERJG.js";import"./keyboard-SH1FHugW.js";import"./useEvent-B9gIp-0I.js";import"./useLabels-CyId-J7Z.js";import"./useLocalizedStringFormatter-DJopSl5i.js";import"./I18nProvider-Cp8YwWQe.js";import"./useControlledState-VUJiIP94.js";import"./Label-Du0ObhKE.js";import"./useTextField-DinD4WeQ.js";import"./useField-O4p38GKT.js";import"./useLabel-DttWp7u_.js";import"./useFormReset-DGDQjoCT.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
