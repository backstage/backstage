import{j as r,p as d}from"./iframe-DWvOg1Nr.js";import{$ as m}from"./useFormValidation-dqv5PRTh.js";import{$ as a}from"./Input-D_1Oh_cE.js";import{$ as s}from"./TextField-DMMVZ7v_.js";import{F as o}from"./FieldError-CgRJrcBj.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DtKPZPYA.js";import"./useObjectRef-DrTl60C1.js";import"./useFocusRing-YnyZfhhs.js";import"./openLink-l0pO1O-P.js";import"./useHover-BBZSc4a-.js";import"./Hidden-cMg_glYf.js";import"./FieldError-Cn4RMDH6.js";import"./Text-D7tUisNB.js";import"./Autocomplete--OHIbt3H.js";import"./keyboard-DsYEEPu8.js";import"./useEvent-br1AIljo.js";import"./useLabels-C3rwEQd8.js";import"./useLocalizedStringFormatter-8YxUyZJo.js";import"./I18nProvider-CKpv70eZ.js";import"./useControlledState-C9nFpXLR.js";import"./Label-CaafuvKx.js";import"./useTextField-DD6tM4yt.js";import"./useField-Cz8KgY5A.js";import"./useLabel-Bai5AK5S.js";import"./useFormReset-CxVBRLBa.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
