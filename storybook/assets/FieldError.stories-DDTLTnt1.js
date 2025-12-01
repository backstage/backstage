import{j as r}from"./iframe-B07WZXM3.js";import{$ as d}from"./Form-DCMa2U0w.js";import{$ as o}from"./Input-BNt5aoVq.js";import{$ as s}from"./TextField-wCJ1cvvt.js";import{F as t}from"./FieldError-Cy9XT1Wf.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusable-Bqpbh0mx.js";import"./useObjectRef-B3Awy2p2.js";import"./clsx-B-dksMZM.js";import"./utils-DvOGICX6.js";import"./useFormReset-CainwUgF.js";import"./useControlledState-DyIaOuUg.js";import"./Text-DGhGM1JC.js";import"./useLabel-B8Ft0glu.js";import"./useLabels-D_qIOyTt.js";import"./Hidden-BrKpPNzK.js";import"./useFocusRing-RLYMdrIV.js";import"./FieldError-CZB-Dczh.js";import"./RSPContexts-CkV8bnEf.js";import"./Label-DKCIkf8E.js";import"./useStyles-CiUWLzHs.js";const S={title:"Backstage UI/FieldError",component:t},e={render:()=>r.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{})]})})},i={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:"This is a custom error message."})]})},a={render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(o,{}),r.jsx(t,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
