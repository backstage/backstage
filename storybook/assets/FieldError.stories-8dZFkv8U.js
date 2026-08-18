import{bR as r,c7 as d}from"./iframe-Bfeun6FV.js";import{a as m}from"./useFormValidation-BCBDK8Qf.js";import{c as a}from"./Input-D48E8LcP.js";import{$ as s}from"./TextField-BEbCxHd1.js";import{F as o}from"./FieldError-DsJ-fXjs.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C1fACjU5.js";import"./useObjectRef-DpvjfcTN.js";import"./useFocusRing-D2D9w2h7.js";import"./openLink-Z9FeXa0N.js";import"./useHover-Bl99Bvws.js";import"./Hidden-sFV-2aQN.js";import"./FieldError-BWjgqGMr.js";import"./Text-DOL3ix9A.js";import"./Autocomplete-DZ5iwN9X.js";import"./keyboard-BTOl7xVT.js";import"./useEvent-vC-ysoRO.js";import"./useLabels-ClA9bczX.js";import"./useLocalizedStringFormatter-D_4gFDnf.js";import"./I18nProvider-TylybwwN.js";import"./useControlledState-CC8JDBnw.js";import"./Label-CMwfur8h.js";import"./useTextField-h-cI21RN.js";import"./useField-BxvGjrCe.js";import"./useLabel-fE5WpueX.js";import"./useFormReset-DCGdCl6y.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
