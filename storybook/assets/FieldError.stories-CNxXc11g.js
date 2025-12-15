import{j as r}from"./iframe-C8uhRVJE.js";import{$ as d}from"./Form-18OY4tXT.js";import{$ as o}from"./Input-Dz535pJT.js";import{$ as s}from"./TextField-CBXGKuYk.js";import{F as t}from"./FieldError-n9LeqJ70.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-COEkweq7.js";import"./useObjectRef-cjvNMRWP.js";import"./clsx-B-dksMZM.js";import"./utils-CaN9CLvW.js";import"./useFormReset-CMuSYrwD.js";import"./useControlledState-6_9AJY7s.js";import"./Text-CNPX5vai.js";import"./useLabel-lGBhXIV6.js";import"./useLabels-clLl4RmR.js";import"./Hidden-DL0aPnmc.js";import"./useFocusRing-CdA_l91J.js";import"./FieldError-Cx5nQJZ6.js";import"./RSPContexts-B9_bnQZR.js";import"./Label-CDK0OA1X.js";import"./useStyles-D9upW2Nt.js";const S={title:"Backstage UI/FieldError",component:t},e={render:()=>r.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{})]})})},i={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <TextField isInvalid validationBehavior="aria" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>This is a custom error message.</FieldError>
    </TextField>
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const R=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,a as WithRenderProp,e as WithServerValidation,R as __namedExportsOrder,S as default};
