import{bQ as r,c5 as d}from"./iframe-B771vieD.js";import{a as m}from"./useFormValidation-9u5BPFfE.js";import{c as a}from"./Input-C9mt94Bx.js";import{$ as s}from"./TextField-BesHBvQN.js";import{F as o}from"./FieldError-ytgu827_.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-piiChbE4.js";import"./useObjectRef-B_q1TfVk.js";import"./useFocusRing-C2ykLkBs.js";import"./openLink-AzCo47yl.js";import"./useHover-B_jF8Yhh.js";import"./Hidden-DiCVpsT2.js";import"./FieldError-3yynpqf_.js";import"./Text-C7Zn0WpC.js";import"./Autocomplete-C4yaEcL8.js";import"./keyboard-SkeTI-tm.js";import"./useEvent-C9lgzcbu.js";import"./useLabels-2XgX8oa0.js";import"./useLocalizedStringFormatter-N3j0wPvB.js";import"./I18nProvider-B3qRoePR.js";import"./useControlledState-xxmVxo9Z.js";import"./Label-CJhGoTGL.js";import"./useTextField-ta8DG0m3.js";import"./useField-BIaMG0YS.js";import"./useLabel-CXc7CDh8.js";import"./useFormReset-BE1g8HWI.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
