import{j as r,p as d}from"./iframe-DsaViRt6.js";import{$ as m}from"./useFormValidation-BtIFnSNg.js";import{$ as a}from"./Input-0kUbtdsi.js";import{$ as s}from"./TextField-DDPqmkJ3.js";import{F as o}from"./FieldError-s_CVaK5q.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BMtDQ3Mp.js";import"./useObjectRef-C8p51AiY.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./useHover-DqXkt4DH.js";import"./Hidden-D546-sk9.js";import"./FieldError-TG0Riy-r.js";import"./Text-GoRNm5GP.js";import"./Autocomplete-I0IZMQ4E.js";import"./keyboard-uKxI18m4.js";import"./useEvent-gqYo67_a.js";import"./useLabels-DdirUbZa.js";import"./useLocalizedStringFormatter-Dhnzadev.js";import"./I18nProvider-C_4m3VHk.js";import"./useControlledState-C9PUVjXY.js";import"./Label-BVmI6bof.js";import"./useTextField-CDL3kK35.js";import"./useField-ET5d43gu.js";import"./useLabel-yKsWsykb.js";import"./useFormReset-DkLfLBli.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
