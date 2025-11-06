import{j as e}from"./iframe-DKl1TaBY.js";import{$ as d}from"./Form-DYw8-Sqj.js";import{$ as t}from"./Input-CCpTS05k.js";import{$ as o}from"./TextField-DAwzzGJw.js";import{F as s}from"./FieldError-1nIu1Yhz.js";import"./preload-helper-D9Z9MdNV.js";import"./useFocusRing-m_zlqpNl.js";import"./utils-ih_j407f.js";import"./clsx-B-dksMZM.js";import"./useFormReset-BA_u5cn5.js";import"./useControlledState-5ZwgRprs.js";import"./Text-Bi5gH-cw.js";import"./useLabels-Vp5U3kXQ.js";import"./Hidden-C-3P-8TB.js";import"./FieldError-Cwp00kop.js";import"./RSPContexts-BzUg7TeD.js";import"./Label-C8AhOPMe.js";import"./useStyles-CE3xc5I3.js";const D={title:"Backstage UI/FieldError",component:s},r={render:()=>e.jsx(d,{validationErrors:{demo:"This is a server validation error."},children:e.jsxs(o,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{})]})})},i={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:"This is a custom error message."})]})},a={render:()=>e.jsxs(o,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[e.jsx(t,{}),e.jsx(s,{children:({validationErrors:l})=>l.length>0?l[0]:"Field is invalid"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const W=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,a as WithRenderProp,r as WithServerValidation,W as __namedExportsOrder,D as default};
