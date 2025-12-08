import{j as r}from"./iframe-omS-VfEE.js";import{$ as d}from"./Form-BlX5J7Yp.js";import{$ as o}from"./Input-DEqK4bQx.js";import{$ as s}from"./TextField-oRWqLtWd.js";import{F as t}from"./FieldError-CxHqabB9.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-ehJVjgGZ.js";import"./useObjectRef-B0RPejrJ.js";import"./clsx-B-dksMZM.js";import"./utils-DLXcovlG.js";import"./useFormReset-BglsYpuv.js";import"./useControlledState-DJphQVnd.js";import"./Text-DXRpKqp0.js";import"./useLabel-BNIsNjqB.js";import"./useLabels-B2lHZLOH.js";import"./Hidden-DHOKYpmz.js";import"./useFocusRing-BHig4UXG.js";import"./FieldError-CUOAcPZ5.js";import"./RSPContexts-BCZNT60J.js";import"./Label-DLUiCF30.js";import"./useStyles-C35pT2tV.js";const S={title:"Backstage UI/FieldError",component:t},e={render:()=>r.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{})]})})},i={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
