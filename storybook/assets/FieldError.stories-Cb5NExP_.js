import{j as r,p as d}from"./iframe-C0T-wj8W.js";import{$ as m}from"./useFormValidation-B7S68TAR.js";import{$ as a}from"./Input-Czz7PdOe.js";import{$ as s}from"./TextField-ChWfy70f.js";import{F as o}from"./FieldError-DS1Ro-w4.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DWZiO_08.js";import"./useObjectRef-DVCJqa8U.js";import"./useFocusRing-joMZDsYQ.js";import"./openLink-LrDtNDVV.js";import"./useHover-DyNd4yLY.js";import"./Hidden-TcqO5tnA.js";import"./FieldError-Udzpxthg.js";import"./Text-BBeij_j0.js";import"./Autocomplete-CU4Zs1gi.js";import"./keyboard-D3pxoLlz.js";import"./useEvent-gVCyhxLk.js";import"./useLabels-CVPJplK8.js";import"./useLocalizedStringFormatter-C4r0vgii.js";import"./I18nProvider-D4QipRf_.js";import"./useControlledState-IdCXNPGa.js";import"./Label-BxjaI0WI.js";import"./useTextField-Bxn58h0_.js";import"./useField-BnwYzPU7.js";import"./useLabel-AB1yFs8D.js";import"./useFormReset-BFZu_KQ5.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
