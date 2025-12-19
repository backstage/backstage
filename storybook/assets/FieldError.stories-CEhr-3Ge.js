import{a3 as d,j as r}from"./iframe-DVMaQ9oH.js";import{$ as m}from"./Form-Ck5H2r6u.js";import{$ as o}from"./Input-CYAfRtwb.js";import{$ as s}from"./TextField-Dux8mNJ8.js";import{F as a}from"./FieldError-BigPeeOj.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-BYKXjAAR.js";import"./useObjectRef-D7pveDOS.js";import"./clsx-B-dksMZM.js";import"./utils-Cfuv5lKh.js";import"./useFormReset-BOf3qaGa.js";import"./useControlledState-BSdDH7Zq.js";import"./Text-CrvAjusf.js";import"./useLabel-Du1KAmYO.js";import"./useLabels-Cd7EjgnX.js";import"./Hidden-Dyosovpt.js";import"./useFocusRing-7SEUAEVi.js";import"./FieldError-DGaQaN-_.js";import"./RSPContexts-BU7NL7r0.js";import"./Label-AcMVbIcf.js";import"./useStyles-DYDwdb02.js";const l=d.meta({title:"Backstage UI/FieldError",component:a}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(a,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const C=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,C as __namedExportsOrder};
