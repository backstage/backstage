import{j as r,p as d}from"./iframe-CSz7VfT3.js";import{$ as m}from"./Form-DCmzyXZg.js";import{$ as a}from"./Input-rX87b3KQ.js";import{$ as s}from"./TextField-GeKm4VnC.js";import{F as o}from"./FieldError-BvVX8wrc.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DO510V5r.js";import"./useObjectRef-D_q6rl-C.js";import"./useFormValidation-BaS-Dz0q.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./useHover-C4tPk2eu.js";import"./Hidden-CM7FbOlL.js";import"./FieldError-D30XUBdE.js";import"./Text-M5JE05Z1.js";import"./Autocomplete-__qsaNuQ.js";import"./keyboard-Bg9gEdpU.js";import"./getMetaValue-C_A1bvat.js";import"./useEvent-B1v68yyd.js";import"./useLabels-53H5tn1J.js";import"./useLocalizedStringFormatter-C142jinZ.js";import"./I18nProvider-C8LosUml.js";import"./useControlledState-D9BG_cB_.js";import"./Label-AZq59z2_.js";import"./useTextField-B5NRQ6t7.js";import"./useField-CqcWBy83.js";import"./useLabel-B7GfVGDS.js";import"./useFormReset-9iV2nQ5O.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
